/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React from 'react-mod';
import _     from 'lodash';

import ArticleStore from 'vntd-root/stores/ArticleStore.jsx';
import PostPane     from 'vntd-root/components/PostPane.jsx';
import WidgetGrid   from 'vntd-shared/widgets/WidgetGrid.jsx';

let PostArticles = React.createClass({

    render: function() {
        let panes = null;
        
        if (this.props.data) {
            panes = [];
            _.forOwn(this.props.data, function(article, idx) {
                panes.push(<PostPane data={article} key={_.uniqueId('post-pane-')}/>);
            });
        } else {
            let user = this.props.user;
            let name = user ? user.firstName : "";
            panes = <div><h2>{name} doesn't have any articles</h2></div>
        }
        return (
            <WidgetGrid className={this.props.className}>
                {panes}
            </WidgetGrid>
        )
    }
});

export default PostArticles;
