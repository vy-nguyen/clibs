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
package com.tvntd.service.user;

import java.nio.charset.Charset;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvntd.dao.CommentRankRepo;
import com.tvntd.dao.CommentRepo;
import com.tvntd.forms.CommentForm;
import com.tvntd.models.Comment;
import com.tvntd.service.api.ICommentService;

@Service
@Transactional
public class CommentService implements ICommentService
{
    @Autowired
    CommentRepo commentRepo;

    @Autowired
    CommentRankRepo rankRepo;

    @Override
    public CommentDTOResponse getCommentPost(UUID articleUuid)
    {
        return null;
    }

    @Override
    public CommentDTOResponse getCommentPost(String[] uuidList)
    {
        return null;
    }

    @Override
    public void saveComment(CommentDTO comment)
    {
    }

    @Override
    public Comment saveComment(Comment comment) {
        return  commentRepo.save(comment);
    }

    @Override
    public void deleteComment(UUID articleUuid)
    {
    }

    @Override
    public void likeComment(UUID articleUuid, UUID user)
    {
    }

    @Override
    public void unLikeComment(UUID articleUuid, UUID user)
    {
    }

    @Override
    public void setFavorite(UUID articleUuid, boolean favorite)
    {
    }

    public static void applyForm(CommentForm form, Comment comment)
    {
        comment.setArticleUuid(form.getArticleUuid());
        comment.setContent(form.getComment().getBytes(Charset.forName("UTF-8")));
    }
}
