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
import java.util.LinkedList;
import java.util.List;

import com.tvntd.key.HashKey;
import com.tvntd.models.ArtTag;
import com.tvntd.util.Util;

public interface IArtTagService
{
    void saveTag(ArtTagDTO tag);
    void saveTag(String uuid, String tag, String parent, Long rank);

    ArtTagDTO getTag(String tag, String uuid);
    List<ArtTagDTO> getUserTags(String uuid);
    ArtTagList getUserTagsDTO(String uuid);
    void deleteTag(String tag, String uuid);

    public static class ArtTagList extends GenericResponse
    {
        private List<ArtTagDTO> publicTags;
        private List<ArtTagDTO> deletedTags;

        public ArtTagList() {
            super(GenericResponse.USER_HOME, null, null);
        }

        public ArtTagList(List<ArtTagDTO> pubList, List<ArtTagDTO> delList)
        {
            this();
            this.publicTags = pubList;
            this.deletedTags = delList;
        }

        /**
         * @return the publicTags
         */
        public List<ArtTagDTO> getPublicTags() {
            return publicTags;
        }

        /**
         * @param publicTags the publicTags to set
         */
        public void setPublicTags(List<ArtTagDTO> publicTags) {
            this.publicTags = publicTags;
        }

        /**
         * @return the deletedTags
         */
        public List<ArtTagDTO> getDeletedTags() {
            return deletedTags;
        }

        /**
         * @param deletedTags the deletedTags to set
         */
        public void setDeletedTags(List<ArtTagDTO> deletedTags) {
            this.deletedTags = deletedTags;
        }
    }

    public static class ArtTagDTO
    {
        private ArtTag artTag;
        private List<ArtTagDTO> subTags;

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
        }

        public ArtTag fetchArtTag() {
            return artTag;
        }

        public void addSubTag(ArtTagDTO sub)
        {
            if (subTags == null) {
                subTags = new LinkedList<>();
            }
            subTags.add(sub);
        }

        public String toString()
        {
            StringBuilder sb = new StringBuilder();

            toString(sb, 0);
            return sb.toString();
        }

        protected void toString(StringBuilder sb, int indent)
        {
            Util.printIndent(sb, indent);
            sb.append("Tag ").append(getTagName()).append("\n");

            List<ArtTagDTO> subTags = getSubTags();
            if (subTags != null) {
                indent += 2;
                Util.printIndent(sb, indent);
                sb.append("[Sub Tags ").append(subTags.size()).append("]\n");
                for (ArtTagDTO sub : subTags) {
                    sub.toString(sb, indent);
                }
            }
        }

        public void addArtRank(String rankKey) {
            artTag.addArtRank(rankKey);
        }

        public void removeArtRank(String artKey) {
            artTag.removeArtRank(artKey);
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
        public String getTagName() {
            return Util.fromRawByte(artTag.getTagName());
        }

        public void setTagName(String tagName) {
            artTag.setTagName(Util.toRawByte(tagName));
        }

        /**
         * Get/set parent tagName.
         */
        public String getParentTag() {
            return Util.fromRawByte(artTag.getParentTag());
        }

        public void setParentTag(String parent) {
            artTag.setParentTag(Util.toRawByte(parent));
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
         * Get/set articleRank.
         */
        public List<String> getArticleRank() {
            return artTag.getTagArtRanks();
        }

        public void setArticleRank(List<String> ranks) {
            artTag.setTagArtRanks(ranks);
        }

        /**
         * @return the subTags
         */
        public List<ArtTagDTO> getSubTags() {
            return subTags;
        }

        /**
         * @param subTags the subTags to set
         */
        public void setSubTags(List<ArtTagDTO> subTags) {
            this.subTags = subTags;
        }

        /**
         * Get/set tagKind.
         */
        public String getTagKind()
        {
            String kind = artTag.getTagKind();
            return kind == null ? ArtTag.BLOG : kind;
        }

        public void setTagKind(String kind)
        {
            if (kind.equals(ArtTag.EDU)) {
                artTag.setTagKind(ArtTag.EDU);

            } else if (kind.equals(ArtTag.ADS)) {
                artTag.setTagKind(ArtTag.ADS);

            } else if (kind.equals(ArtTag.ESTORE)) {
                artTag.setTagKind(ArtTag.ESTORE);

            } else {
                artTag.setTagKind(ArtTag.BLOG);
            }
        }
    }
}
