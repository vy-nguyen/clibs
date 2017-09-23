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
package com.tvntd.junit;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.text.MessageFormat;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tvntd.forms.PostForm;

import static org.junit.Assert.*;

public class UtilTest
{
    private static Logger s_log = LoggerFactory.getLogger(UtilTest.class);
    private static final ByteArrayOutputStream outContent = new ByteArrayOutputStream();
    private static final ByteArrayOutputStream errContent = new ByteArrayOutputStream();

    @Before
    public void setupStreams()
    {
        System.setOut(new PrintStream(outContent));
        System.setErr(new PrintStream(errContent));
    }

    @After
    public void cleanupStreams()
    {
        s_log.info(outContent.toString());
        System.setOut(null);
        System.setErr(null);
    }

    public static class IFrameTest
    {
        protected String input;
        protected String host;
        protected String docId;

        public IFrameTest(String fmt, String host, String docId)
        {
            this.host  = host;
            this.docId = docId;

            host  = host != null ? host : "";
            docId = docId != null ? docId : "";
            input = MessageFormat.format(fmt, host, docId);
        }

        public void verify(String host, String docId)
        {
            if (this.host != null && host != null && !host.isEmpty()) {
                s_log.info("Compare " + this.host + " vs " + host);
                assertEquals(this.host, host);
            }
            if (this.docId != null && docId != null && !docId.isEmpty()) {
                if (docId.charAt(0) == '/') {
                    docId = docId.substring(1);
                }
                s_log.info("Compare " + this.docId + " vs " + docId);
                assertEquals(this.docId, docId);
            }
        }

        /**
         * @return the input
         */
        public String getInput() {
            return input;
        }
    }

    @Test
    public void parseIfram()
    {
        IFrameTest[] tests = {
            new IFrameTest("<iframe src=''https://{0}/{1}/pub?embedded=true'' " +
                    "style='333, 3222'></iframe>",
                    "docs.google.com",
                    "document/d/1Ka3khw5JLhj4pjTjJeVlNrkP9n1qGE1CBuGzNGTnSvw"),
            new IFrameTest("<iframe src=''http:/{0}/{1}''/>", "abc.com", "xyzdef"),
            new IFrameTest("<iframe src=''l;dfsfs slf sf''/>", null, null),
            new IFrameTest("<iframe url=''https://{0}''>{1}</iframe>", "abc.com", ""),
            new IFrameTest("abc def <frame>dfsd slkfsf s</frame>", "abc", "def"),
            new IFrameTest("www.{0}/embed/{1}", "abc.com", "xyzabc"),
            new IFrameTest("{0}/embed?v={1}", "youtu.be", "xyzabc"),
            new IFrameTest("{0}/{1}", "youtu.be", "xyzabc"),
            new IFrameTest("https://{0}/{1}/view",
                    "drive.google.com", "file/d/0B-PLkJ2jO9eYRHJzempNRG1PajA"),
            new IFrameTest("https://{0}/embed/{1}", "www.youtube.com", "xyabc"),
            new IFrameTest("//{0}/{1}/pub?abc=true",
                    "docs.google.com", "document/d/sdf2323423423"),
            new IFrameTest("<iframe width='560' height='315' " + 
                "src=''https://{0}/embed/{1}'' frameborder='0' " +
                "allowfullscreen></iframe>", "www.youtube.com", "xyzabc")
        };
        PostForm post = new PostForm();
        for (IFrameTest it : tests) {
            boolean ret = post.parseIframe(it.getInput());
            if (ret == true) {
                String host = post.fetchContentUrlHost();
                String docId = post.fetchContentUrlFile();
                it.verify(host, docId);
            }
        }
    }
}
