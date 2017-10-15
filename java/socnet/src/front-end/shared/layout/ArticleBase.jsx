/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import React               from 'react-mod';
import Mesg                from 'vntd-root/components/Mesg.jsx';
import { ArticleStore }    from 'vntd-root/stores/ArticleStore.jsx';

class ArticleBase extends React.Component
{
    constructor(props) {
        super(props);
        this._updateArts = this._updateArts.bind(this);
        this.state = {
            articleUuid: null,
            articles   : ArticleStore.getSortedArticlesByAuthor(props.authorUuid)
        }
    }

    componentDidMount() {
        this.unsub = ArticleStore.listen(this._updateArts);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
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
