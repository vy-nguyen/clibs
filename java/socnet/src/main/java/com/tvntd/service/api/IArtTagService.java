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
package com.tvntd.service.api;

import java.io.UnsupportedEncodingException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

import com.tvntd.key.HashKey;
import com.tvntd.models.ArtTag;

public interface IArtTagService
{
    void saveTag(ArtTagDTO tag);
    ArtTagDTO getTag(String tag, String uuid);
    List<ArtTagDTO> getUserTag(String uuid);

    public static class ArtTagList
    {
        private List<ArtTagDTO> tagList;

        /**
         * @return the tagList
         */
        public List<ArtTagDTO> getTagList() {
            return tagList;
        }

        /**
         * @param tagList the tagList to set
         */
        public void setTagList(List<ArtTagDTO> tagList) {
            this.tagList = tagList;
        }
    }

    public static class ArtTagDTO
    {
        private ArtTag artTag;

        public ArtTagDTO() {
            artTag = new ArtTag();
        }

        public ArtTagDTO(ArtTag tag) {
            this.artTag = tag;
        }

        public ArtTagDTO(String tagName, String userUuid)
        {
            artTag = new ArtTag();
            setTagName(tagName);
            artTag.setUserUuid(userUuid);
            artTag.makeTagOid();
        }

        public ArtTag fetchArtTag() {
            return artTag;
        }

        public void makeTagOid() {
            artTag.makeTagOid();
        }

        public static String makeTagOidKey(String tagName, String userUuid) {
            try {
                return HashKey.toSha1Key(tagName.getBytes("UTF-8"), userUuid);
            } catch(UnsupportedEncodingException e) {
            }
            return null;
        }

        /**
         * Get/set tagName.
         */
        public String getTagName()
        {
            try {
                return new String(artTag.getTagName(), "UTF-8");
            } catch(UnsupportedEncodingException e) {
            }
            return "";
        }

        public void setTagName(String tagName)
        {
            try {
                artTag.setTagName(tagName.getBytes("UTF-8"));
            } catch(UnsupportedEncodingException e) {
            }
        }

        /**
         * Get/set userUuid.
         */
        public String getUserUuid() {
            return artTag.getUserUuid();
        }

        public void setUserUuid(String uuid) {
            artTag.setUserUuid(uuid);
        }

        /**
         * Get/set lastUpdate.
         */
        public String getLastUpdate()
        {
            DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
            return df.format(artTag.getLastUpdate());
        }

        public void setLastUpdate(String date)
        {
            DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
            try {
                artTag.setLastUpdate(df.parse(date));

            } catch(ParseException e) {
            }
        }

        /**
         * Get/set this rankScore.
         */
        public Long getRankScore() {
            return artTag.getRankScore();
        }

        public void setRankScore(Long score) {
            artTag.setRankScore(score);
        }

        /**
         * Get articleRank.
         */
        public List<String> getArticleRank() {
            return artTag.getTagArtRanks();
        }

        /**
         * Get/set subTags.
         */
        public List<String> getSubTags() {
            return artTag.getSubTags();
        }

        public void setSubTags(List<String> list) {
            artTag.setSubTags(list);
        }
    }
}
