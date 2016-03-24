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
#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <unistd.h>
#include <fcntl.h>
#include <ctype.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netinet/ip.h>

#include <osdep/osdep.h>
#include <osdep/constants.h>
#include <utest-lib.h>
#include <umod/unix-util.h>

typedef enum {
    UTST_CONT        = 0,
    UTST_QUIT_SESS   = 1,
    UTST_QUIT_PROG   = 2,
    UTST_MAX_CODE
} shell_exit_e;

/*
 * Private data for the shell.
 */
typedef struct utst_shell_priv utest_shell_priv_t;
struct utst_shell_priv
{
    size_t         sh_prompt_len;
    fd_set             sh_cur_fds;
    fd_set             sh_act_fds;
    int                sh_max_fd;
    int                sh_main_fd;
};

/*
 * utest_shell_input
 * -----------------
 */
static shell_exit_e
utest_shell_input(utst_shell_t *shell, int ofd, char *input, size_t len)
{
    int           i, iter;
    size_t    ret;
    char         *arg, *tmp, *cmd, *out;
    utst_cmd_t   *handler;

    /* Get rid of the \n char & skip leading ws. */
    for (cmd = input; (*cmd != '\0') && isspace(*cmd); cmd++);
    for (arg = cmd; (*arg != '\0') && !isspace(*arg); arg++);
    for (tmp = arg; (*arg != '\0') && isspace(*arg); arg++);

    if (cmd[0] == '\0') {
        return (UTST_CONT);
    }
    *tmp = '\0';
    for (i = 0; shell->sh_cmdtab[i].sh_cmd != NULL; i++) {
        handler = &shell->sh_cmdtab[i];
        if (strcmp(cmd, handler->sh_cmd) == 0) {
            handler->sh_handler(ofd, arg);
            return (UTST_CONT);
        }
    }
    if (strcmp(cmd, "exit") == 0) {
        if ((shell->sh_port == 0) || (strstr(arg, "all") != NULL)) {
           return (UTST_QUIT_PROG);
       }
       return (UTST_QUIT_SESS);
    }
    len = OSD_MAX_STDIO_BUF;
    out = (char *)malloc(len);

    if (strcmp(cmd, "help") == 0) {
        *out = '\0';
        for (iter = 0; iter < 2; iter++) {
            for (i = 0; shell->sh_cmdtab[i].sh_cmd != NULL; i++) {
                handler = &shell->sh_cmdtab[i];
                if (handler->sh_cmd_help == NULL) {
                    continue;
                }
                if ((*arg != '\0') &&
                    (strstr(arg, handler->sh_cmd) == NULL)) {
                    continue;
                }
                ret = snprintf(out, len, "%s\n", handler->sh_cmd_help);
                write(ofd, out, ret);
            }
            if (*out != '\0') {
                /* Matched the help cmd or printed all helps in the 2nd iter. */
                break;
            }
            ret = snprintf(out, len,
                           "Unknown command: %s\n"
                           "Help for all commands\n", arg);
            write(ofd, out, ret);
            *arg = '\0';
        }
    } else {
        ret = snprintf(out, len, "Unknown command: %s\n", cmd);
        write(ofd, out, ret);
    }
    free(out);
    return (UTST_CONT);
}

/*
 * utest_shell_accept
 * ------------------
 * Accept the new connection and output the first prompt.
 */
static void
utest_shell_accept(utst_shell_t *shell)
{
    int                 nfd, ret;
    utest_shell_priv_t *prv;

    prv = (utest_shell_priv_t *)shell->sh_private;
    nfd = accept(prv->sh_main_fd, NULL, NULL);
    if (nfd < 0) {
        return;
    }
    ret = write(nfd, shell->sh_prompt, prv->sh_prompt_len);
    if (ret <= 0) {
        close(nfd);
        return;
    }
    fd_set_nonblock(nfd);
    FD_SET(nfd, &prv->sh_act_fds);

    if (prv->sh_max_fd < nfd) {
        prv->sh_max_fd = nfd;
    }
}

/*
 * utest_shell_process
 * -------------------
 */
