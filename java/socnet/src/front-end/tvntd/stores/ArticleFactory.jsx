/**
 * Created by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _            from 'lodash';
import Actions      from 'vntd-root/actions/Actions.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';
import CommentStore from 'vntd-root/stores/CommentStore.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';
import WebUtils     from 'vntd-shared/utils/WebUtils.jsx';

import {VConst}     from 'vntd-root/config/constants.js';
import {
    Article,      Product,        AdsItem,    ArticleRank,
    AuthorShelf,  AuthorTagMgr,   Author,     PublishArtTag, ArtTag
} from 'vntd-root/stores/Article.jsx';

class ArticleFactory {
    static newInstance(store, data) {
        let article, kind = store.data.storeKind;

        if (kind === VConst.blog) {
            article = new Article(data, store);
        } else if (kind === VConst.estore) {
            article = new Product(data, store);
        } else {
            article = new AdsItem(data, store);
        }
        if (data.rank != null) {
            CommentStore.addArtAttr(data.rank);
            article.rank = AuthorStore.addArticleRankFromJson(data.rank);
        }
        if (article.rank == null) {
            article.authorStore = AuthorStore;
        }
        return article;
    }

    static newDefInstance(store, articleUuid, authorUuid) {
        let json = {
            authorUuid : authorUuid,
            articleUuid: articleUuid,
            createdDate: WebUtils.currentTime
        };
        return ArticleFactory.newDefInstanceFrmRank(
            store, AuthorStore.lookupArticleRankByUuid(articleUuid), json
        );
    }

    static newDefInstanceFrmRank(store, artRank, json) {
        if (json == null) {
            json = {};
        }
        json.noData     = true;
        json.ownerStore = store;

        if (artRank != null) {
            json.authorUuid  = artRank.authorUuid;
            json.articleUuid = artRank.articleUuid;
            json.createdDate = artRank.timeStamp;
            json.topic       = artRank.getArtTitle();
            json.content     = artRank.contentBrief;
            json.createdDate = artRank.timeStamp;
            json.published   = true;
        }
        store.recordMissingUuid(json.articleUuid);
        return ArticleFactory.newInstance(store, json);
    }

    static newArticleRank(data, store, authorTag, article) {
        return ArticleRank.newArticleRank(data, store, authorTag, article);
    }

    static newAuthorShelf(articleUuid, authorUuid) {
        return new AuthorShelf(articleUuid, authorUuid);
    }

    static newAuthorTagMgr(uuid, authorStore) {
        return new AuthorTagMgr(uuid, authorStore);
    }

    static newAuthor(author) {
        return new Author(author);
    }

    static newArtTag(tag) {
        return new ArtTag(tag, AuthorStore);
    }

    static newPublishArtTag(artObj, artTag, articleUuid) {
        return new PublishArtTag(artObj, artTag, articleUuid);
    }
}

export default ArticleFactory;
