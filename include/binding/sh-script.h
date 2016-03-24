/*
 * Copyright (C) 2014-2015 Vy Nguyen
 * Github https://github.com/vy-nguyen/c-libraries
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */
#ifndef _BIDING_SH_SCRIPT_H_
#define _BIDING_SH_SCRIPT_H_

#include <ctype/types.h>

#ifdef __cplusplus
extern  "C" {
#endif /* __cplusplus */

/*
 * Pass a variable to a bash script.
 */
typedef struct sh_var_in sh_var_in_t;
struct sh_var_in
{
    const char     *sh_var_name;
    const char     *sh_fixed_val;
    char          **sh_rtime_val;
};

/*
 * Capure output from a bash script to a C string.
 */
typedef struct sh_var_out sh_var_out_t;
struct sh_var_out
{
    const char     *sh_beg_tag;
    const char     *sh_end_tag;
    char          **sh_val;
    void          (*sh_output_fn)(void *arg, char *out);
};

/*
 * Run an external bash script from C code.
 */
typedef struct sh_script sh_script_t;
struct sh_script
{
    const char     *sh_bin;
    const char     *sh_opts;
    sh_var_in_t    *sh_in_vars;
    sh_var_out_t   *sh_out_vars;
    const char    **sh_scripts;
    void           *sh_arg;
    void          (*sh_log_fn)(void *arg, char *log);
};

/*
 * sh_script_to_file
 * -----------------
 * Save the script struct to the executable script pointed by the name.
 * Return TRUE if success; FALSE if having failues.
 */
extern bool
sh_script_to_file(sh_script_t *script, const char *path, const char *name);

/*
 * sh_exec_bash_script
 * -------------------
 */
extern int
sh_exec_bash_script(sh_script_t *script);

/*
 * sh_free_bash_script
 * -------------------
 */
extern void
sh_free_bash_script(sh_script_t *script);

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _SH_SCRIPT_H_ */
