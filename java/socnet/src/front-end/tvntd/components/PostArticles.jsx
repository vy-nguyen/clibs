/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _     from 'lodash';
import React from 'react-mod';

import ArticleStore from 'vntd-root/stores/ArticleStore.jsx';
import PostPane     from 'vntd-root/components/PostPane.jsx';
import WidgetGrid   from 'vntd-shared/widgets/WidgetGrid.jsx';

class PostArticles extends React.Component
{
    render() {
        let panes = null;

        if (this.props.data && !_.isEmpty(this.props.data)) {
            let edit = this.props.edit;
            panes = [];
            _.forOwn(this.props.data, function(article, idx) {
                panes.push(<PostPane data={article} key={_.uniqueId('post-pane-')} edit={edit}/>);
            });
        } else {
            panes = <div><h2>No articles</h2></div>
        }
        return (
            <WidgetGrid className={this.props.className} style={{ height: 'auto' }}>
                {panes}
            </WidgetGrid>
        )
    }
}

export default PostArticles;
