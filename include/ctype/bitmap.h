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
#ifndef _CTYPE_BITMAP_H_
#define _CTYPE_BITMAP_H_

#include <ctype/types.h>
#include <ctype/assert.h>

#ifdef __cplusplus
extern  "C" {
#endif /* __cplusplus */

#define U32_BITS_SHFT           (5)
#define U32_BITS_COUNT          (1 << U32_BITS_SHFT)
#define U32_BITS_MASK           (U32_BITS_COUNT - 1)
#define BIT_IDX_IN_U32(x)       ((x) & U32_BITS_MASK)
#define BIT_MASK_IN_U32(x)      (1 << BIT_IDX_IN_U32(x))
#define U32_IDX_IN_BIT_ARR(x)   ((x) >> U32_BITS_SHFT)

/*
 * bmap_u32cnt
 * -----------
 * @return the number of u32 needed for the bitmap size.
 */
static inline int
bmap_u32cnt(int size)
{
    int u32cnt;

    u32cnt = U32_IDX_IN_BIT_ARR(size);
    if (BIT_MASK_IN_U32(size) != 0) {
        u32cnt++;
    }
    return (u32cnt);
}

/*
 * bmap_init
 * ---------
 * @param bmap - the bitmap array.
 * @param size - size of the array in term of bit count.
 * @param clear - clear the whole bit array or fill with 1.
 */
extern void
bmap_init(uint32_t *bmap, int size, bool clear);

/*
 * bmap_value
 * ----------
 * Return the value of the bit at the given pos in the bit array.
 */
static inline int
bmap_value(uint32_t *bmap, int size, int pos)
{
    assert(pos < size);
    return (bmap[U32_IDX_IN_BIT_ARR(pos)] & BIT_MASK_IN_U32(pos));
}

/*
 * bmap_set
 * --------
 */
static inline void
bmap_set(uint32_t *bmap, int size, int pos)
{
    assert(pos < size);
    bmap[U32_IDX_IN_BIT_ARR(pos)] |= BIT_MASK_IN_U32(pos);
}

/*
 * bmap_clear
 * ----------
 */
static inline void
bmap_clear(uint32_t *bmap, int size, int pos)
{
    assert(pos < size);
    bmap[U32_IDX_IN_BIT_ARR(pos)] &= ~BIT_MASK_IN_U32(pos);
}

/*
 * bmap_alloc_bit
 * --------------
 * Allocate the first zero bit in the array.
 * @return: the position of the bit or -1 if the whole array is set.
 */
extern int
bmap_alloc_bit(uint32_t *bmap, int size);

/*
 * bmap_num_free_bits
 * ------------------
 * @return the number of zero bits in the array.
 */
extern int
bmap_num_free_bits(uint32_t *bmap, int size);

/*
 * bmap_free_bit
 * -------------
 * Zero out/free the bit at the given position.
 */
static inline void
bmap_free_bit(uint32_t *bmap, int size, int bit_pos)
{
    bmap_clear(bmap, size, bit_pos);
}

/*
 * bmap_nfree_bits
 * ---------------
 * @return the bit position of the first nfree consecutive bits found.
 */
extern int
bmap_nfree_bits(uint32_t *bmap, int size, int nbits);

/*
 * bmap_best_nfree_bits
 * --------------------
 * @return the best bit position for nfree consecutive bits.
 */
extern int
bmap_best_nfree_bits(uint32_t *bmap, int size, int nbits);

/*
 * bmap_alloc_nbits
 * ----------------
 * Allocate the first nbits with zero value in the array and mark them with 1.
 * @return the starting position of the found bit.
 */
extern int
bmap_alloc_nbits(uint32_t *bmap, int size, int nsize);

/*
 * bmap_free_nbits
 * ---------------
 * Free number of bits in the bitmap array.
 */
extern void
bmap_free_nbits(uint32_t *bmap, int size, int start, int nbits);

/*
 * bmap_print
 * ----------
 * Print the whole bitmap array for debugging.
 */
extern void
bmap_print(uint32_t *bmap, int size);

#ifdef __cplusplus
}
#endif /* __cplusplus */
#endif /* _CTYPE_BITMAP_H_ */
