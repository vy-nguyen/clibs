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
#ifndef _CONSTANTS_H_
#define _CONSTANTS_H_

/* Define all system-wide constants here.  Don't include any files here. */

#ifdef __cplusplus
extern  "C" {
#endif /* __cplusplus */

/* Common system constants. */
#define OSD_NIL                             (0)
#define OSD_INVAL_IDX                       (-1)
#define OSD_MAX_CPUS_SHFT                   (5)
#define OSD_MAX_CPUS                        (1 << OSD_MAX_CPUS_SHFT)
#define OSD_MAX_CPUS_MASK                   (OSD_MAX_CPUS - 1)
#define OSD_MAX_ERR_TEXT                    (128)

/* Common text processing constants. */
#define OSD_MAX_TOKEN_STR                   (80)
#define OSD_MAX_STDIO_BUF                   (4096)
#define OSD_MAX_FILENAME                    (256)
#define OSD_MAX_INPUT_LINE                  (1024)

/* System resource constants. */
#define CONTAINER_MAX_PHY_DEVS              (4096)

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _OSD_CONSTANTS_H_ */
