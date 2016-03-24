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
#include <stdint.h>
#include <stdio.h>

/*
 * hexdump
 * -------
 */
void
hexdump(const char *buf, size_t len)
{
    uint32_t  *data, end, i, j;
    char      *ascii, ch, text[17];

    data    = (uint32_t *)buf;
    end     = len / 4;
    text[0] = '\0';

    for (i = 0; i < end; i++) {
        ascii = (char *)(data + i);
        for (j = 0; j < 4; j++) {
            if (('0' <= ascii[j]) && (ascii[j] <= 'z')) {
                ch = ascii[j];
            } else {
                ch = '.';
            }
            text[((i << 2) & 0xf) + j] = ch;
        }
        if ((i & 0x3) == 0) {
            printf("0x%p: %08x ", data + i, data[i]);
        } else {
            printf("%08x ", data[i]);
            if ((i & 0x3) == 0x3) {
                printf(" %s\n", text);
                text[0] = '\0';
            }
        }
    }
    if ((--i & 0x3) != 0x3) {
        while ((i & 0x3) != 0x3) {
            printf("         ");
            i++;
        }
        printf(" %s\n", text);
    }
}

