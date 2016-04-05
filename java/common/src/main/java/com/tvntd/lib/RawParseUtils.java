/*
 * Copyright (C) 2008-2009, Google Inc.
 * and other copyright owners as documented in the project's IP log.
 *
 * This program and the accompanying materials are made available
 * under the terms of the Eclipse Distribution License v1.0 which
 * accompanies this distribution, is reproduced below, and is
 * available at http://www.eclipse.org/org/documents/edl-v10.php
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are permitted provided that the following
 * conditions are met:
 *
 * - Redistributions of source code must retain the above copyright
 *   notice, this list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above
 *   copyright notice, this list of conditions and the following
 *   disclaimer in the documentation and/or other materials provided
 *   with the distribution.
 *
 * - Neither the name of the Eclipse Foundation, Inc. nor the
 *   names of its contributors may be used to endorse or promote
 *   products derived from this software without specific prior
 *   written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
 * CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package com.tvntd.lib;

import java.util.Arrays;

public final class RawParseUtils
{
    private static final byte[] s_digits10;
    private static final byte[] s_digits16;

    static {
        s_digits10 = new byte['9' + 1];
        Arrays.fill(s_digits10, (byte) -1);
        for (char i = '0'; i <= '9'; i++) {
            s_digits10[i] = (byte) (i - '0');
        }
        s_digits16 = new byte['f' + 1];
        Arrays.fill(s_digits16, (byte) -1);
        for (char i = '0'; i <= '9'; i++) {
            s_digits16[i] = (byte) (i - '0');
        }
        for (char i = 'a'; i <= 'f'; i++) {
            s_digits16[i] = (byte) ((i - 'a') + 10);
        }
        for (char i = 'A'; i <= 'F'; i++) {
            s_digits16[i] = (byte) ((i - 'A') + 10);
        }
    }
    /**
     * Determine if b[ptr] matches src.
     *
     * @param b  : the buffer to scan.
     * @param ptr: first position within b, this should match src[0].
     * @param src: the buffer to test for equality with b.
     * @return ptr + src.length if b[ptr..src.length] == src; else -1.
     */
    public static final int match(final byte[] b, int ptr, final byte[] src)
    {
        if (ptr + src.length > b.length) {
            return -1;
        }
        for (int i = 0; i < src.length; i++, ptr++) {
            if (b[ptr] != src[i]) {
                return -1;
            }
        }
        return ptr;
    }

    /**
     * Parse a single hex digit to its numeric value (0-15).
     *
     * @param digit : hex character to parse.
     * @return numeric value, in the range 0-15.
     * @throws ArrayIndexOutOfBoundsException
     *             if the input digit is not a valid hex digit.
     */
    public static final int parseHexInt4(final byte digit)
        throws ArrayIndexOutOfBoundsException
    {
        final byte r = s_digits16[digit];
        if (r < 0) {
            throw new ArrayIndexOutOfBoundsException();
        }
        return r;
    }

    /**
     * Parse 8 character base 16 (hex) formatted string to unsigned integer.
     * <p>
     * The number is read in network byte order, that is, most significant
     * nybble first.
     *
     * @param bs: buffer to parse digits from; positions {@code [p, p+8)} will be parsed.
     * @param p : first position within the buffer to parse.
     * @return the integer value.
     * @throws ArrayIndexOutOfBoundsException
     *             if the string is not hex formatted.
     */
    public static final int parseHexInt32(final byte[] bs, final int p)
        throws ArrayIndexOutOfBoundsException
    {
        int r = s_digits16[bs[p]] << 4;

        r |= s_digits16[bs[p + 1]];
        r <<= 4;

        r |= s_digits16[bs[p + 2]];
        r <<= 4;

        r |= s_digits16[bs[p + 3]];
        r <<= 4;

        r |= s_digits16[bs[p + 4]];
        r <<= 4;

        r |= s_digits16[bs[p + 5]];
        r <<= 4;

        r |= s_digits16[bs[p + 6]];

        final int last = s_digits16[bs[p + 7]];
        if (r < 0 || last < 0) {
            throw new ArrayIndexOutOfBoundsException();
        }
        return (r << 4) | last;
    }

    /**
     * Convert a string to US-ASCII encoding.
     *
     * @param s : the string to convert.
     * @return a byte array of the same length holding the same characters in the same
     *     order.
     * @throws IllegalArgumentException
     *     the input string contains one or more characters outside 7-bit ASCII space.
     */
    public static byte[] encodeASCII(final String s) throws IllegalArgumentException
    {
        final byte[] r = new byte[s.length()];
        for (int i = r.length - 1; i >= 0; i--) {
            final char c = s.charAt(i);
            if (c > 127) {
                throw new IllegalArgumentException();
            }
            r[i] = (byte) c;
        }
        return r;
    }
}
