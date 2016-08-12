/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import Reflux             from 'reflux';
import AuthorFeed         from 'vntd-root/components/AuthorFeed.jsx';

import SubHeader          from '../layout/SubHeader.jsx';
import BigBreadcrumbs     from 'vntd-shared/layout/BigBreadcrumbs.jsx';
import AuthorStore        from 'vntd-root/stores/AuthorStore.jsx';
import ArticleStore       from 'vntd-root/stores/ArticleStore.jsx';

let NewsFeed = React.createClass({
    mixins: [
        Reflux.connect(AuthorStore),
        Reflux.connect(ArticleStore)
    ],

    renderAuthors: function() {
        let output = [];
        let authorList = AuthorStore.getAuthorUuidList();
        _.forEach(authorList, function(uuid) {
            output.push(<AuthorFeed key={_.uniqueId("author-feed-")} authorUuid={uuid}/>);
        });
        return output;
    },

    render: function() {
        return (
            <div id="author-content">
                <div className="row">
                    <BigBreadcrumbs className="col-xs-12 col-sm-7 col-md-7 col-lg-4"/>
                    <SubHeader/>
                </div>
                {this.renderAuthors()}
            </div>
        )
    }
});

export default NewsFeed;
