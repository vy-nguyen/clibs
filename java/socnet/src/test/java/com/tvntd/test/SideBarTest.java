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
package com.tvntd.test;

import static org.junit.Assert.*;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.io.UnsupportedEncodingException;

import javax.transaction.Transactional;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import com.tvntd.config.ConfigTest;
import com.tvntd.util.Util;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {
        ConfigTest.class
    },
    loader = AnnotationConfigContextLoader.class)
@Transactional
public class SideBarTest
{
    private static Logger s_log = LoggerFactory.getLogger(SideBarTest.class);
    private static final ByteArrayOutputStream outContent;
    private static final ByteArrayOutputStream errContent;
    static {
        outContent = new ByteArrayOutputStream();
        errContent = new ByteArrayOutputStream();
    }

    @Before
    public void setUpStreams()
    {
        System.setOut(new PrintStream(outContent));
        System.setErr(new PrintStream(errContent));
    }

    @After
    public void cleanUpStreams()
    {
        System.setOut(null);
        System.setErr(null);
    }

    @Test
    public void testHello()
    {
        System.out.println("Run hello test");
        // assertEquals("Run hello test", outContent.toString());
    }

    @Test
    public void testUniToAscii()
    {
        String[] cases = {
            "abc def háh hàge hả hãiw hạdư hâ hấ hầ hẩ hẫ hậ hă hắ hằ hẳ hẵ hặn dèf",
            "ade def ded hé hè hẻ hẽ hẹm hím hìm hỉm hĩm hịm đừ ded định nhứt",
            "1/2/4 định đánh đờn địch hó hò hỏ hõ họ hố hồ hổ hỗ hộ",
            "húm hùm hủm hũm hụm hứ hừ hử hữ hựm đứng nằm ngồi đým đỳm đỷm đỹm đỵm",
            "đố đồ đổ đỗ độ đế đề để đễ đệm dứt dây sóng thần"
        };
        String[] verification = {
            "abc-def-hah-hage-ha-haiw-hadu-ha-ha-ha-ha-ha-ha-ha-ha-ha-ha-ha-han-def",
            "ade-def-ded-he-he-he-he-hem-him-him-him-him-him-du-ded-dinh-nhut",
            "1-2-4-dinh-danh-don-dich-ho-ho-ho-ho-ho-ho-ho-ho-ho-ho",
            "hum-hum-hum-hum-hum-hu-hu-hu-hu-hum-dung-nam-ngoi-dym-dym-dym-dym-dym",
            "do-do-do-do-do-de-de-de-de-dem-dut-day-song-than"
        };

        s_log.info("Run test Unicode to ASCII conversion");
        int i = 0;
        for (String s : cases) {
            String url = Util.utf8ToUrlString(s);

            s_log.info("Convert " + i + ": " + url);
            if (!url.equals(verification[i])) {
                s_log.info(url + " vs " + verification[i]);
            }
            assertEquals(url, verification[i]);
            i++;
        }
    }
}
