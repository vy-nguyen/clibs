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
package com.tvntd.lib;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Random;

public final class RandUtil
{
    static final byte[] s_ascii =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".getBytes();

    static final ThreadLocal<Random> s_rand = new ThreadLocal<Random>() {
        @Override protected Random initialValue() {
            return new Random();
        }
    };

    /**
     *
     */
    public static int genRandInt(int min, int max)
    {
        if (max < min) {
            int tmp = max;
            max = min;
            min = tmp;
        }
        Random rand = s_rand.get();
        return rand.nextInt((max - min) + 1) + min;
    }

    /**
     *
     */
    public static String genRandString(int min, int max)
    {
        int len = genRandInt(min, max);
        byte[] result = new byte[len];

        Random rand = s_rand.get();
        int genSet = s_ascii.length;
        for (int i = 0; i < len; i++) {
            result[i] = s_ascii[rand.nextInt(genSet)];
        }
        return new String(result, 0, len);
    }

    /**
     *
     */
    public static int genRandByte(byte[] buff, int min, int max)
    {
        int len = genRandInt(min, max);
        int limit = len < buff.length ? len : buff.length;
        int genSet = s_ascii.length;
        Random rand = s_rand.get();

        for (int i = 0; i < limit; i++) {
            buff[i] = s_ascii[rand.nextInt(genSet)];
        }
        return limit;
    }

    /**
     *
     */
    public static String genRandDir(String base)
    {
        String dir = base + File.separator + genRandString(8, 16);
        File fs = new File(dir);

        fs.mkdirs();
        return dir;
    }

    /**
     *
     */
    public static void genRandFile(String dir, int min, int max) throws IOException
    {
        File file = new File(dir + File.separator + genRandString(8, 16));
        file.createNewFile();

        FileOutputStream fop = new FileOutputStream(file);
        byte[] buff = new byte[genRandInt(min, max)];
        int genSet = s_ascii.length;
        Random rand = s_rand.get();

        for (int i = 0; i < buff.length; i++) {
            buff[i] = s_ascii[rand.nextInt(genSet)];
        }
        fop.write(buff);
        fop.close();
    }

    /**
     *
     */
    public static int genRandFiles(String dir,
            int newFiles, int fileLimit, int fileCount, int minByte, int maxByte)
        throws IOException
    {
        for (int i = 0; i < newFiles; i++) {
            genRandFile(dir, minByte, maxByte);
            fileCount++;
            if (fileCount > fileLimit) {
                return fileCount;
            }
        }
        return fileCount;
    }

    private RandUtil() {}
}
