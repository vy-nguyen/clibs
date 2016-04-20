/*
 * Copyright (C) 2008, Robin Rosenberg <robin.rosenberg@dewire.com>
 * Copyright (C) 2006-2008, Shawn O. Pearce <spearce@spearce.org>
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

import java.io.File;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * A SHA-1 abstraction.
 */
public class ObjectId extends AnyObjectId implements Serializable
{
    private static final long serialVersionUID = 1L;
    private static final ObjectId ZEROID;
    private static final String ZEROID_STR;

    static {
        ZEROID = new ObjectId(0, 0, 0, 0, 0);
        ZEROID_STR = ZEROID.name();
    }

    ObjectId(int new_1, int new_2, int new_3, int new_4, int new_5)
    {
        this.m_w1 = new_1;
        this.m_w2 = new_2;
        this.m_w3 = new_3;
        this.m_w4 = new_4;
        this.m_w5 = new_5;
    }

    /**
     * Initialize this instance by copying another existing ObjectId.
     * @param src another already parsed ObjectId to copy the value out of.
     */
    public ObjectId(final AnyObjectId src)
    {
        this.m_w1 = src.m_w1;
        this.m_w2 = src.m_w2;
        this.m_w3 = src.m_w3;
        this.m_w4 = src.m_w4;
        this.m_w5 = src.m_w5;
    }

    /**
     * Get the special all-null ObjectId.
     */
    public static final ObjectId zeroId() {
        return ZEROID;
    }
    public static final ObjectId newZeroId() {
        return new ObjectId(ZEROID);
    }

    /**
     * Test a string of characters to verify it is a hex format.
     * <p/>
     * If true the string can be parsed with {@link #fromString(String)}.
     *
     * @param id: the string to test.
     * @return true if the string can converted into an ObjectId.
     */
    public static final boolean isId(final String id)
    {
        if (id.length() != Constants.OBJECT_ID_STRING_LENGTH) {
            return false;
        }
        try {
            for (int i = 0; i < Constants.OBJECT_ID_LENGTH; i++) {
                RawParseUtils.parseHexInt4((byte) id.charAt(i));
            }
            return true;
        } catch (ArrayIndexOutOfBoundsException e) {
            return false;
        }
    }

    /**
     * Convert an ObjectId into a hex string representation.
     *
     * @param i: the id to convert. May be null.
     * @return the hex string conversion of this id's content.
     */
    public static final String toString(final ObjectId i) {
        return i != null ? i.name() : ZEROID_STR;
    }

    /**
     * Compare to object identifier byte sequences for equality.
     *
     * @param first
     *     the first buffer to compare against. Must have at least 20
     *     bytes from position ai through the end of the buffer.
     * @param fi: first offset within firstBuffer to begin testing.
     * @param second
     *     the second buffer to compare against. Must have at least 2
     *     bytes from position bi through the end of the buffer.
     * @param si: first offset within secondBuffer to begin testing.
     * @return true if the two identifiers are the same.
     */
    public static boolean equals(final byte[] first, final int fi,
           final byte[] second, final int si)
    {
        return (first[fi] == second[si]) &&
               (first[fi + 1] == second[si + 1]) &&
               (first[fi + 2] == second[si + 2]) &&
               (first[fi + 3] == second[si + 3]) &&
               (first[fi + 4] == second[si + 4]) &&
               (first[fi + 5] == second[si + 5]) &&
               (first[fi + 6] == second[si + 6]) &&
               (first[fi + 7] == second[si + 7]) &&
               (first[fi + 8] == second[si + 8]) &&
               (first[fi + 9] == second[si + 9]) &&
               (first[fi + 10] == second[si + 10]) &&
               (first[fi + 11] == second[si + 11]) &&
               (first[fi + 12] == second[si + 12]) &&
               (first[fi + 13] == second[si + 13]) &&
               (first[fi + 14] == second[si + 14]) &&
               (first[fi + 15] == second[si + 15]) &&
               (first[fi + 16] == second[si + 16]) &&
               (first[fi + 17] == second[si + 17]) &&
               (first[fi + 18] == second[si + 18]) &&
               (first[fi + 19] == second[si + 19]);
    }

    /**
     * Convert an ObjectId from raw binary representation.
     *
     * @param bs: the raw byte buffer to read from. At least 20 bytes must be
     *           available within this byte array.
     * @return the converted object id.
     */
    public static final ObjectId fromRaw(final byte[] bs) {
        return fromRaw(bs, 0);
    }

    /**
     * Convert an ObjectId from raw binary representation.
     *
     * @param bs: the raw byte buffer to read from. At least 20 bytes after p
     *     must be available within this byte array.
     * @param p:  position to read the first byte of data from.
     * @return the converted object id.
     */
    public static final ObjectId fromRaw(final byte[] bs, final int p)
    {
        final int a = NB.decodeInt32(bs, p);
        final int b = NB.decodeInt32(bs, p + 4);
        final int c = NB.decodeInt32(bs, p + 8);
        final int d = NB.decodeInt32(bs, p + 12);
        final int e = NB.decodeInt32(bs, p + 16);
        return new ObjectId(a, b, c, d, e);
    }

