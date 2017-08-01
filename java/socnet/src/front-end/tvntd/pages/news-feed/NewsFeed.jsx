/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import AuthorFeed         from 'vntd-root/components/AuthorFeed.jsx';

import SubHeader          from '../layout/SubHeader.jsx';
import EditorPost         from 'vntd-shared/forms/commons/EditorPost.jsx';
import BigBreadcrumbs     from 'vntd-shared/layout/BigBreadcrumbs.jsx';
import AuthorStore        from 'vntd-root/stores/AuthorStore.jsx';
import ArticleStore       from 'vntd-root/stores/ArticleStore.jsx';

class NewsFeed extends React.Component
{
    constructor(props) {
        super(props);
        this._updateState   = this._updateState.bind(this);
        this._updateAuthors = this._updateAuthors.bind(this);

        this.state = this._updateAuthors();
    }

    componentDidMount() {
        this.unsub = AuthorStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateAuthors() {
        let authors = AuthorStore.getAuthorUuidList();
        return {
            authorCnt : authors.length,
            authorList: authors
        }
    }

    _updateState(data, elm, what) {
        if (AuthorStore.hasDiffAuthor(this.state.authorCnt)) {
            this.setState(this._updateAuthors());
        }
    }

    renderAuthors() {
        let output = [], authorList = this.state.authorList;

        _.forEach(authorList, function(uuid) {
            output.push(
                <AuthorFeed key={_.uniqueId("author-feed-")} authorUuid={uuid}/>
            );
        });
        return output;
    }

    render() {
        return (
            <div id="author-content">
                <div className="row">
                    <BigBreadcrumbs className="col-xs-12 col-sm-7 col-md-7 col-lg-4"/>
                    <SubHeader/>
                </div>
                <EditorPost id="feed-"/>
                {this.renderAuthors()}
            </div>
        )
    }
}

export default NewsFeed;
