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
package com.tvntd.forms;

import java.net.MalformedURLException;
import java.net.URL;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.safety.Whitelist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tvntd.models.ArticleBrief;
import com.tvntd.util.Constants;
import com.tvntd.util.Util;

public class PostForm
{
    private static Logger s_log = LoggerFactory.getLogger(PostForm.class);
    @Size(max = 140)
    private String topic;

    @NotNull
    @Size(max = 1 << 16)
    private String content;

    @Size(max = 128)
    private String tags;

    @Size(max = 64)
    private String authorUuid;

    @Size(max = 64)
    private String articleUuid;

    private String contentBrief;

    @Size(max = 160)
    private String videoUrl;

    private String contentUrlFile;
    private String contentUrlHost;
    private int docType;

    public boolean cleanInput()
    {
        if ((content == null && videoUrl == null) ||
            authorUuid == null || articleUuid == null) {
            return false;
        }
        if (topic == null) {
            topic = Constants.DefaultTopic;
        }
        if (tags == null) {
            tags = Constants.DefaultTag;
        }
        Whitelist wlist = Util.allowedTags;
        topic = Jsoup.clean(topic, wlist);
        tags = Jsoup.clean(tags, wlist);
        authorUuid = Jsoup.clean(authorUuid, wlist);
        articleUuid = Jsoup.clean(articleUuid, wlist);

        if (content != null) {
            content = Jsoup.clean(content, wlist);
            contentBrief = toBriefContent(content, null);
        }
        if (videoUrl != null) {
            parseIframe(videoUrl);
        }
        return true;
    }

    public static String toBriefContent(String input, byte[] raw)
    {
        if (input == null) {
            input = Util.fromRawByte(raw);
        }
        int len = input.length();
        if (len > 255) {
            len = 255;
        }
        return Jsoup.parse(input.substring(0, len)).text();
    }

    public String toString()
    {
        StringBuilder sb = new StringBuilder();
        sb.append("Topic ").append(topic).append("\n")
            .append("Tags ").append(tags).append("\n");
        return sb.toString();
    }

    public boolean parseIframe(String input)
    {
        int idx;
        URL url = null;
        String host = null;
        Document doc = Jsoup.parse(input);
        Element iframe = doc.select("iframe").first();

        try {
            if (iframe == null) {
                url = new URL(input);
            } else {
                String src = iframe.attr("src");
                if (src != null && !src.isEmpty()) {
                    url = new URL(src);
                }
            }
        } catch(MalformedURLException e) {
        }
        if (url != null) {
            host = url.getHost();
            contentUrlFile = url.getPath();
        } else {
            idx = input.indexOf('/');
            if (idx > 0) {
                host = input.substring(0, idx);
                contentUrlFile = input.substring(idx + 1);
            } else {
                s_log.info("Not url " + input);
                return false;
            }
        }
        if (host.contains("docs.google.com")) {
            docType = ArticleBrief.DOC_TYPE;
            contentUrlHost = host;
            contentUrlFile = parseFileId(contentUrlFile);

        } else if (host.contains("youtube.com") || host.contains("youtu.be")) {
            docType = ArticleBrief.VID_TYPE;
            contentUrlHost = host;
            contentUrlFile = parseFileId(contentUrlFile);

        } else if (host.contains("drive.google.com")) {
            docType = ArticleBrief.DRV_TYPE;
            contentUrlHost = host;
            contentUrlFile = parseFileId(contentUrlFile);

        } else {
            s_log.info(">>> Not supported host url " + input + " <<<< " + host);
            contentUrlHost = host;
            contentUrlFile = parseFileId(contentUrlFile);
            return false;
        }
        s_log.info(input + ": host " + contentUrlHost + " url  " + contentUrlFile);
        return true;
    }

    protected String parseFileId(String path)
    {
        String result = path;

        int idx = path.lastIndexOf("/view");
        if (idx >= 0) {
            return result.substring(0, idx);
        }
        idx = result.lastIndexOf("/pub");
        if (idx >= 0) {
            return result.substring(0, idx);
        }
        if (result.length() > 5 && result.substring(0, 5).equals("embed")) {
            result = result.substring(5);
        }
        idx = result.lastIndexOf("/embed");
        if (idx >= 0 && result.length() > (idx + 6)) {
            result = result.substring(idx + 6);
        }
        idx = result.lastIndexOf("?v=");
        if (idx >= 0 && result.length() > (idx + 3)) {
            result = result.substring(idx + 3);
        }
        return result;
    }

    public String fetchContentUrlFile() {
        return contentUrlFile;
    }

    public String fetchContentUrlHost() {
        return contentUrlHost;
    }

    public int fetchDocType() {
        return docType;
    }

    /**
     * @return the topic
     */
    public String getTopic() {
        return topic;
    }

    /**
     * @param topic the topic to set
     */
    public void setTopic(String topic) {
        this.topic = topic;
    }

    /**
     * @return the content
     */
    public String getContent() {
        return content;
    }

    /**
     * @param content the content to set
     */
    public void setContent(String content) {
        this.content = content;
    }

    /**
     * @return the tags
     */
    public String getTags() {
        return tags;
    }

    /**
     * @param tags the tags to set
     */
    public void setTags(String tags) {
        this.tags = tags;
    }

    /**
     * @return the authorUuid
     */
    public String getAuthorUuid() {
        return authorUuid;
    }

    /**
     * @return the articleUuid
     */
    public String getArticleUuid() {
        return articleUuid;
    }

    /**
     * @return the contentBrief
     */
    public String getContentBrief() {
        return contentBrief;
    }

    /**
     * @return the videoUrl
     */
    public String getVideoUrl() {
        return videoUrl;
    }

    /**
     * @param videoUrl the videoUrl to set
     */
    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }
}
