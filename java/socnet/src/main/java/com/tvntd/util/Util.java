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

package com.tvntd.util;

import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

public final class Util
{
    static public final byte[] DefaultTag;
    static public final byte[] DefaultTopic;
    static public final byte[] DefaultEmpty;

    static {
        DefaultTag = Constants.DefaultTag.getBytes(Charset.forName("UTF-8"));
        DefaultTopic = Constants.DefaultTopic.getBytes(Charset.forName("UTF-8"));
        DefaultEmpty = "".getBytes(Charset.forName("UTF-8"));
    }

    static public UUID toUuid(String uuid)
    {
        try {
            return UUID.fromString(uuid);

        } catch(Exception e) {
            return null;
        }
    }

    static public String fromRawByte(byte[] input)
    {
        if (input != null) {
            try {
                return new String(input, "UTF-8");
            } catch(UnsupportedEncodingException e) {
            }
        }
        return "";
    }

    static public byte[] toRawByte(String str)
    {
        if (str != null) {
            try {
                return str.getBytes("UTF-8");
            } catch(UnsupportedEncodingException e) {
            }
        }
        return null;
    }

    static public <T> T isInList(List<T> list, T item)
    {
        for (T elm : list) {
            if (elm.equals(item)) {
                return elm;
            }
        }
        return null;
    }

    static public <T> T removeFrom(List<T> list, T item)
    {
        Iterator<T> iter = list.iterator();
        while (iter.hasNext()) {
            T elm = iter.next();
            if (elm.equals(item)) {
                iter.remove();
                return elm;
            }
        }
        return null;
    }

    static public <T> void addUnique(List<T> list, T item)
    {
        if (isInList(list, item) == null) {
            list.add(item);
        }
    }

    static public StringBuilder printIndent(StringBuilder sb, int indent)
    {
        for (int i = 0; i < indent; i++) {
            sb.append(" ");
        }
        return sb;
    }

    public static String clean(String str, Whitelist wlist, int max)
    {
        if (str != null) {
            str = Jsoup.clean(str, wlist);
            if (str.length() <= max) {
                return str;
            }
            return str.substring(0, max);
        }
        return str;
    }

    public static String truncate(String str, int max)
    {
        if (str.length() <= max) {
            return str;
        }
        return str.substring(0, max);
    }

    private Util() {}
}
