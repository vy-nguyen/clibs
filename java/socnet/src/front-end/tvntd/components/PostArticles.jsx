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
        let panes = _.map(this.props.data, function(article, idx) {
            return (<PostPane data={article} key={_.uniqueId('post-pane-')}/>);
        });
        if (this.props.data === undefined || _.isEmpty(this.props.data)) {
            panes = (
                <div><h2>You have no articles</h2></div>
            );
        }
        return (
            <WidgetGrid>
                {panes}
            </WidgetGrid>
        )
    }
});

export default PostArticles;
