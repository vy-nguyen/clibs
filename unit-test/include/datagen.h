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
#ifndef _DATAGEN_H_
#define _DATAGEN_H_

#include <ctype/types.h>
#include <ctype/assert.h>

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

typedef enum
{
    DGEN_SEQ             = 0,
    DGEN_555AAA          = 1,
    DGEN_CONST           = 2,
    DGEN_MAX_TYPE
} dgen_type_e;

/*
 * Header that could be used to verify the generated data.
 */
#define DGEN_HDR_FIELDS                                                       \
    dgen_type_e          dgen_type;                                           \
    uint32_t             dgen_data_len

typedef struct dgen_hdr dgen_hdr_t;
struct dgen_hdr
{
    DGEN_HDR_FIELDS;
};

typedef struct dgen_ops dgen_ops_t;
struct dgen_ops
{
    void (*dgen_fill)(char *buf, size_t size);
    void (*dgen_verify)(const char *buf);

    void (*dgen_fill_key)(char *buf, size_t size, uint64_t key);
    void (*dgen_verify_key)(const char *buf, uint64_t key);
};

extern dgen_ops_t gl_dgen_ops[DGEN_MAX_TYPE];

/*
 * dgen_fill
 * ---------
 */
static inline void
dgen_fill(char *buf, size_t size, dgen_type_e type)
{
    gl_dgen_ops[type].dgen_fill(buf, size);
}

/*
 * dgen_fill_key
 * -------------
 */
static inline void
dgen_fill_key(char *buf, size_t size, dgen_type_e type, uint64_t key)
{
    gl_dgen_ops[type].dgen_fill_key(buf, size, key);
}

/*
 * dgen_verify_buf
 * ---------------
 */
static inline void
dgen_verify_buf(const char *buf)
{
    dgen_hdr_t *hdr;

    hdr = (dgen_hdr_t *)buf;
    verify(hdr->dgen_type < DGEN_MAX_TYPE);

    gl_dgen_ops[hdr->dgen_type].dgen_verify(buf);
}

/*
 * dgen_verify_buf_key
 * -------------------
 */
static inline void
dgen_verify_buf_key(const char *buf, uint64_t key)
{
    dgen_hdr_t *hdr;

    hdr = (dgen_hdr_t *)buf;
    verify(hdr->dgen_type < DGEN_MAX_TYPE);

    gl_dgen_ops[hdr->dgen_type].dgen_verify_key(buf, key);
}

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _DATAGEN_H_ */
