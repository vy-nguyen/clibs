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

public class Constants
{
    public static String DefaultTag   = "My Post";
    public static String DefaultTopic = "Post";
    public static String PublicUuid   = "00000000-ffff-0000-ffff-00ff00ff00ff";

    public static Long PublicId      = 1L; 
    public static Long Role_Public   = 0x0000L;
    public static Long Role_Circle1  = 0x0001L;
    public static Long Role_Circle2  = 0x0002L | Role_Circle1;
    public static Long Role_Circle3  = 0x0004L | Role_Circle2;
    public static Long Role_Circle4  = 0x0008L | Role_Circle3;
    public static Long Role_User     = 0x1000L;
    public static Long Role_Admin    = 0x2000L;
    public static Long Role_Dba      = 0x4000L;
    public static Long Role_Banker   = 0x8000L;

    public static byte[] TudoAcct;
    public static byte[] EquityAcct;

    static {
        try {
            TudoAcct    = "Tự Do".getBytes("UTF-8");
            EquityAcct  = "Equity".getBytes("UTF-8");
        } catch(UnsupportedEncodingException e) {}
    }
}
