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

import java.io.ByteArrayOutputStream;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.logging.Logger;

public final class DigestUtil
{
    private static final Logger s_log = Logger.getLogger(DigestUtil.class.getName());

    /**
     *
     */
    public static byte[] digestString(String s, String algo)
    {
        MessageDigest md = null;
        
        try {
            md = MessageDigest.getInstance(algo);
            md.reset();

        } catch(NoSuchAlgorithmException e) {
            s_log.severe(e.toString());
        }
        try {
            md.update(s.getBytes("utf8"));
        } catch(UnsupportedEncodingException e) {
            s_log.severe(e.toString());
        }
        return md.digest();
    }

    /**
     *
     */
    public static String convertHashToString(byte[] hash)
    {
        StringBuilder hex = new StringBuilder(hash.length);
        for (int i = 0; i < hash.length; i++) {
            hex.append(String.format("%02x", hash[i]));
        }
        return hex.toString();
    }

    /**
     *
     */
    public static String digestFileName(String dir, String file, String algo)
    {
        MessageDigest md = null;
        
        try {
            md = MessageDigest.getInstance(algo);

        } catch(NoSuchAlgorithmException e) {
            s_log.severe(e.toString());
        }
        String tdir = dir.trim();
        String tfile = file.trim();

        md.update(tdir.getBytes());
        int len = tdir.length();
        if (tdir.charAt(len - 1) != '/') {
            byte[] separator = { '/' };
            md.update(separator);
        }
        md.update(tfile.getBytes());
        return convertHashToString(md.digest());
    }

    /**
     *
     */
    public static ObjectId digestByteStream(ByteArrayOutputStream baos, String algo)
    {
        MessageDigest md = null;

        try {
            md = MessageDigest.getInstance(algo);

        } catch(NoSuchAlgorithmException e) {
            s_log.severe(e.toString());
            System.exit(255);
        }
        md.update(baos.toByteArray());
        return ObjectId.fromRaw(md.digest());
    }
}
