#include <sys/types.h>
#include <sys/stat.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include <ctype/assert.h>
#include <osdep/constants.h>
#include <binding/sh-script.h>

/* Padd extra spaces, newline for each line of script. */
static const int sh_extra_arg  = 4;
static const int sh_extra_hdr  = 12;
static const int sh_max_cmdbuf = 32 * 1024;

/*
 * sh_gen_script_file
 * ------------------
 * Generate a temp. file to host the bash script.
 */
static FILE *
sh_gen_script_file(char **scpt_name, const char *path, const char *name)
{
    size_t       len;
    int          fd, ret;
    char         cmd[OSD_MAX_INPUT_LINE];
    FILE        *file;

    fd   = -1;
    file = NULL;
    *scpt_name = NULL;
    verify(path != NULL);

    if (name != NULL) {
        snprintf(cmd, OSD_MAX_INPUT_LINE, "mkdir -p %s", path);
        if (system(cmd) != 0) {
            return (NULL);
        }
        snprintf(cmd, OSD_MAX_INPUT_LINE, "%s/%s", path, name);
        file = fopen(cmd, "w+");
        if (file == NULL) {
            return (NULL);
        }
        fd         = fileno(file);
        len        = strlen(cmd) + 1;
        *scpt_name = (char *)malloc(len);
        strcpy(*scpt_name, cmd);
    } else {
        /* Generate a temp. file. */
        len = snprintf(cmd, OSD_MAX_INPUT_LINE, "%s/%u_XXXXXX", path, getpid());

        *scpt_name = (char *)malloc(len);
        strcpy(*scpt_name, cmd);

        fd = mkstemp(*scpt_name);
        if (fd < 0) {
            goto out;
        }
        file = fdopen(fd, "w");
        if (file == NULL) {
            goto out;
        }
    }
    ret = fchmod(fd, S_IXUSR | S_IRUSR | S_IWUSR);
    if (ret != 0) {
out:
        if (file != NULL) {
            fclose(file);
            unlink(*scpt_name);
        }
        free(*scpt_name);
        *scpt_name = NULL;
        return (NULL);
    }
    fprintf(file, "#!/bin/bash\n\n");
    return (file);
}

/*
 * sh_apply_in_vars
 * ----------------
 * Apply the given function to all elements of the input var array.
 */
static void
sh_apply_in_vars(sh_var_in_t *vars,
                 void        *arg,
                 void       (*apply_fn)(sh_var_in_t *, void *, const char *))
{
    const char  *inp;

    while (vars->sh_var_name != NULL) {
        if (vars->sh_fixed_val != NULL) {
            inp = vars->sh_fixed_val;
        } else {
            assert((vars->sh_rtime_val != NULL) && (*vars->sh_rtime_val != NULL));
            inp = *vars->sh_rtime_val;
        }
        apply_fn(vars, arg, inp);
        vars++;
    }
}

/*
 * Argument to apply a function to all elements of the input var array.
 */
typedef struct sh_inp_arg sh_inp_arg_t;
struct sh_inp_arg
{
    size_t      in_len;
    char       *in_exe;
    FILE       *in_file;
};

/*
 * sh_cal_len_inp_var
 * ------------------
 * Calculate the total length of input args.
 */
static void
sh_cal_len_inp_var(sh_var_in_t *var, void *arg, const char *inp)
{
    sh_inp_arg_t *cal;

    cal          = (sh_inp_arg_t *)arg;
    cal->in_len += (sh_extra_arg + strlen(inp) + strlen(var->sh_var_name));
}

/*
 * sh_fillin_inp_var
 * -----------------
 * Fill-in input assignemt to the exec script.
 */
static void
sh_fillin_inp_var(sh_var_in_t *var, void *arg, const char *inp)
{
    size_t        len;
    const char   *fmt;
    sh_inp_arg_t *scpt;

    fmt  = "%s=%s\n";
    scpt = (sh_inp_arg_t *)arg;
    if (scpt->in_file == NULL) {
        len = snprintf(scpt->in_exe, scpt->in_len,
                       fmt, var->sh_var_name, inp);
        scpt->in_exe += len;
        scpt->in_len -= len;
    } else {
        fprintf(scpt->in_file, fmt, var->sh_var_name, inp);
    }
}

