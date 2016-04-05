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

import java.io.Serializable;

/**
 * A prefix abbreviation of an {@link ObjectId}.
 */
public final class AbbreviatedObjectId implements Serializable
{
    private static final long serialVersionUID = 20160400;

    /**
     * Number of half-bytes used by this id.
     */
    private final int m_nibbles;
    private final int m_w1;
    private final int m_w2;
    private final int m_w3;
    private final int m_w4;
    private final int m_w5;

    AbbreviatedObjectId(final int n, final int new_1, final int new_2,
                        final int new_3, final int new_4, final int new_5)
    {
        this.m_nibbles = n;
        this.m_w1 = new_1;
        this.m_w2 = new_2;
        this.m_w3 = new_3;
        this.m_w4 = new_4;
        this.m_w5 = new_5;
    }

    /**
     * Test a string of characters to verify it is a hex format.
     * <p/>
     * If true the string can be parsed with {@link #fromString(String)}.
     *
     * @param id the string to test.
     * @return true if the string can converted into an AbbreviatedObjectId.
     */
    public static final boolean isId(final String id)
    {
        if (id.length() < 2 || Constants.OBJECT_ID_STRING_LENGTH < id.length()) {
            return false;
        }
        try {
            for (int i = 0; i < id.length(); i++) {
                RawParseUtils.parseHexInt4((byte) id.charAt(i));
            }
            return true;

        } catch(ArrayIndexOutOfBoundsException e) {
            return false;
        }
    }

    /**
     * Convert an AbbreviatedObjectId from hex characters (US-ASCII).
     *
     * @param buf    the US-ASCII buffer to read from.
     * @param offset position to read the first character from.
     * @param end    one past the last position to read (<code>end-offset</code> is
     *               the length of the string).
     * @return the converted object id.
     */
    public static final AbbreviatedObjectId fromString(
            final byte[] buf, final int offset, final int end)
    {
        if (end - offset > Constants.OBJECT_ID_STRING_LENGTH) {
            // TODO: exception
            return null;
        }
        return fromHexString(buf, offset, end);
    }

    /**
     * Convert an AbbreviatedObjectId from an {@link AnyObjectId}.
     * <p/>
     * This method copies over all bits of the Id, and is therefore complete
     * (see {@link #isComplete()}).
     *
     * @param id the {@link ObjectId} to convert from.
     * @return the converted object id.
     */
    public static final AbbreviatedObjectId fromObjectId(AnyObjectId id)
    {
        return new AbbreviatedObjectId(Constants.OBJECT_ID_STRING_LENGTH,
                                       id.m_w1, id.m_w2, id.m_w3, id.m_w4, id.m_w5);
    }

    /**
     * Convert an AbbreviatedObjectId from hex characters.
     *
     * @param str the string to read from. Must be &lt;= 40 characters.
     * @return the converted object id.
     */
    public static final AbbreviatedObjectId fromString(final String str)
        throws IllegalArgumentException
    {
        if (str.length() > Constants.OBJECT_ID_STRING_LENGTH) {
            throw new IllegalArgumentException();
        }
        final byte[] b = RawParseUtils.encodeASCII(str);
        return fromHexString(b, 0, b.length);
    }

    private static final AbbreviatedObjectId fromHexString(
            final byte[] bs, int ptr, final int end)
    {
        try {
            final int a = hexUInt32(bs, ptr +  0, end);
            final int b = hexUInt32(bs, ptr +  8, end);
            final int c = hexUInt32(bs, ptr + 16, end);
            final int d = hexUInt32(bs, ptr + 24, end);
            final int e = hexUInt32(bs, ptr + 32, end);
            return new AbbreviatedObjectId(end - ptr, a, b, c, d, e);
        } catch(ArrayIndexOutOfBoundsException e) {
            throw e;
        }
    }

    private static final int hexUInt32(final byte[] bs, int p, final int end)
    {
        if (8 <= (end - p)) {
            return RawParseUtils.parseHexInt32(bs, p);
        }
        int r = 0, n = 0;
        while ((n < 8) && (p < end)) {
            r <<= 4;
            r |= RawParseUtils.parseHexInt4(bs[p++]);
            n++;
        }
        return r << (8 - n) * 4;
    }

    static int mask(final int nibbles, final int word, final int v)
    {
        final int b = (word - 1) * 8;
        if ((b + 8) <= nibbles) {
            // We have all of the bits required for this word.
            //
            return v;
        }
        if (nibbles <= b) {
            // We have none of the bits required for this word.
            //
            return 0;
        }
        final int s = 32 - (nibbles - b) * 4;
        return (v >>> s) << s;
    }

    private int mask(final int word, final int v) {
        return mask(m_nibbles, word, v);
    }

    /**
     * @return number of hex digits appearing in this id
     */
    public int length() {
        return m_nibbles;
    }

    /**
     * @return true if this ObjectId is actually a complete id.
     */
    public boolean isComplete() {
        return length() == Constants.OBJECT_ID_STRING_LENGTH;
    }

    /**
     * @return a complete ObjectId; null if {@link #isComplete()} is false
     */
    public ObjectId toObjectId() {
        return isComplete() ? new ObjectId(m_w1, m_w2, m_w3, m_w4, m_w5) : null;
    }

