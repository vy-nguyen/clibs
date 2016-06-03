/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import Reflux             from 'reflux';
import AuthorFeed         from 'vntd-root/components/AuthorFeed.jsx';

import SubHeader          from '../layout/SubHeader.jsx';
import BigBreadcrumbs     from 'vntd-shared/layout/BigBreadcrumbs.jsx';
import AuthorStore        from 'vntd-root/stores/AuthorStore.jsx';

let NewsFeed = React.createClass({
    mixins: [
        Reflux.connect(AuthorStore)
    ],

    renderAuthors: function() {
        let output = [];
        AuthorStore.iterAuthor(this.state.authorList, function(author, key) {
            output.push(<AuthorFeed key={_.uniqueId("author-feed-")} user={author}/>);
        });
        return output;
    },

    getInitialState: function() {
        return {
            authorList: this.props.authorList
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            authorList: AuthorStore.getAuthorUuidList()
        });
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
