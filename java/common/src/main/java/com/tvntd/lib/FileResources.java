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

import java.lang.management.ManagementFactory;
import java.lang.management.OperatingSystemMXBean;
import java.nio.ByteBuffer;

public final class FileResources
{
    private static ThreadLocal<byte[]> s_buffer = new ThreadLocal<byte[]>() {
        @Override protected byte[] initialValue() {
            return new byte[1 << 20];
        }
    };
  
    /**
     *
     */
    public static byte[] setBufferSize(int size)
    {
        byte[] buffer = s_buffer.get();
        if ((buffer == null) || (buffer.length < size)) {
            s_buffer.set(new byte[size]);
            return s_buffer.get();
        }
        return buffer;
    }

    /**
     *
     */
    public static byte[] getBuffer(int size) {
        return setBufferSize(size);
    }

    /**
     *
     */
    public static ByteBuffer getByteBuffer(int size)
    {
        ByteBuffer buf = ByteBuffer.wrap(setBufferSize(size));
        buf.clear();
        return buf;
    }

    /**
     *
     */
    public static long getOpenedFiles()
    {
        OperatingSystemMXBean os = ManagementFactory.getOperatingSystemMXBean();
        return 0;
    }

    private FileResources() {}
}
