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
#include <stdlib.h>
#include <datagen.h>

typedef struct dgen_ext_hdr dgen_ext_hdr_t;
struct dgen_ext_hdr
{
    DGEN_HDR_FIELDS;
    uint32_t             dgen_seed1;
    uint32_t             dgen_seed2;
    char                 dgen_data[];
};

typedef struct dgen_key_hdr dgen_key_hdr_t;
struct dgen_key_hdr
{
    DGEN_HDR_FIELDS;
    uint64_t            dgen_key;
    char                 dgen_data[];
};

typedef struct dgen_key_32 dgen_key_32_t;
struct dgen_key_32
{
    DGEN_HDR_FIELDS;
    uint64_t            dgen_key;
    char                 dgen_data[16];
};

/*
 * dgen_setup_hdr
 * --------------
 */
static dgen_hdr_t *
dgen_setup_hdr(char *buf, uint32_t data_len)
{
    dgen_hdr_t *hdr;

    assert(data_len > sizeof (*hdr));
    hdr = (dgen_hdr_t *)buf;
    hdr->dgen_data_len = data_len;

    return (hdr);
}

/*
 * dgen_fill_seq
 * -------------
 */
static void
dgen_fill_seq(char *buf, size_t size)
{
    uint32_t      *ptr, seq, lim, i;
    dgen_ext_hdr_t *hdr;

    hdr = (dgen_ext_hdr_t *)dgen_setup_hdr(buf, size - sizeof (*hdr));
    hdr->dgen_type  = DGEN_SEQ;
    hdr->dgen_seed1 = random();
    hdr->dgen_seed2 = 0;

    ptr = (uint32_t *)hdr->dgen_data;
    lim = hdr->dgen_data_len / sizeof (*ptr);
    seq = hdr->dgen_seed1;
    for (i = 0; i < lim; i++) {
        ptr[i] = seq++;
    }
}

/*
 * dgen_verify_seq
 * ---------------
 */
static void
dgen_verify_seq(const char *buf)
{
    uint32_t      *ptr, seq, lim, i;
    dgen_ext_hdr_t *hdr;

    hdr = (dgen_ext_hdr_t *)buf;
    ptr = (uint32_t *)hdr->dgen_data;
    lim = hdr->dgen_data_len / sizeof (*ptr);
    seq = hdr->dgen_seed1;
    for (i = 0; i < lim; i++) {
        verify(ptr[i] == seq++);
    }
}

/*
 * dgen_fill_key_seq
 * -----------------
 */
static void
dgen_fill_key_seq(char *buf, size_t size, uint64_t key)
{
    uint32_t      *ptr, seq, lim, i;
    dgen_key_hdr_t *hdr;

    hdr = (dgen_key_hdr_t *)dgen_setup_hdr(buf, size - sizeof (*hdr));
    hdr->dgen_type  = DGEN_SEQ;
    hdr->dgen_key   = key;

    ptr = (uint32_t *)hdr->dgen_data;
    lim = hdr->dgen_data_len / sizeof (*ptr);
    seq = (uint32_t)hdr->dgen_key;
    for (i = 0; i < lim; i++) {
        ptr[i] = seq++;
    }
}

/*
 * dgen_verify_key_seq
 * -------------------
 */
static inline void
dgen_verify_key_seq(const char *buf, uint64_t key)
{
    uint32_t      *ptr, seq, lim, i;
    dgen_key_hdr_t *hdr;

    hdr = (dgen_key_hdr_t *)buf;
    verify(hdr->dgen_key == key);

    ptr = (uint32_t *)hdr->dgen_data;
    lim = hdr->dgen_data_len / sizeof (*ptr);
    seq = (uint32_t)hdr->dgen_key;
    for (i = 0; i < lim; i++) {
        verify(ptr[i] == seq++);
    }
}

/*
 * dgen_fill_555aaa
 * ----------------
 */
static void
dgen_fill_555aaa(char *buf, size_t size)
{
    uint32_t       i;
    dgen_ext_hdr_t *hdr;

    hdr = (dgen_ext_hdr_t *)dgen_setup_hdr(buf, size - sizeof (*hdr));
    hdr->dgen_type  = DGEN_555AAA;
    hdr->dgen_seed1 = 0;
    hdr->dgen_seed2 = 0;
    for (i = 0; i < hdr->dgen_data_len; i++) {
        if ((i & 0x1) != 0) {
            hdr->dgen_data[i] = 0xa;
        } else {
            hdr->dgen_data[i] = 0x5;
        }
    }
}

/*
 * dgen_verify_555aaa
 * ------------------
 */
static void
dgen_verify_555aaa(const char *buf)
{
    uint32_t       i;
    dgen_ext_hdr_t *hdr;

    hdr = (dgen_ext_hdr_t *)buf;
    for (i = 0; i < hdr->dgen_data_len; i++) {
        if ((i & 0x1) != 0) {
            verify(hdr->dgen_data[i] == 0xa);
        } else {
            verify(hdr->dgen_data[i] == 0x5);
        }
    }
}

/*
 * dgen_fill_key_555aaa
 * --------------------
 */
static void
dgen_fill_key_555aaa(char *buf, size_t size, uint64_t key)
{
}

/*
 * dgen_verify_key_555aaa
 * ----------------------
 */
static void
dgen_verify_key_555aaa(const char *buf, uint64_t key)
{
}

/*
 * dgen_fill_const
 * ---------------
 */
static void
dgen_fill_const(char *buf, size_t size)
{
    dgen_ext_hdr_t *hdr;

    hdr = (dgen_ext_hdr_t *)dgen_setup_hdr(buf, size - sizeof (*hdr));
    hdr->dgen_type = DGEN_CONST;
}

/*
 * dgen_verify_const
 * -----------------
 */
static void
dgen_verify_const(const char *buf)
{
}

/*
 * dgen_fill_key_const
 * -------------------
 */
static void
dgen_fill_key_const(char *buf, size_t size, uint64_t key)
{
}

/*
 * dgen_verify_key_const
 * ---------------------
 */
static void
dgen_verify_key_const(const char *buf, uint64_t key)
{
}

dgen_ops_t gl_dgen_ops[DGEN_MAX_TYPE] =
{
    {    /* DGEN_SEQ */
        .dgen_fill       = dgen_fill_seq,
        .dgen_fill_key   = dgen_fill_key_seq,
        .dgen_verify     = dgen_verify_seq,
        .dgen_verify_key = dgen_verify_key_seq
    }, { /* DGEN_555AAA */
        .dgen_fill       = dgen_fill_555aaa,
        .dgen_fill_key   = dgen_fill_key_555aaa,
        .dgen_verify     = dgen_verify_555aaa,
        .dgen_verify_key = dgen_verify_key_555aaa
    }, { /* DGEN_CONST */
        .dgen_fill       = dgen_fill_const,
        .dgen_fill_key   = dgen_fill_key_const,
        .dgen_verify     = dgen_verify_const,
        .dgen_verify_key = dgen_verify_key_const
    }
};
