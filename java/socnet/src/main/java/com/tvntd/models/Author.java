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
import java.util.UUID;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.UniqueConstraint;

import com.tvntd.service.api.IProfileService.ProfileDTO;

@Entity
public class Author
{
    @Id
    @Column(length = 64)
    private String authorUuid;

    @Column(length = 64)
    private String frontArtUuid;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "FavoriteArticles",
            uniqueConstraints = @UniqueConstraint(columnNames = {
                "authorUuid", "favArticles"
            }),
            joinColumns = @JoinColumn(name = "authorUuid"))
    private List<UUID> favArticles;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "TimeLineArticles",
            uniqueConstraints = @UniqueConstraint(columnNames = {
                "authorUuid", "timeLineArticles"
            }),
            joinColumns = @JoinColumn(name = "authorUuid"))
    private List<UUID> timeLineArticles;

    @Column(length = 64)
    private String appUuid;

    public static Author fromUserUuid(String userUuid)
    {
        Author author = new Author();
        author.setAuthorUuid(userUuid);
        return author;
    }

    public static Author fromProfile(ProfileDTO profile, String articleUuid)
    {
        Author author = new Author();
        author.setAuthorUuid(profile.getUserUuid().toString());
        author.setFrontArtUuid(articleUuid);
        return author;
    }

    public String toString()
    {
        StringBuilder sb = new StringBuilder();

        sb.append("User ").append(authorUuid).append(", front: ").append(frontArtUuid)
            .append("\n").append("Fav arts: ").append(favArticles)
            .append("\n").append("Tline arts: ").append("\n");
        return sb.toString();
    }

    public void addFavoriteArticle(UUID articleUuid)
    {
        if (favArticles == null) {
            favArticles = new LinkedList<>();
        }
        ProfileDTO.addUnique(favArticles, articleUuid);
    }

    public UUID removeFavoriteArticle(UUID articleUuid)
    {
        if (favArticles != null) {
            return ProfileDTO.removeFrom(favArticles, articleUuid);
        }
        return null;
    }

    public void addTimeLineArticle(UUID articleUuid)
    {
        if (timeLineArticles == null) {
            timeLineArticles = new LinkedList<>();
        }
        ProfileDTO.addUnique(timeLineArticles, articleUuid);
    }

    public UUID removeTimeLineArticle(UUID articleUuid)
    {
        if (timeLineArticles != null) {
            return ProfileDTO.removeFrom(timeLineArticles, articleUuid);
        }
        return null;
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
     * @return the frontArtUuid
     */
    public String getFrontArtUuid() {
        return frontArtUuid;
    }

    /**
     * @param frontArtUuid the frontArtUuid to set
     */
    public void setFrontArtUuid(String frontArtUuid) {
        this.frontArtUuid = frontArtUuid;
    }

    /**
     * @return the favArticles
     */
    public List<UUID> getFavArticles() {
        return favArticles;
    }

    /**
     * @param favArticles the favArticles to set
     */
    public void setFavArticles(List<UUID> favArticles) {
        this.favArticles = favArticles;
    }

    /**
     * @return the timeLineArticles
     */
    public List<UUID> getTimeLineArticles() {
        return timeLineArticles;
    }

    /**
     * @param timeLineArticles the timeLineArticles to set
     */
    public void setTimeLineArticles(List<UUID> timeLineArticles) {
        this.timeLineArticles = timeLineArticles;
    }

    /**
     * @return the appUuid
     */
    public String getAppUuid() {
        return appUuid;
    }

    /**
     * @param appUuid the appUuid to set
     */
    public void setAppUuid(String appUuid) {
        this.appUuid = appUuid;
    }
}
