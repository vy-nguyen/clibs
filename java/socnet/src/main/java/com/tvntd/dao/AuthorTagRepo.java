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
package com.tvntd.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tvntd.models.AuthorTag;

public interface AuthorTagRepo extends JpaRepository<AuthorTag, String>
{
    AuthorTag findByTagOid(String tagOid);
    List<AuthorTag> findByTagOid(List<String> tagOids);

    List<AuthorTag> findAllByAuthorUuid(String authorUuid);
    List<AuthorTag> findByAuthorUuidIn(List<String> authorUuid);
    
    @Override
    void delete(String tagOid);

    public static class AuthorTagRespDTO
    {
        protected String authorUuid;
        protected List<AuthorTagDTO> authorTags;

        public AuthorTagRespDTO(String uuid, List<AuthorTagDTO> tags)
        {
            authorUuid = uuid;
            authorTags = tags;
        }

        /**
         * @return the authorUuid
         */
        public String getAuthorUuid() {
            return authorUuid;
        }

        /**
         * @param authorUuid the authorUuid to set
         */
        public void setAuthorUuid(String authorUuid) {
            this.authorUuid = authorUuid;
        }

        /**
         * @return the authorTags
         */
        public List<AuthorTagDTO> getAuthorTags() {
            return authorTags;
        }

        /**
         * @param authorTags the authorTags to set
         */
        public void setAuthorTags(List<AuthorTagDTO> authorTags) {
            this.authorTags = authorTags;
        }
    }

    public static class AuthorTagDTO
    {
        protected AuthorTag authorTag;

        public AuthorTagDTO(AuthorTag tag) {
            authorTag = tag;
        }

        public AuthorTag fetchAuthorTag() {
            return authorTag;
        }

        public String getTagName() {
            return authorTag.getTag();
        }

        public String getHeadNotifOid() {
            return authorTag.getHeadNotif();
        }

        public String getHeadChainOid() {
            return authorTag.getHeadChain();
        }

        public boolean isFavorite() {
            return authorTag.isFavorite();
        }

        public Long getRank() {
            return authorTag.getRank();
        }

        public void setRank(Long rank) {
            authorTag.setRank(rank);
        }

        public Long getNotifCount() {
            return authorTag.getNotifCount();
        }
    }
}