    /**
     * Convert an ObjectId from raw binary representation.
     *
     * @param is: the raw integers buffer to read from. At least 5 integers must
     *     be available within this int array.
     * @return the converted object id.
     */
    public static final ObjectId fromRaw(final int[] is) {
        return fromRaw(is, 0);
    }

    /**
     * Convert an ObjectId from raw binary representation.
     *
     * @param is: the raw integers buffer to read from. At least 5 integers
     *     after p must be available within this int array.
     * @param p:  position to read the first integer of data from.
     * @return the converted object id.
     */
    public static final ObjectId fromRaw(final int[] is, final int p) {
        return new ObjectId(is[p], is[p + 1], is[p + 2], is[p + 3], is[p + 4]);
    }

    /**
     * Convert an ObjectId from hex characters (US-ASCII).
     *
     * @param buf: the US-ASCII buffer to read from. At least 40 bytes after
     *     offset must be available within this byte array.
     * @param offset: position to read the first character from.
     * @return the converted object id.
     */
    public static final ObjectId fromString(final byte[] buf, final int offset)
        throws IllegalArgumentException
    {
        return fromHexString(buf, offset);
    }

    /**
     * Convert an ObjectId from hex characters.
     *
     * @param str: the string to read from. Must be 40 characters long.
     * @return the converted object id.
     */
    public static ObjectId fromString(final String str)
        throws IllegalArgumentException
    {
        if (str.length() != Constants.OBJECT_ID_STRING_LENGTH) {
            throw new IllegalArgumentException("Invalid id: " + str);
        }
        return fromHexString(RawParseUtils.encodeASCII(str), 0);
    }

    private static final ObjectId fromHexString(final byte[] bs, int p)
        throws IllegalArgumentException
    {
        try {
            final int a = RawParseUtils.parseHexInt32(bs, p);
            final int b = RawParseUtils.parseHexInt32(bs, p + 8);
            final int c = RawParseUtils.parseHexInt32(bs, p + 16);
            final int d = RawParseUtils.parseHexInt32(bs, p + 24);
            final int e = RawParseUtils.parseHexInt32(bs, p + 32);
            return new ObjectId(a, b, c, d, e);

        } catch (ArrayIndexOutOfBoundsException e1) {
            throw new IllegalArgumentException("Invalid id length: " + bs.length);
        }
    }

    public ObjectId toObjectId() {
        return this;
    }

    /**
     * Copy content of the objectId to the raw byte array.
     */
    public void toRaw(byte[] bs) {
        copyRawTo(bs, 0);
    }

    /**
     * Partition the object ID into directory key space.
     * (e.g. 2abc322342f... to base/2a/bc/...
     *
     * @param base : the base directory to store the hashed record.
     * @param dirLevel : number of directory level.
     * @param dirHexChar : number of hex characters per directory (e.g. 2).
     * @return the path.
     */
    public final Path toPath(Path base, int dirLevel, int dirHexChar)
    {
        assert 0 < dirHexChar && dirHexChar < Constants.OBJECT_ID_STRING_LENGTH;

        int pos = 0, len = Constants.OBJECT_ID_STRING_LENGTH;
        byte[] hex = toHexByteArray();

        while (dirLevel > 0) {
            base = base.resolve(new String(hex, pos, dirHexChar));
            pos  = pos + dirHexChar;
            len  = len - dirHexChar;
            dirLevel--;
        }
        return base.resolve(new String(hex, pos, len));
    }

    public final Path toPathMkdirs(Path base, int dirLevel, int dirHexChar)
        throws IOException
    {
        assert 0 < dirHexChar && dirHexChar < Constants.OBJECT_ID_STRING_LENGTH;
        Path result = toPath(base, dirLevel, dirHexChar);
        Path parent = result.getParent();
        if (!Files.exists(parent)) {
            Files.createDirectories(parent);
        }
        return result;
    }

    /**
     * Convert the path produced by {@AnyObjectId.toPath} back to object ID
     * format.
     *
     * @param base : the base directory not part of object ID key space.
     * @param path : the path to decode back to object ID.
     * @return the object Id.
     */
    public static final ObjectId fromPath(String base, final Path path)
    {
        String idPath = path.toString().replaceFirst(base, "");
        String objId = idPath.replaceAll(File.separator, "");
        return fromString(objId);
    }

    private void writeObject(ObjectOutputStream os) throws IOException
    {
        os.writeInt(m_w1);
        os.writeInt(m_w2);
        os.writeInt(m_w3);
        os.writeInt(m_w4);
        os.writeInt(m_w5);
    }

    private void readObject(ObjectInputStream ois) throws IOException
    {
        m_w1 = ois.readInt();
        m_w2 = ois.readInt();
        m_w3 = ois.readInt();
        m_w4 = ois.readInt();
        m_w5 = ois.readInt();
    }
}
