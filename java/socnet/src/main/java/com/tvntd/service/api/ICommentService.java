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
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tvntd.models.Comment;
import com.tvntd.models.CommentRank;

public interface ICommentService
{
    public CommentDTOResponse getCommentPost(UUID articleUuid);
    public CommentDTOResponse getCommentPost(String[] uuidList);

    public void deleteComment(UUID articleUuid);
    public void saveComment(CommentDTO comment);
    public Comment saveComment(Comment comment);

    public void likeComment(UUID articleUuid, UUID user);
    public void unLikeComment(UUID articleUuid, UUID user);
    public void setFavorite(UUID articleUuid, boolean favorite);

    public static class CommentDTOResponse extends GenericResponse
    {
        private List<CommentDTO> comments;

        public CommentDTOResponse(List<CommentDTO> list)
        {
            super(GenericResponse.USER_HOME, null, null);
            this.comments = list;
        }

        public CommentDTOResponse(Comment comment, CommentRank rank)
        {
            super(GenericResponse.USER_HOME, null, null);
            comments = new ArrayList<>();
            CommentDTO dto = new CommentDTO(comment, rank);

            dto.convertUTF();
            comments.add(dto);
        }

        public void addComment(Comment comment, CommentRank rank)
        {
            CommentDTO dto = new CommentDTO(comment, rank);
            dto.convertUTF();
            comments.add(dto);
        }

        /**
         * @return the comments
         */
        public List<CommentDTO> getComments() {
            return comments;
        }
    }

    public static class CommentDTO
    {
        private static Logger s_log = LoggerFactory.getLogger(CommentDTO.class);
        private Comment comment;
        private CommentRank rank;
        private String commentText;

        public CommentDTO(Comment comment, CommentRank rank)
        {
            this.comment = comment;
            this.rank = rank;
        }

        public void convertUTF()
        {
            if (comment == null || commentText != null) {
                return;
            }
            try {
                byte[] str = comment.getContent();
                if (str != null) {
                    commentText = new String(str, "UTF-8");
                }
            } catch(UnsupportedEncodingException e) {
                s_log.error(e.toString());
            }
        }

        public Comment fetchComment() {
            return comment;
        }

        public CommentRank fetchCommentRank() {
            return rank;
        }

        public String getArticleUuid() {
            return comment != null ? comment.getArticleUuid() : null;
        }

        public Long getCommentId() {
            return comment != null ? comment.getId() : null;
        }

        public void setCommentId(Long id)
        {
            if (comment != null) {
                comment.setId(id);
            }
        }

        public String getCommentDate()
        {
            if (comment == null) {
                return null;
            }
            DateFormat df = new SimpleDateFormat("MM/dd/yy HH:mm");
            return df.format(comment.getTimeStamp());
        }

        public String getComment() {
            return commentText;
        }

        public String getUserUuid() {
            return comment != null? comment.getUserUuid() : null;
        }

        public Long getLikes() {
            return rank != null ? rank.getLikes() : null;
        }

        public List<UUID> getUserLiked() {
            return rank != null ? rank.getUserLiked() : null;
        }

        public boolean isFavorite() {
            return comment != null ? comment.isFavorite() : null;
        }
    }
}
