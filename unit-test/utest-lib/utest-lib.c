/*
 * Copyright (C) 2014-2015 Vy Nguyen
 * Github https://github.com/vy-nguyen/tvntd
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
#include <unistd.h>
#include <getopt.h>
#include <osdep/osdep.h>
#include <ctype/types.h>
#include <utest-lib.h>

/*
 * utest_getnum
 * ------------
 */
uint32_t
utest_getnum(const char *txt)
{
    char     buff[80], nl;
    uint32_t num;

    printf("%s", txt);
    scanf("%s", buff);
    scanf("%c", &nl);
    if (buff[0] == '0' && (buff[1] == 'x' || buff[1] == 'X')) {
        num = strtoul(buff, NULL, 16);
    } else {
        num = strtoul(buff, NULL, 10);
    }
    return (num);
}

/*
 * utest_getchar
 * -------------
 */
char
utest_getchar(const char *txt)
{
    char nl, ch;

    printf("%s", txt);
    scanf("%c", &ch);
    scanf("%c", &nl);
    return (ch);
}

/*
 * utest_getstr
 * ------------
 */
void
utest_getstr(const char *txt, char *str)
{
    char nl;

    printf("%s", txt);
    scanf("%s", str);
    scanf("%c", &nl);
}

static struct option utest_opt[] =
{
    { "trace",        1,         NULL, 't' },
    { "dir",          1,         NULL, 'd' },
    { "help",         0,         NULL, 'h' },
    { "cfg",          1,         NULL, 'c' },
    { NULL,           0,         NULL, 0 }
};

/*
 * utest_print_usage
 * -----------------
 */
static void
utest_print_usage(const char *prog)
{
    printf("Command line option for %s\n"
           "[--trace | -t <file>]  : open the trace file\n"
           "[--dir | -d <dirname>] : specify the base directory name\n"
           "[--cfg | -c <file>]    : specify the config file.\n"
           "[--help | -h]          : print this help text\n", prog);
}

/*
 * utest_parse_cmd_args
 * --------------------
 */
void
utest_parse_cmd_args(int argc, char **argv, utest_arg_t *arg)
{
    int c, idx;

    while (1) {
        c = getopt_long(argc, argv, "t:d:h", utest_opt, &idx);
        if (c == -1) {
            break;
        }
        switch (c) {
        case 't':
            arg->tst_trace_file = optarg;
            break;

        case 'd':
            arg->tst_base_dir = optarg;
            break;

        case 'c':
            arg->tst_cfg_file = optarg;
            break;

        case 'h':
        default:
            utest_print_usage(argv[0]);
            break;
        }
    }
    arg->tst_prog = argv[0];
}