/*
 * sh_fmt_script
 * -------------
 * Format the template script to actual script that can be executed.
 */
static FILE *
sh_fmt_script(sh_script_t  *scpt,
              char        **exe,
              size_t        limit,
              const char   *path,
              const char   *name)
{
    int           i;
    const char   *text;
    size_t        len;
    sh_inp_arg_t  input;

    /* Compute input length needed for shell input arguments section. */
    input.in_len = strlen(scpt->sh_bin) + sh_extra_hdr;
    sh_apply_in_vars(scpt->sh_in_vars, (void *)&input, sh_cal_len_inp_var);

    /* Compute input length for the rest of the script. */
    for (i = 0; scpt->sh_scripts[i] != NULL; i++) {
        input.in_len += (strlen(scpt->sh_scripts[i]) + sh_extra_arg);
    }

    /* Allocate exec script buffer or the file name for the script. */
    if (input.in_len < limit) {
        *exe = (char *)malloc(input.in_len);
        len  = snprintf(*exe, input.in_len, "%s '( ", scpt->sh_bin);

        input.in_exe  = *exe + len;
        input.in_len -= len;
        input.in_file = NULL;
    } else {
        input.in_exe  = NULL;
        input.in_file = sh_gen_script_file(exe, path, name);
        if (input.in_file == NULL) {
            return (NULL);
        }
    }
    /* Fill in input arguments section. */
    sh_apply_in_vars(scpt->sh_in_vars, (void *)&input, sh_fillin_inp_var);

    /* Fill in the script body section. */
    for (i = 0; scpt->sh_scripts[i] != NULL; i++) {
        text = scpt->sh_scripts[i];
        if (input.in_file == NULL) {
            len = snprintf(input.in_exe, input.in_len, "%s\n", text);
            input.in_exe += len;
            input.in_len -= len;
            verify(input.in_len >= 0);
        } else {
            fprintf(input.in_file, "%s\n", text);
        }
    }
    if (input.in_file == NULL) {
        len = snprintf(input.in_exe, input.in_len, " )' > /dev/null 2>&1");
        input.in_exe += len;
        input.in_len -= len;
        verify(input.in_len >= 0);
    } else {
        fflush(input.in_file);
    }
    return (input.in_file);
}

/*
 * sh_script_to_file
 * -----------------
 * Save the script template to an executable script pointed by the path/name.
 * Return TRUE if success; FALSE otherwise.
 */
bool
sh_script_to_file(sh_script_t *script, const char *path, const char *name)
{
    FILE  *file;
    char  *exe;

    file = sh_fmt_script(script, &exe, sh_max_cmdbuf, path, name);
    free(exe);

    if (file == NULL) {
        return (false);
    }
    fclose(file);
    return (true);
}

/*
 * sh_exec_bash_script
 * -------------------
 */
int
sh_exec_bash_script(sh_script_t *script)
{
    int     ret;
    FILE   *file;
    char   *exe;

    file = sh_fmt_script(script, &exe, sh_max_cmdbuf, "/tmp", NULL);
    if (file != NULL) {
        verify(exe != NULL);
        fclose(file);
        unlink(exe);
        verify(0 || "Not supported yet!\n");
    }
    if (script->sh_log_fn != NULL) {
        script->sh_log_fn(script->sh_arg, exe);
    }
    ret = system(exe);
    ret = WEXITSTATUS(ret);

    free(exe);
    return (ret);
}

/*
 * sh_free_bash_script
 * -------------------
 */
void
sh_free_bash_script(sh_script_t *script)
{
    sh_var_in_t   *in;
    sh_var_out_t  *out;

    for (in = &script->sh_in_vars[0]; in->sh_var_name != NULL; in++) {
        if (in->sh_fixed_val == NULL) {
            free(*in->sh_rtime_val);
        }
    }
    for (out = &script->sh_out_vars[0]; out->sh_beg_tag != NULL; out++) {
       assert((out->sh_val != NULL) && (*out->sh_val != NULL));
       free(*out->sh_val);
    }
}
