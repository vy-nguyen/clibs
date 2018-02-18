/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _      from 'lodash';
import Reflux from 'reflux';
import React  from 'react-mod';

import Actions          from 'vntd-root/actions/Actions.jsx';
import NavActions       from 'vntd-shared/actions/NavigationActions.jsx';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import {Util}           from 'vntd-shared/utils/Enum.jsx';
import {ArticleBrief}   from 'vntd-root/stores/Article.jsx';
import ArticleFactory   from 'vntd-root/stores/ArticleFactory.jsx';
import ArticleTagStore  from 'vntd-root/stores/ArticleTagStore.jsx';
import QuestionStore    from 'vntd-root/stores/QuestionStore.jsx';
import {
    ArticleStore, EProductStore, GlobStore
} from 'vntd-root/stores/ArticleStore.jsx';

let AuthorStore = Reflux.createStore({
    data: {},
    listenables: Actions,

    reset: function() {
        this.data = {
            authorMap      : {},
            authorTagMgr   : {},
            authorEStoreMgr: {},
            authorUuids    : [],
            allArticleRanks: {}
        };
    },

    getAuthorList: function() {
        return this.data.authorMap;
    },

    getAuthorUuidList: function() {
        return this.data.authorUuids;
    },

    hasDiffAuthor: function(curr) {
        return curr !== this.data.authorUuids.length;
    },

    getAuthorByUuid: function(uuid) {
        return this.data.authorMap[uuid];
    },

    lookupArticleRankByUuid: function(uuid) {
        return this.data.allArticleRanks[uuid];
    },

    getArticleRankByUuid: function(uuid, authorUuid) {
        let article, rank = this.lookupArticleRankByUuid(uuid);

        if (rank != null) {
            return rank;
        }
        article = ArticleStore.getArticleByUuid(uuid, authorUuid);
        if (article == null) {
            return null;
        }
        return article.getArticleRank();
    },

    fetchExtraArticles: function(mode) {
        if (mode === "edu") {
            this.fetchEduArticles();
        }
    },

    fetchEduArticles: function() {
        let reqUuids = [];

        _.forOwn(this.data.authorMap, function(author) {
            if (author.postMasks & 0x1) {
                reqUuids.push(author.authorUuid);
            }
        });
        QuestionStore.fetchAuthors(reqUuids);
    },

    /**
     * @return string tags used for autocomplete.
     */
     getTagsByAuthorUuid: function(uuid) {
         if (uuid == null && UserStore.getSelf() != null) {
             uuid = UserStore.getSelf().userUuid;
         }
         if (uuid != null) {
            return this.getAuthorTagMgr(uuid).getStringTags();
         }
        return null;
    },

    /**
     * @return the tag mgr matching with the author uuid.
     */
    getAuthorTagMgr: function(uuid) {
        let authorTagMgr = this.data.authorTagMgr[uuid];

        if (authorTagMgr == null) {
            this.data.authorTagMgr[uuid] = ArticleFactory.newAuthorTagMgr(uuid, this);
            return this.data.authorTagMgr[uuid];
        }
        return authorTagMgr;
    },

    getAuthorEStoreMgr: function(uuid) {
        let estoreMgr = this.data.authorEStoreMgr[uuid];

        if (estoreMgr == null) {
            this.data.authorEStoreMgr[uuid] = ArticleFactory.newAuthorTagMgr(uuid, this);
            return this.data.authorEStoreMgr[uuid];
        }
        return estoreMgr;
    },

    /**
     * @return authorTag for the user matching with the name.
     */
    getAuthorTag: function(uuid, tagName) {
        let tagMgr = this.getAuthorTagMgr(uuid);
        return tagMgr.getAuthorTag(tagName, 50, false);
    },

    updateAuthorTag: function(tagInfo, artRank) {
        let article, userUuid = tagInfo.userUuid,
            authorTagMgr = this.getAuthorTagMgr(userUuid),
            authorTag = authorTagMgr.getAuthorTag(tagInfo.tagName,
                            tagInfo.tagRank, tagInfo.favorite);

        if (artRank == null) {
            article = ArticleStore.getArticleByUuid(tagInfo.articleUuid, userUuid);
            artRank =
                ArticleFactory.newArticleRank(null, ArticleStore, authorTag, article);
        } else {
            artRank.detachTag();
        }
        artRank.attachTag(authorTag);
        artRank.updateArticleRank(tagInfo);

        Actions.updateArtRank(tagInfo, tagInfo.cbButtonId);
        this.trigger(this.data, artRank, "update");
    },

    updateAuthorEStoreTag: function(tagInfo, artRank) {
        let userUuid = tagInfo.userUuid,
            estoreMgr = this.getAuthorEStoreMgr(userUuid),
            estoreTag = estoreMgr.getAuthorTag(tagInfo.tagName,
                            tagInfo.tagRank, tagInfo.favorite);

        if (artRank == null) {
            let prod = EProductStore.getProductByUuid(tagInfo.articleUuid, userUuid);
            if (prod == null) {
                return;
            }
            artRank =
                ArticleFactory.newArticleRank(null, EProductStore, estoreTag, prod);
        } else {
            artRank.detachTag();
        }
        artRank.attachTag(estoreTag);
        this.trigger(this.data, artRank, "update");
    },

    removeArticleRank: function(article, silent) {
        if (article && article.rank != null) {
            let tagMgr = this.getAuthorTagMgr(article.authorUuid);

            tagMgr.removeArticleRank(article.rank);
            if (silent !== true) {
                this.trigger(this.data, article.rank, "remove");
            }
        }
    },

    iterAuthor: function(uuidList, func) {
        if (uuidList == null) {
            _.forOwn(this.data.authorMap, function(author, key) {
                if (author.getUser() != null) {
                    func(author, key);
                }
            });
        } else {
            _.forOwn(uuidList, function(uuid, key) {
                let author = this.data.authorMap[uuid];
                if (author != null && author.getUser() != null) {
                    func(author, key);
                }
            }.bind(this));
        }
    },

    _addAuthorList: function(authorList) {
        let authorMap = this.data.authorMap, authorUuids = this.data.authorUuids;

        _.forOwn(authorList, function(author, key) {
            let uuid = author.authorUuid;
            if (authorMap[uuid] == null) {
                authorMap[uuid] = ArticleFactory.newAuthor(author);
                Util.insertUnique(uuid, authorUuids, Util.compareUuid);
            }
            this.getAuthorTagMgr(uuid).addAuthorTagList(author.authorTags);
        }.bind(this));
        this.trigger(this.data, null, "authors");
    },

    /*
     * Update article ranks with data returned from the server.
     */
    _updateArticleRank: function(articleRank, trigger) {
        _.forOwn(articleRank, function(rank) {
            this.addArticleRankFromJson(rank);
        }.bind(this));

        if (trigger != null) {
            this.trigger(this.data, null, trigger);
        }
    },

    addArticleRankFromArticle(article) {
        return this.addArticleRankFromJson(article.genArticleRankJson());
    },

    addArticleRankFromJson(rank) {
        let obj = this.getAuthorTagMgr(rank.authorUuid).addArticleRank(rank, GlobStore);

        this.data.allArticleRanks[obj.articleUuid] = obj;
        return obj;
    },

    /*
     * Update article ranks from array of articles.
     */
    _updateArtRankFromArticles: function(articles) {
        _.forOwn(articles, function(art) {
            if (art.rank != null && !(art.rank instanceof ArticleBrief)) {
                this.addArticleRankFromJson(art.rank);
            }
        }.bind(this));
    },

    dumpData: function(header) {
        console.log(header);
        console.log(this.data);
    },

    init: function() {
        this.reset();
    },

    onPostArticleSelectCompleted: function(data) {
        this._updateArticleRank(data.articleRank, "update");
    },

    onInitCompleted: function(json) {
    },

    onPreloadCompleted: function(data) {
        this._addAuthorList(data.authors);
    },

    onGetAuthorsCompleted: function(data) {
        this._addAuthorList(data.authors);
    },

    onGetArticleRankCompleted: function(data) {
        this._updateArticleRank(data.articleRank, "update");
    },

    onReRankTagCompleted: function(tagMgr) {
        this.trigger(this.data, tagMgr, "reRank");
    },

    onCommitTagRanksCompleted: function(data) {
        let tagMgr = data.cbContext;
        NavActions.buttonChange(tagMgr.btnId);

        tagMgr.updatePrivateTags(data.tagRanks, data.artList);
        ArticleTagStore.updatePublicTags(data.tagRanks, tagMgr);
    },

    onCommitTagRanksFailed: function(err) {
        let tagMgr = err.getContext();
        NavActions.onButtonChangeFailed(tagMgr.btnId);
    },

    onUpdateArtRankCompleted: function(data) {
        let btnId = data.cbContext;
        NavActions.buttonChange(btnId);
        this._updateArticleRank(data.articleRank, "update");
    },

    onDeleteUserTagCompleted: function(data) {
        let tagMgr = data.cbContext;

        _.forEach(data.tagRanks, function(it) {
            tagMgr.removeAuthorTag(it);
        });
        this.trigger(this.data, data, "delTag");
    },

    mainStartup(data) {
        let authors = data.authors;
        if (authors != null) {
            this._addAuthorList(authors);
        }
        this._updateArticleRank(data.artRanks, null);
    },

    mainTrigger(data) {
        this.trigger(this.data, data, "startup");
    },

    onGetDomainDataCompleted: function(data, context) {
        this._updateArticleRank(data.artRanks, "domain");
    }
});

export default AuthorStore;
