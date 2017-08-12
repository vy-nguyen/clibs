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
import AuthorBase         from 'vntd-shared/layout/AuthorBase.jsx';
import BigBreadcrumbs     from 'vntd-shared/layout/BigBreadcrumbs.jsx';
import ArticleStore       from 'vntd-root/stores/ArticleStore.jsx';

class NewsFeed extends AuthorBase
{
    constructor(props) {
        super(props);
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