static shell_exit_e
utest_shell_process(utst_shell_t *shell, int def_fd, char *inp, size_t len)
{
    int                 fd, in_fd, out_fd;
    size_t              in_len;
    shell_exit_e        rc, status;
    utest_shell_priv_t *prv;

    status = UTST_CONT;
    in_fd  = fileno(stdin);
    prv    = (utest_shell_priv_t *)shell->sh_private;

    for (fd = 0; fd < (prv->sh_max_fd + 1); fd++) {
        if (FD_ISSET(fd, &prv->sh_cur_fds)) {
            out_fd = def_fd;
            if (fd == in_fd) {
                /* Read from stdin. */
                in_len = len - 1;

            } else if (fd == prv->sh_main_fd) {
                in_len = 0;
                utest_shell_accept(shell);
                continue;

            } else {
                in_len = read(fd, inp, len - 1);
                if (in_len <= 0) {
                    close(fd);
                    FD_CLR(fd, &prv->sh_act_fds);
                    continue;
                }
                out_fd = fd;
                inp[in_len] = '\0';
            }
            rc = utest_shell_input(shell, out_fd, inp, in_len);
            if (rc != UTST_CONT) {
                if (fd != in_fd) {
                    close(fd);
                    FD_CLR(fd, &prv->sh_act_fds);
                }
                if (rc == UTST_QUIT_PROG) {
                    status = UTST_QUIT_PROG;
                }
            } else {
                in_len = snprintf(inp, len, "%s", shell->sh_prompt);
                write(out_fd, shell->sh_prompt, prv->sh_prompt_len);
            }
        }
    }
    return (status);
}

/*
 * utest_shell_loop
 * ----------------
 */
static void
utest_shell_loop(utst_shell_t *shell)
{
    int                 i, ret, in_fd, out_fd;
    shell_exit_e        status;
    utest_shell_priv_t *prv;
    char               *input;
    struct timeval      tout;

    input  = (char *)malloc(OSD_MAX_STDIO_BUF);
    prv    = (utest_shell_priv_t *)shell->sh_private;
    in_fd  = fileno(stdin);
    out_fd = fileno(stdout);

    FD_SET(prv->sh_main_fd, &prv->sh_act_fds);
    FD_SET(in_fd, &prv->sh_act_fds);
    prv->sh_max_fd = prv->sh_main_fd;

    for (status = UTST_CONT; status != UTST_QUIT_PROG; ) {
        prv->sh_cur_fds = prv->sh_act_fds;
        ret = select(prv->sh_max_fd + 1,
                     &prv->sh_cur_fds, NULL, NULL,
                     shell->sh_timeout);

        exit_assert(ret < 0, 1, "select");
        if (ret == 0) {
            /* Timeout. */
            if (shell->sh_tout_hdler == NULL) {
                /* Set default timeout value to 10 seconds. */
                tout.tv_sec       = 10;
                tout.tv_usec      = 0;
                shell->sh_timeout = &tout;
                continue;
            }
            shell->sh_tout_hdler(input, OSD_MAX_STDIO_BUF);
        }
        status = utest_shell_process(shell, out_fd, input, OSD_MAX_STDIO_BUF);
    }
    for (i = 0; i < (prv->sh_max_fd + 1); i++) {
        if (FD_ISSET(i, &prv->sh_act_fds)) {
            close(i);
        }
    }
    free(input);
}

/*
 * utest_shell
 * -----------
 */
void
utest_shell(utst_shell_t *shell)
{
    int                 ret, opt;
    struct sockaddr_in  adr;
    utest_shell_priv_t *prv;

    prv                = (utest_shell_priv_t *)malloc(sizeof(*prv));
    prv->sh_prompt_len = strlen(shell->sh_prompt);
    shell->sh_private  = prv;

    FD_ZERO(&prv->sh_act_fds);
    if (shell->sh_port != 0) {
        prv->sh_main_fd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
        exit_assert(prv->sh_main_fd < 0, 1, "socket");

        opt = 1;
        ret = setsockopt(prv->sh_main_fd,
                         SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
        exit_assert(ret < 0, 1, "setsockopt");

        adr.sin_family      = AF_INET;
        adr.sin_port        = htons(shell->sh_port);
        adr.sin_addr.s_addr = INADDR_ANY;

        ret = bind(prv->sh_main_fd, (struct sockaddr *)&adr, sizeof(adr));
        exit_assert(ret < 0, 1, "bind");

        ret = listen(prv->sh_main_fd, 5);
        exit_assert(ret < 0, 1, "bind");

        printf("'telnet localhost %d' to use the shell\n", shell->sh_port);
    } else {
        prv->sh_main_fd = fileno(stdin);
    }
    utest_shell_loop(shell);

    shell->sh_private = NULL;
    free(prv);
}

/*
 * utest_print
 * -----------
 */
void
utest_print(int ofd, const char *fmt, ...)
{
    char        buf[OSD_MAX_STDIO_BUF];
    va_list     args;
    size_t  len;

    va_start(args, fmt);
    len = vsnprintf(buf, OSD_MAX_STDIO_BUF, fmt, args);
    va_end(args);

    write(ofd, buf, len);
}
