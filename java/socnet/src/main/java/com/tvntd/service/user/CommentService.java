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
import java.util.List;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvntd.dao.CommentRankRepo;
import com.tvntd.dao.CommentRepo;
import com.tvntd.forms.CommentChangeForm;
import com.tvntd.forms.CommentForm;
import com.tvntd.models.ArticleRank;
import com.tvntd.models.Comment;
import com.tvntd.models.CommentRank;
import com.tvntd.service.api.ICommentService;
import com.tvntd.service.api.IProfileService.ProfileDTO;

@Service
@Transactional
public class CommentService implements ICommentService
{
    static private Logger s_log = LoggerFactory.getLogger(CommentService.class);

    @Autowired
    CommentRepo commentRepo;

    @Autowired
    CommentRankRepo rankRepo;

    @Override
    public CommentDTOResponse getCommentPost(String articleUuid)
    {
        return null;
    }

    @Override
    public CommentDTOResponse getCommentPost(String[] uuidList)
    {
        CommentDTOResponse out = new CommentDTOResponse();

        for (String uuid : uuidList) {
            getCommentForArticle(uuid, out);
        }
        return out;
    }

    private void getCommentForArticle(String uuid, CommentDTOResponse resp)
    {
        List<Comment> out = commentRepo.findAllByArticleUuid(uuid);

        if (out != null && !out.isEmpty()) {
            for (Comment c : out) {
                CommentRank r = null;
                if (c.isHashRank() == true) {
                    r = rankRepo.findByCommentId(c.getId());
                }
                resp.addComment(c, r);
            }
        }
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
    public void deleteComment(String articleUuid)
    {
    }

    @Override
    public void likeComment(String articleUuid, String user)
    {
    }

    @Override
    public void unLikeComment(String articleUuid, String user)
    {
    }

    @Override
    public void setFavorite(Long id, String articleUuid, boolean favorite)
    {
        Comment co = commentRepo.findById(id);
        if (co != null) {
            co.setFavorite(favorite);
            commentRepo.save(co);
        }
    }

    @Override
    public ArticleRank updateComment(CommentChangeForm form, ProfileDTO me)
    {
        String artUuid = form.getArticleUuid();
        String kind = form.getKind();
        Long id = form.getCommentId();

        if (kind.equals("fav")) {
            setFavorite(id, artUuid, form.isFavorite());

        } else if (kind.equals("like")) {
            CommentRank rank = rankRepo.findByCommentId(id);
            if (rank == null) {
                Comment co = commentRepo.findById(id);
                if (co != null) {
                    co.setHashRank(true);
                    commentRepo.save(co);
                }
                rank = new CommentRank(id);
            }
            rank.addUserLiked(me.getUserUuid());
            rankRepo.save(rank);
        }
        return new ArticleRank(form, me.getUserUuid());
    }

    public static void applyForm(CommentForm form, Comment comment)
    {
        comment.setArticleUuid(form.getArticleUuid());
        comment.setContent(form.getComment().getBytes(Charset.forName("UTF-8")));
    }
}
