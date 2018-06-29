/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import AuthorFeed         from 'vntd-root/components/AuthorFeed.jsx';

import EditorPost         from 'vntd-shared/forms/commons/EditorPost.jsx';
import AuthorBase         from 'vntd-shared/layout/AuthorBase.jsx';
import EtherCrumbs        from 'vntd-root/pages/wall/EtherCrumbs.jsx';
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
                    <EtherCrumbs id="route-map" crumb="NewsFeed" route="/newsfeed"/>
                </div>
                <EditorPost id="feed-"/>
                {this.renderAuthors()}
            </div>
        )
    }
}

export default NewsFeed;
