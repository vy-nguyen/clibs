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
#include <ctype/types.h>
#include <ctype/assert.h>

/*
 * init_ctrlvec
 * ----------------
 * Initialize pointers of ctrlvec terminated by NULL.  This method is called
 * to initialize any required data structure.
 */
void
init_ctrlvec(const ctrlvec_t **vec)
{
    int              i;
    const ctrlvec_t *cur;

    for (i = 0; vec[i] != NULL; i++) {
        cur = vec[i];
        if (cur->ctrl_init_fn != NULL) {
            cur->ctrl_init_fn(cur);
        }
    }
}

/*
 * startup_ctrlvec
 * -------------------
 * Invoke startup functions from ctrlvec pointers terminated by NULL.
 */
void
startup_ctrlvec(const ctrlvec_t **vec)
{
    int              i;
    const ctrlvec_t *cur;

    for (i = 0; vec[i] != NULL; i++) {
        cur = vec[i];
        if (cur->ctrl_startup_fn != NULL) {
            cur->ctrl_startup_fn(cur);
        }
    }
}

/*
 * shutdown_ctrlvec
 * --------------------
 * Invoke shutdown functions from these ctrlvec ptrs.
 */
void
shutdown_ctrlvec(const ctrlvec_t **vec)
{
    int              i, start;
    const ctrlvec_t *cur;

    for (start = 0; vec[start] != NULL; start++);
    if (start > 0) {
        for (i = start - 1; i >= 0; i--) {
            cur = vec[i];
            if (cur->ctrl_shutdown_fn != NULL) {
                cur->ctrl_shutdown_fn(cur);
            }
        }
    }
}

/*
 * cleanup_ctrlvec
 * -------------------
 * Cleanup and free resources used by these ctrlvec ptrs.
 */
void
cleanup_ctrlvec(const ctrlvec_t **vec)
{
    int              i, start;
    const ctrlvec_t *cur;

    for (start = 0; vec[start] != NULL; start++);
    if (start > 0) {
        for (i = start - 1; i >= 0; i--) {
            cur = vec[i];
            if (cur->ctrl_cleanup_fn != NULL) {
                cur->ctrl_cleanup_fn(cur);
            }
        }
    }
}
