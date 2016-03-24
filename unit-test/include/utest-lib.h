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
#ifndef _UTEST_LIB_H_
#define _UTEST_LIB_H_

#include <ctype/types.h>

#ifdef __cplusplus
extern  "C" {
#endif /* __cplusplus */

/*
 * Entry to handle CLI matching the command token.
 */
typedef struct utst_shell utst_shell_t;
typedef struct utst_cmd   utst_cmd_t;
struct utst_cmd
{
    const char          *sh_cmd;
    const char          *sh_cmd_help;
    void               (*sh_handler)(int sfd, char *cmdline);
};

/*
 * If sh_port = 0, do command line from stdin.  Otherwise, user can do
 * 'telnet port' to receive the command line shell.
 *
 * If timeout field is set, the sh_tout_hdler will be called to handle input
 * timeout.
 */
struct utst_shell
{
    int                  sh_port;
    const char          *sh_prompt;
    struct timeval      *sh_timeout;
    void               (*sh_tout_hdler)(char *input, size_t len);
    void                *sh_private;
    utst_cmd_t           sh_cmdtab[];
};

/*
 * utest_shell
 * --------------
 * A simple command line to provide interactive command line for desktop unit
 * test programs.
 */
extern void
utest_shell(utst_shell_t *shell);

/*
 * utest_print
 * -----------
 * Print to the interactive command line session.
 */
extern void
utest_print(int sfd, const char *fmt, ...);

/*
 * Unit test command line parsing & arguments; shared by many test programs.
 */
typedef struct utest_arg utest_arg_t;
struct utest_arg
{
    char                 *tst_prog;
    const char           *tst_trace_file;
    const char           *tst_base_dir;
    const char           *tst_cfg_file;
};

/*
 * utest_parse_cmd_args
 * --------------------
 */
extern void
utest_parse_cmd_args(int argc, char **argv, utest_arg_t *arg);

/*
 * Common routines for interactive unit test.
 */
extern uint32_t utest_getnum(const char *);
extern char     utest_getchar(const char *);
extern void     utest_getstr(const char *txt, char *str);

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _UTEST_LIB_H_ */
