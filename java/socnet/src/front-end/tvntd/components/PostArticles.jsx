/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React from 'react-mod';
import _     from 'lodash';

import PostPane     from 'vntd-root/components/PostPane.jsx';
import WidgetGrid   from 'vntd-shared/widgets/WidgetGrid.jsx';

let PostArticles = React.createClass({
    render: function() {
        let panes = _.map(this.props.data, function(article) {
            return (<PostPane data={article}/>);
        });
        return (
            <WidgetGrid>
                {panes}
            </WidgetGrid>
        )
    }
});

export default PostArticles;
