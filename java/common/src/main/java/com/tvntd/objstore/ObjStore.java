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
package com.tvntd.objstore;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tvntd.lib.Constants;
import com.tvntd.lib.FileResources;
import com.tvntd.lib.Module;
import com.tvntd.lib.ObjectId;
import com.tvntd.lib.Program;

public class ObjStore extends Module
{
    public static final String s_name = "ObjStore";
    private static ObjStore m_singleton = null;
    private static Logger s_log = LoggerFactory.getLogger(ObjStore.class);

    protected Path m_base;
    protected File m_temp;

    public ObjStore()
    {
        super(s_name);
        m_temp = new File("/var/www/static/temp");
        m_base = Paths.get("/var/www/static/upload");

        try {
            Files.createDirectories(m_base);
            Files.createDirectories(m_temp.toPath());

        } catch(IOException e) {
            s_log.error("Failed to create dir: " + e.toString());
        }
    }

    public static final ObjStore getInstance()
    {
        if (m_singleton != null) {
            return m_singleton;
        }
        m_singleton = Program.getInstance().getModule(s_name);
        return m_singleton;
    }

    @Override
    public void moduleInit() {
        s_log.info("Init obj store module: " + m_temp);
    }

    /**
     * PUT and image to the object store.
     */
    public ObjectId putImage(InputStream is, int limit)
    {
        try {
            Path saved = null;
            ObjectId oid = null;
            byte[] buf = FileResources.getBuffer(Constants.FileIOBufferSize); 
            MessageDigest md = MessageDigest.getInstance(Constants.HashFunction);

            File temp = File.createTempFile("temp", null, m_temp);
            FileOutputStream fos = new FileOutputStream(temp);

            for (int len, offset = 0; true; offset += len, limit -= len) {
                len = is.read(buf, offset, limit);
                fos.write(buf, offset, len);
                md.update(buf, offset, len);

                if ((len == limit) || (len == -1)) {
                    break;
                }
            }
            oid = ObjectId.fromRaw(md.digest());
            saved = oid.toPath(m_base,
                    Constants.OIdDirLevels, Constants.OIdDirHexChars);
            
            fos.close();
            if (!Files.exists(saved)) {
                temp.renameTo(saved.toFile());
                s_log.info("Save object " + saved);
            } else {
                temp.delete();
                s_log.info("Record exists " + saved);
            }
            return oid;

        } catch(IOException | NoSuchAlgorithmException e) {
            s_log.error("Exception: " + e.toString());
        }
        return null;
    }

    public String imgObjUri(ObjectId oid)
    {
        if (oid != null) {
            Path dest = oid.toPath(m_base,
                    Constants.OIdDirLevels, Constants.OIdDirHexChars);

            return dest.toString();
        }
        return null;
    }
}
