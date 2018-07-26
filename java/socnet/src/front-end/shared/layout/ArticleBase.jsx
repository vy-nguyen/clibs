/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import React               from 'react-mod';
import Mesg                from 'vntd-root/components/Mesg.jsx';
import ComponentBase       from 'vntd-shared/layout/ComponentBase.jsx';
import { ArticleStore }    from 'vntd-root/stores/ArticleStore.jsx';

class ArticleBase extends ComponentBase
{
    constructor(props) {
        super(props, null, ArticleStore);
        this._updateArts = this._updateArts.bind(this);
        this.state = {
            articleUuid: null,
            articles   : ArticleStore.getSortedArticlesByAuthor(props.authorUuid)
        }
    }

    _updateState(store, data, status, update, authorUuid) {
        return this._updateArts(store, data, status, update, authorUuid);
    }

    _updateArts(store, data, status, update, authorUuid) {
        let state = this.state.articles,
            articles = ArticleStore.getSortedArticlesByAuthor(this.props.authorUuid);

        if ((state == null) ||
            (articles != null && state.length !== articles.length)) {
            this.setState({
                articles: articles
            });
            return true;
        }
        return false;
    }
}

export default ArticleBase;
