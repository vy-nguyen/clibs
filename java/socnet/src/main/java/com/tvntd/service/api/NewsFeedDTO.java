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

import java.util.List;

import com.tvntd.service.api.IArticleService.ArticleRankDTO;

public class NewsFeedDTO
{
    private List<PublicTagDTO> publicTags;
    private List<AdTagDTO> adTags;
    private List<EStoreTagDTO> eStoreTags;

    /**
     * @return the publicTags
     */
    public List<PublicTagDTO> getPublicTags() {
        return publicTags;
    }

    /**
     * @return the adTags
     */
    public List<AdTagDTO> getAdTags() {
        return adTags;
    }

    /**
     * @return the eStoreTags
     */
    public List<EStoreTagDTO> geteStoreTags() {
        return eStoreTags;
    }

    static class TagDTO
    {
        private String tagName;
        private List<ArticleRankDTO> articleInfo;
        private List<TagDTO> subTags;

        /**
         * @return the tagName
         */
        public String getTagName() {
            return tagName;
        }

        /**
         * @return the articleInfo
         */
        public List<ArticleRankDTO> getArticleInfo() {
            return articleInfo;
        }

        /**
         * @return the subTags
         */
        public List<TagDTO> getSubTags() {
            return subTags;
        }
    }

    public static class PublicTagDTO extends TagDTO
    {
    }

    public static class AdTagDTO extends TagDTO
    {
    }

    public static class EStoreTagDTO extends TagDTO
    {
    }
}
