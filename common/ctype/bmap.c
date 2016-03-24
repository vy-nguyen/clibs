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
#include <ctype/bitmap.h>

/*
 * bmap_init
 * ---------
 * @param bmap - the bitmap array.
 * @param size - size of the array in term of bit count.
 * @param clear - clear the whole bit array or fill with 1.
 */
void
bmap_init(uint32_t *bmap, int size, bool clear)
{
    int       i, u32cnt;
    uint32_t init;

    init   = clear == FALSE ? 0xffffffff : 0;
    u32cnt = bmap_u32cnt(size);
    for (i = 0; i < u32cnt; i++) {
        bmap[i] = init;
    }
}

/*
 * bmap_alloc_bit
 * --------------
 * Allocate the first zero bit in the array.
 * @return: the position of the bit or -1 if the whole array is set.
 */
int
bmap_alloc_bit(uint32_t *bmap, int size)
{
    return (0);
}

/*
 * bmap_num_free_bits
 * ------------------
 * @return the number of zero bits in the array.
 */
int
bmap_num_free_bits(uint32_t *bmap, int size)
{
    int      i, j, nfree, u32cnt;

    nfree  = 0;
    u32cnt = bmap_u32cnt(size);
    for (i = 0; i < u32cnt; i++) {
        if (bmap[i] == 0) {
            nfree += U32_BITS_COUNT;
        } else {
            for (j = 0; j < U32_BITS_COUNT; j++) {
                if ((bmap[i] & (1 << j)) == 0) {
                    nfree++;
                }
            }
        }
    }
    return (nfree);
}

/*
 * bmap_nfree_bits
 * ---------------
 * @return the bit position of the first nfree consecutive bits found.
 */
int
bmap_nfree_bits(uint32_t *bmap, int size, int nbits)
{
    return (0);
}

/*
 * bmap_best_nfree_bits
 * --------------------
 * @return the best bit position for nfree consecutive bits.
 */
int
bmap_best_nfree_bits(uint32_t *bmap, int size, int nbits)
{
    return (0);
}

/*
 * bmap_alloc_nbits
 * ----------------
 * Allocate the first nbits with zero value in the array and mark them with 1.
 * @return the starting position of the found bit.
 */
int
bmap_alloc_nbits(uint32_t *bmap, int size, int nsize)
{
    return (0);
}

/*
 * bmap_free_nbits
 * ---------------
 * Free number of bits in the bitmap array.
 */
void
bmap_free_nbits(uint32_t *bmap, int size, int start, int nbits)
{
}

/*
 * bmap_print
 * ----------
 * Print the whole bitmap array for debugging.
 */
void
bmap_print(uint32_t *bmap, int size)
{
}
