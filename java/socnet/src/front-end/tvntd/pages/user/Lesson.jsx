/**
 * Written by Vy Nguyen (2017)
 */
'use strict';

import _                 from 'lodash';
import React             from 'react-mod';
import PropTypes         from 'prop-types';

import InputBase         from 'vntd-shared/layout/InputBase.jsx';
import UserStore         from 'vntd-shared/stores/UserStore.jsx';
import ArticleBox        from 'vntd-root/components/ArticleBox.jsx';
import PostItem          from 'vntd-root/components/PostItem.jsx';
import RefLinks          from 'vntd-root/components/RefLinks.jsx';
import Lang              from 'vntd-root/stores/LanguageStore.jsx';
import { VntdGlob }      from 'vntd-root/config/constants.js';
import { ArticleStore }  from 'vntd-root/stores/ArticleStore.jsx';
import QuestionStore     from 'vntd-root/stores/QuestionStore.jsx';
import Questionare       from 'vntd-root/pages/user/Questionare.jsx';

class Lesson extends InputBase
{
    constructor(props) {
        super(props, _.uniqueId(), QuestionStore);
        let article = this._getArticle();

        this.title = article != null ? article.getTitle() : Lang.translate("No article");
        this.crumbLabel = Lang.translate("Lesson");
        this.crumbRoute = "/public/lesson/" + props.params.articleUuid;
    }

    _getArticle() {
        let article = this.props.article;

        if (article == null) {
            let articleUuid = this.props.params.articleUuid;
            article = ArticleStore.getArticleByUuid(articleUuid);
        }
        return article;
    }

    _updateState(store, data, item, code) {
    }

    // @Override
    //
    _isOwner() {
        let article = this._getArticle();
        if (article != null) {
            return UserStore.isUserMe(article.authorUuid);
        }
        return false;
    }

    // @Override
    //
    _deletePost() {
        super.deletePost();
        console.log("Delete lesson...");
    }

    _rawMarkup(article) {
        return { __html: article.getContent() };
    }

    _renderForm() {
        let content, pictures, imgs, article = this._getArticle();

        if (article == null) {
            return null;
        }
        imgs = article.getPictureUrl();
        if (imgs != null) {
            if (imgs.length == 1) {
                pictures = <PostItem style={VntdGlob.styleImg} data={imgs}/>;
            } else {
                pictures = <PostItem data={imgs}/>;
            }
        }
        content = (
            <div>
                {ArticleBox.youtubeLink(article, false)}
                {pictures}
                <div style={VntdGlob.styleContent}
                    dangerouslySetInnerHTML={this._rawMarkup(article)}/>
            </div>
        );
        return (
            <div className="well">
                <RefLinks article={article} edit={false} notifyId={this.id}/>
                {content}
                <Questionare article={article}/>
            </div>
        );
    }
}

export default Lesson;
