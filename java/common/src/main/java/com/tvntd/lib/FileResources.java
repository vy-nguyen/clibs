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
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.lang.management.ManagementFactory;
import java.lang.management.OperatingSystemMXBean;
import java.nio.ByteBuffer;

import com.sun.management.UnixOperatingSystemMXBean;

public final class FileResources
{
    private static ThreadLocal<byte[]> s_buffer = new ThreadLocal<byte[]>() {
        @Override protected byte[] initialValue() {
            return null;
        }
    };
    private static ThreadLocal<ByteBuffer> s_nioBuf = new ThreadLocal<ByteBuffer>() {
        @Override protected ByteBuffer initialValue() {
            return null;
        }
    };
    private static ThreadLocal<ByteArrayOutputStream> s_baos =
        new ThreadLocal<ByteArrayOutputStream>() {
            @Override protected ByteArrayOutputStream initialValue() {
                return null;
            }
        };
    private static ThreadLocal<ObjectOutputStream> s_oss =
        new ThreadLocal<ObjectOutputStream>() {
            @Override protected ObjectOutputStream initialValue() {
                return null;
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
    public static ByteBuffer setByteBufferSize(int size)
    {
        ByteBuffer buf = s_nioBuf.get();
        if ((buf == null) || (buf.capacity() < size)) {
            s_nioBuf.set(ByteBuffer.allocateDirect(size));
            return s_nioBuf.get();
        }
        return buf;
    }

    /**
     *
     */
    public static ByteBuffer getByteBuffer(int size) {
        return setByteBufferSize(size);
    }

    /**
     *
     */
    public static ByteArrayOutputStream getByteArrOutHash()
    {
        ByteArrayOutputStream baos = s_baos.get();
        if (baos != null) {
            baos.reset();
            return baos;
        }
        s_baos.set(new ByteArrayOutputStream(16 * 1024));
        return s_baos.get();
    }

    /**
     *
     */
    public static ObjectOutputStream getObjOutHash() throws IOException
    {
        ObjectOutputStream oss = s_oss.get();
        if (oss != null) {
            oss.reset();
            return oss;
        }
        s_oss.set(new ObjectOutputStream(getByteArrOutHash()));
        return s_oss.get();
    }

    /**
     *
     */
    public static long getOpenedFiles()
    {
        OperatingSystemMXBean os = ManagementFactory.getOperatingSystemMXBean();
        if (os instanceof UnixOperatingSystemMXBean) {
            UnixOperatingSystemMXBean unix = (UnixOperatingSystemMXBean)os;
            return unix.getOpenFileDescriptorCount();
        }
        return 0;
    }

    private FileResources() {}
}
