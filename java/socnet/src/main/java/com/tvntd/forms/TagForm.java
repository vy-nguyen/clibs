/*
 * Copyright (C) 2014-present Vy Nguyen
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

public class TagForm
{
    private String userUuid;
    private TagRank[] tagRanks;
    private TagArtRank[] artList;

    /**
     * @return the userUuid
     */
    public String getUserUuid() {
        return userUuid;
    }

    /**
     * @param userUuid the userUuid to set
     */
    public void setUserUuid(String userUuid) {
        this.userUuid = userUuid;
    }

    /**
     * @return the tagRanks
     */
    public TagRank[] getTagRanks() {
        return tagRanks;
    }

    /**
     * @param tagRanks the tagRanks to set
     */
    public void setTagRanks(TagRank[] tagRanks) {
        this.tagRanks = tagRanks;
    }

    /**
     * @return the artList
     */
    public TagArtRank[] getArtList() {
        return artList;
    }

    public static class TagRank
    {
        private String tagName;
        private String parent;
        private Long rank;
        private boolean pubTag;

        /**
         * @return the tagName
         */
        public String getTagName() {
            return tagName;
        }

        /**
         * @return the parent
         */
        public String getParent() {
            return parent;
        }

        /**
         * @return the rank
         */
        public Long getRank() {
            return rank;
        }

        /**
         * @return the pubTag
         */
        public boolean isPubTag() {
            return pubTag;
        }
    }

    public static class TagArtRank
    {
        private String tagName;
        private String[] artUuid;

        /**
         * @return the tagName
         */
        public String getTagName() {
            return tagName;
        }

        /**
         * @return the artUuid
         */
        public String[] getArtUuid() {
            return artUuid;
        }
    }
}
