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

    static public byte[] toRawByte(String str, int limit)
    {
        if (str != null) {
            try {
                if (str.length() > limit) {
                    return str.substring(0, limit).getBytes("UTF-8");
                }
                return str.getBytes("UTF-8");
            } catch(UnsupportedEncodingException e) {
            }
        }
        return null;
    }

    static public String toMaxString(String str, int limit)
    {
        if (str != null && str.length() > limit) {
            return str.substring(0, limit);
        }
        return str;
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

    static Map<Character, Character> s_utf8Mapper = new HashMap<>();
    static {
        s_utf8Mapper.put('á', 'a');
        s_utf8Mapper.put('à', 'a');
        s_utf8Mapper.put('ả', 'a');
        s_utf8Mapper.put('ã', 'a');
        s_utf8Mapper.put('ạ', 'a');
        s_utf8Mapper.put('â', 'a');
        s_utf8Mapper.put('ấ', 'a');
        s_utf8Mapper.put('ầ', 'a');
        s_utf8Mapper.put('ẩ', 'a');
        s_utf8Mapper.put('ẫ', 'a');
        s_utf8Mapper.put('ậ', 'a');
        s_utf8Mapper.put('ă', 'a');
        s_utf8Mapper.put('ắ', 'a');
        s_utf8Mapper.put('ằ', 'a');
        s_utf8Mapper.put('ẳ', 'a');
        s_utf8Mapper.put('ẵ', 'a');
        s_utf8Mapper.put('ặ', 'a');
        s_utf8Mapper.put('é', 'e');
        s_utf8Mapper.put('è', 'e');
        s_utf8Mapper.put('ẻ', 'e');
        s_utf8Mapper.put('ẽ', 'e');
        s_utf8Mapper.put('ẹ', 'e');
        s_utf8Mapper.put('ê', 'e');
        s_utf8Mapper.put('ế', 'e');
        s_utf8Mapper.put('ề', 'e');
        s_utf8Mapper.put('ể', 'e');
        s_utf8Mapper.put('ễ', 'e');
        s_utf8Mapper.put('ệ', 'e');
        s_utf8Mapper.put('í', 'i');
        s_utf8Mapper.put('ì', 'i');
        s_utf8Mapper.put('ỉ', 'i');
        s_utf8Mapper.put('ĩ', 'i');
        s_utf8Mapper.put('ị', 'i');
        s_utf8Mapper.put('ó', 'o');
        s_utf8Mapper.put('ò', 'o');
        s_utf8Mapper.put('ỏ', 'o');
        s_utf8Mapper.put('õ', 'o');
        s_utf8Mapper.put('ọ', 'o');
        s_utf8Mapper.put('ô', 'o');
        s_utf8Mapper.put('ố', 'o');
        s_utf8Mapper.put('ồ', 'o');
        s_utf8Mapper.put('ổ', 'o');
        s_utf8Mapper.put('ỗ', 'o');
        s_utf8Mapper.put('ộ', 'o');
        s_utf8Mapper.put('ơ', 'o');
        s_utf8Mapper.put('ớ', 'o');
        s_utf8Mapper.put('ờ', 'o');
        s_utf8Mapper.put('ở', 'o');
        s_utf8Mapper.put('ỡ', 'o');
        s_utf8Mapper.put('ợ', 'o');
        s_utf8Mapper.put('ú', 'u');
        s_utf8Mapper.put('ù', 'u');
        s_utf8Mapper.put('ủ', 'u');
        s_utf8Mapper.put('ũ', 'u');
        s_utf8Mapper.put('ụ', 'u');
        s_utf8Mapper.put('ư', 'u');
        s_utf8Mapper.put('ứ', 'u');
        s_utf8Mapper.put('ừ', 'u');
        s_utf8Mapper.put('ử', 'u');
        s_utf8Mapper.put('ữ', 'u');
        s_utf8Mapper.put('ự', 'u');
        s_utf8Mapper.put('đ', 'd');
        s_utf8Mapper.put('ý', 'y');
        s_utf8Mapper.put('ỳ', 'y');
        s_utf8Mapper.put('ỷ', 'y');
        s_utf8Mapper.put('ỹ', 'y');
        s_utf8Mapper.put('ỵ', 'y');
    }

    public static boolean isPunctuation(char c)
    {
        return
            c == '.' || c == ',' || c == '/' || c == '\\' ||
            c == ';' || c == ':' || c == '"' || c == '\'' ||
            c == '{' || c == '}' || c == '[' || c == ']' ||
            c == '?' || c == '~' || c == '<' || c == '>' ||
            c == '`' || c == '!' || c == '@' || c == '#' ||
            c == '$' || c == '%' || c == '^' || c == '&' ||
            c == '*' || c == '(' || c == ')' || c == '+' ||
            c == '=' || c == '|';
    }

    public static String utf8ToUrlString(String utf)
    {
        if (utf == null) {
            return null;
        }
        StringBuilder out = new StringBuilder();

        for (int i = 0; i < utf.length(); i++) {
            char ch = utf.charAt(i);
            if (ch <= 127) {
                if (ch == ' ' || isPunctuation(ch)) {
                    out.append('-');
                } else {
                    out.append(Character.toLowerCase(ch));
                }
            } else {
                Character c = s_utf8Mapper.get(ch);
                if (c != null) {
                    out.append(c.charValue());
                }
            }
        }
        return out.toString();
    }

    private Util() {}
}
