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
package com.tvntd.models;

import java.util.LinkedList;
import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;

import com.tvntd.util.Util;

@Entity
public class CommentRank
{
    @Id
    private Long commentId;

    @Column(length = 64)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "CommentLiked",
            joinColumns = @JoinColumn(name = "commentId"))
    private List<String> userLiked;

    public void addUserLiked(String uuid)
    {
        if (userLiked == null) {
            userLiked = new LinkedList<>();
        }
        Util.<String>addUnique(userLiked, uuid);
    }

    public void removeUserLiked(String uuid)
    {
        if (userLiked != null) {
            Util.<String>removeFrom(userLiked, uuid);
        }
    }

    /**
     * @return the commentId
     */
    public Long getCommentId() {
        return commentId;
    }

    /**
     * @param commentId the commentId to set
     */
    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    /**
     * @return the likes
     */
    public Long getLikes() {
        return new Long(userLiked.size());
    }

    /**
     * @return the userLiked
     */
    public List<String> getUserLiked() {
        return userLiked;
    }

    /**
     * @param userLiked the userLiked to set
     */
    public void setUserLiked(List<String> userLiked) {
        this.userLiked = userLiked;
    }
}
