/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _            from 'lodash';
import React        from 'react-mod';
import Reflux       from 'reflux';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';
import ArticleBase  from 'vntd-shared/layout/ArticleBase.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';
import Lang         from 'vntd-root/stores/LanguageStore.jsx';
import Mesg         from 'vntd-root/components/Mesg.jsx'
import PostPane     from 'vntd-root/components/PostPane.jsx';
import LikeStat     from 'vntd-root/components/LikeStat.jsx';
import ArticleBox   from 'vntd-root/components/ArticleBox.jsx';

class Blog extends ArticleBase
{
    constructor(props) {
        super(props);
    }

    _readArticle(articleUuid) {
        if (this.state.articleUuid === articleUuid) {
            this.setState({
                articleUuid: null
            });
        } else {
            this.setState({
                articleUuid: articleUuid
            });
        }
    }

    _getBtnFormat(articleUuid) {
        if ((this.state.articleUuid == null) ||
            (this.state.articleUuid !== articleUuid)) {
            return {
                btnClass: "btn btn-primary",
                btnText : Lang.translate("Read more...")
            }
        }
        return {
            btnClass: "btn btn-primary",
            btnText : Lang.translate("Hide article")
        }
    }

    _renderSummarized(authorUuid, articleUuid) {
        let clickCb = {
            callbackArg : this,
            getBtnFormat: this._getBtnFormat.bind(this, articleUuid),
            clickHandler: this._readArticle.bind(this, articleUuid)
        };
        return ArticleBox.artBlogWide(articleUuid, authorUuid, clickCb);
    }

    _renderFull(articleUuid, article, artRank) {
        if ((this.state.articleUuid == null) ||
            (this.state.articleUuid !== articleUuid)) {
            return null;
        }
        if (article != null) {
            return <PostPane data={article}/>;
        }
        if (artRank != null) {
            return PostPane.renderArticleRank(artRank);
        }
        return null;
    }

    render() {
        let articles = this.state.articles;
        let items = [];

        if (articles == null) {
            items.push(<h3><Mesg text="No post"/></h3>);
        } else {
            _.forEach(articles, function(art) {
                items.push(
                    <div className="row" key={_.uniqueId('blog-row-')}>
                        {this._renderSummarized(art.authorUuid, art.articleUuid)}
                        {this._renderFull(art.articleUuid, art, null)}
                    </div>
                );
            }.bind(this));
        }
        return <div>{items}</div>;
    }
}

export default Blog;
