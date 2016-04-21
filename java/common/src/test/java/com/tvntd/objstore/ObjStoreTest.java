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

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tvntd.exports.LibModule;
import com.tvntd.lib.Constants;
import com.tvntd.lib.FileResources;
import com.tvntd.lib.FileService;
import com.tvntd.lib.ObjectId;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.junit.Before;
import org.junit.Assert;
import static org.junit.Assert.*;

public class ObjStoreTest
{
    private static Logger s_log = LoggerFactory.getLogger(ObjStoreTest.class);

    private Path dataPath;
    private String dataDir;

    @Before
    public void before() throws Exception
    {
        LibModule.initialize();
        dataDir = System.getProperty("TESTDATA");
        dataPath = Paths.get(dataDir);

        s_log.info("Begin ObjStore Unit Test: " + dataDir);
    }

    @Test
    public void testPutImage()
    {
        Path tfile = dataPath.resolve("flags.png");
        File ifile = tfile.toFile();
        try {
            InputStream is = new FileInputStream(ifile);
            ObjStore objStore = ObjStore.getInstance();
            ObjectId oid = objStore.putImage(is, (int) ifile.length());

            is.close();
            String uri = objStore.imgObjUri(oid);
            s_log.info("Object URI: " + uri);

            byte[] buf = FileResources.getBuffer(Constants.FileIOBufferSize);
            byte[] hash = FileService.getFileHash(ifile, Constants.HashFunction, buf);
            ObjectId verf = ObjectId.fromRaw(hash);

            assertTrue(oid.equals(verf));

        } catch(IOException e) {
            Assert.fail(e.getMessage());
        }
    }
}
