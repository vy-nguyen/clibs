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
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

public final class Util
{
    static public final byte[] DefaultTag;
    static public final byte[] DefaultTopic;
    static public final byte[] DefaultEmpty;
    static public final Whitelist allowedTags;

    static {
        DefaultTag = Constants.DefaultTag.getBytes(Charset.forName("UTF-8"));
        DefaultTopic = Constants.DefaultTopic.getBytes(Charset.forName("UTF-8"));
        DefaultEmpty = "".getBytes(Charset.forName("UTF-8"));
        allowedTags = Whitelist.basic()
            .addTags("h1", "h2", "h3", "h4", "h5", "h6", "img");
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

    public static void printStackTrace(String header, int depth)
    {
        System.out.println(header);

        int i = 0;
        for (StackTraceElement se : Thread.currentThread().getStackTrace()) {
            System.out.println(se);
            if (i++ > depth) {
                break;
            }
        }
    }

    static Map<Character, Character> utf8Mapper = new HashMap<>();
    static {
        utf8Mapper.put('á', 'a');
        utf8Mapper.put('à', 'a');
        utf8Mapper.put('ả', 'a');
        utf8Mapper.put('ã', 'a');
        utf8Mapper.put('ạ', 'a');
        utf8Mapper.put('â', 'a');
        utf8Mapper.put('ấ', 'a');
        utf8Mapper.put('ầ', 'a');
        utf8Mapper.put('ẩ', 'a');
        utf8Mapper.put('ẫ', 'a');
        utf8Mapper.put('ậ', 'a');
        utf8Mapper.put('ă', 'a');
        utf8Mapper.put('ắ', 'a');
        utf8Mapper.put('ằ', 'a');
        utf8Mapper.put('ẳ', 'a');
        utf8Mapper.put('ẵ', 'a');
        utf8Mapper.put('ặ', 'a');
        utf8Mapper.put('é', 'e');
        utf8Mapper.put('è', 'e');
        utf8Mapper.put('ẻ', 'e');
        utf8Mapper.put('ẽ', 'e');
        utf8Mapper.put('ẹ', 'e');
        utf8Mapper.put('ê', 'e');
        utf8Mapper.put('ế', 'e');
        utf8Mapper.put('ề', 'e');
        utf8Mapper.put('ể', 'e');
        utf8Mapper.put('ễ', 'e');
        utf8Mapper.put('ệ', 'e');
        utf8Mapper.put('í', 'i');
        utf8Mapper.put('ì', 'i');
        utf8Mapper.put('ỉ', 'i');
        utf8Mapper.put('ĩ', 'i');
        utf8Mapper.put('ị', 'i');
        utf8Mapper.put('ó', 'o');
        utf8Mapper.put('ò', 'o');
        utf8Mapper.put('ỏ', 'o');
        utf8Mapper.put('õ', 'o');
        utf8Mapper.put('ọ', 'o');
        utf8Mapper.put('ô', 'o');
        utf8Mapper.put('ố', 'o');
        utf8Mapper.put('ồ', 'o');
        utf8Mapper.put('ổ', 'o');
        utf8Mapper.put('ỗ', 'o');
        utf8Mapper.put('ộ', 'o');
        utf8Mapper.put('ơ', 'o');
        utf8Mapper.put('ớ', 'o');
        utf8Mapper.put('ờ', 'o');
        utf8Mapper.put('ở', 'o');
        utf8Mapper.put('ỡ', 'o');
        utf8Mapper.put('ợ', 'o');
        utf8Mapper.put('ú', 'u');
        utf8Mapper.put('ù', 'u');
        utf8Mapper.put('ủ', 'u');
        utf8Mapper.put('ũ', 'u');
        utf8Mapper.put('ụ', 'u');
        utf8Mapper.put('ư', 'u');
        utf8Mapper.put('ứ', 'u');
        utf8Mapper.put('ừ', 'u');
        utf8Mapper.put('ử', 'u');
        utf8Mapper.put('ữ', 'u');
        utf8Mapper.put('ự', 'u');
        utf8Mapper.put('đ', 'd');
        utf8Mapper.put('ý', 'y');
        utf8Mapper.put('ỳ', 'y');
        utf8Mapper.put('ỷ', 'y');
        utf8Mapper.put('ỹ', 'y');
        utf8Mapper.put('ỵ', 'y');
    }

    public static String utf8ToAscii(byte[] utf)
    {
        return null;
    }

    private Util() {}
}