    /**
     * Compares this abbreviation to a full object id.
     *
     * @param other the other object id.
     * @return &lt;0 if this abbreviation names an object that is less than
     * <code>other</code>; 0 if this abbreviation exactly matches the
     * first {@link #length()} digits of <code>other.name()</code>;
     * &gt;0 if this abbreviation names an object that is after
     * <code>other</code>.
     */
    public final int prefixCompare(final AnyObjectId other)
    {
        int cmp = NB.compareUInt32(m_w1, mask(1, other.m_w1));
        if (cmp != 0) {
            return cmp;
        }
        cmp = NB.compareUInt32(m_w2, mask(2, other.m_w2));
        if (cmp != 0) {
            return cmp;
        }
        cmp = NB.compareUInt32(m_w3, mask(3, other.m_w3));
        if (cmp != 0) {
            return cmp;
        }
        cmp = NB.compareUInt32(m_w4, mask(4, other.m_w4));
        if (cmp != 0) {
            return cmp;
        }
        return NB.compareUInt32(m_w5, mask(5, other.m_w5));
    }

    /**
     * Compare this abbreviation to a network-byte-order ObjectId.
     *
     * @param bs array containing the other ObjectId in network byte order.
     * @param p  position within {@code bs} to start the compare at. At least
     *           20 bytes, starting at this position are required.
     * @return &lt;0 if this abbreviation names an object that is less than
     * <code>other</code>; 0 if this abbreviation exactly matches the
     * first {@link #length()} digits of <code>other.name()</code>;
     * &gt;0 if this abbreviation names an object that is after
     * <code>other</code>.
     */
    public final int prefixCompare(final byte[] bs, final int p)
    {
        int cmp = NB.compareUInt32(m_w1, mask(1, NB.decodeInt32(bs, p)));
        if (cmp != 0) {
            return cmp;
        }
        cmp = NB.compareUInt32(m_w2, mask(2, NB.decodeInt32(bs, p + 4)));
        if (cmp != 0) {
            return cmp;
        }
        cmp = NB.compareUInt32(m_w3, mask(3, NB.decodeInt32(bs, p + 8)));
        if (cmp != 0) {
            return cmp;
        }
        cmp = NB.compareUInt32(m_w4, mask(4, NB.decodeInt32(bs, p + 12)));
        if (cmp != 0) {
            return cmp;
        }
        return NB.compareUInt32(m_w5, mask(5, NB.decodeInt32(bs, p + 16)));
    }

    /**
     * Compare this abbreviation to a network-byte-order ObjectId.
     *
     * @param bs array containing the other ObjectId in network byte order.
     * @param p  position within {@code bs} to start the compare at. At least 5
     *           ints, starting at this position are required.
     * @return &lt;0 if this abbreviation names an object that is less than
     * <code>other</code>; 0 if this abbreviation exactly matches the
     * first {@link #length()} digits of <code>other.name()</code>;
     * &gt;0 if this abbreviation names an object that is after
     * <code>other</code>.
     */
    public final int prefixCompare(final int[] bs, final int p)
    {
        int cmp = NB.compareUInt32(m_w1, mask(1, bs[p]));
        if (cmp != 0) {
            return cmp;
        }
        cmp = NB.compareUInt32(m_w2, mask(2, bs[p + 1]));
        if (cmp != 0) {
            return cmp;
        }
        cmp = NB.compareUInt32(m_w3, mask(3, bs[p + 2]));
        if (cmp != 0) {
            return cmp;
        }
        cmp = NB.compareUInt32(m_w4, mask(4, bs[p + 3]));
        if (cmp != 0) {
            return cmp;
        }
        return NB.compareUInt32(m_w5, mask(5, bs[p + 4]));
    }

    /**
     * @return value for a fan-out style map, only valid of length &gt;= 2.
     */
    public final int getFirstByte() {
        return m_w1 >>> 24;
    }

    @Override
    public int hashCode() {
        return m_w2;
    }

    @Override
    public boolean equals(final Object o)
    {
        if (o instanceof AbbreviatedObjectId) {
            final AbbreviatedObjectId b = (AbbreviatedObjectId) o;
            return (m_nibbles == b.m_nibbles) &&
                   (m_w1 == b.m_w1) && (m_w2 == b.m_w2) &&
                   (m_w3 == b.m_w3) && (m_w4 == b.m_w4) && (m_w5 == b.m_w5);
        }
        return false;
    }

    /**
     * @return string form of the abbreviation, in lower case hexadecimal.
     */
    public final String name()
    {
        final char[] b = new char[Constants.OBJECT_ID_STRING_LENGTH];

        AnyObjectId.formatHexChar(b, 0, m_w1);
        if (m_nibbles <= 8) {
            return new String(b, 0, m_nibbles);
        }
        AnyObjectId.formatHexChar(b, 8, m_w2);
        if (m_nibbles <= 16) {
            return new String(b, 0, m_nibbles);
        }
        AnyObjectId.formatHexChar(b, 16, m_w3);
        if (m_nibbles <= 24) {
            return new String(b, 0, m_nibbles);
        }
        AnyObjectId.formatHexChar(b, 24, m_w4);
        if (m_nibbles <= 32) {
            return new String(b, 0, m_nibbles);
        }
        AnyObjectId.formatHexChar(b, 32, m_w5);
        return new String(b, 0, m_nibbles);
    }


    @SuppressWarnings("nls")
    @Override
    public String toString() {
        return "AbbreviatedObjectId[" + name() + "]";
    }
}
