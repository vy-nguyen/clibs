/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import AuthorFeed         from 'vntd-root/components/AuthorFeed.jsx';
import {GlobStore}        from 'vntd-root/stores/ArticleStore.jsx';

class PublicUrlArt extends React.Component
{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        let article, {author, articleUuid} = this.props.params;

        article = GlobStore.lookupArticle(articleUuid);
        if (article == null) {
            return <h1>Not found</h1>;
        }
        return (
            <AuthorFeed authorUuid={author} articles={[article]}/>
        );
    }
}

PublicUrlArt.propTypes = {
};

export default PublicUrlArt;
