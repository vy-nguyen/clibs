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
import UserStore    from 'vntd-shared/stores/UserStore.jsx';

let PostArticles = React.createClass({

    render: function() {
        let panes = null;
        
        if (this.props.data && !_.isEmpty(this.props.data)) {
            panes = _.map(this.props.data, function(article, idx) {
                return (<PostPane data={article} key={_.uniqueId('post-pane-')}/>);
            });
        } else {
            let user = this._getAuthor();
            let name = user ? user.firstName : "";
            panes = <div><h2>{name} doesn't have any articles</h2></div>
        }
        return (
            <WidgetGrid>
                {panes}
            </WidgetGrid>
        )
    },

    _getAuthor: function() {
        let userUuid = this.props.userUuid;
        return userUuid ? UserStore.getUserByUuid(userUuid) : null;
    }
});

export default PostArticles;
