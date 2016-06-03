/**
 * Copyright by Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import Panel          from 'vntd-shared/widgets/Panel.jsx';

let TaskTimeline = React.createClass({
    render: function() {
        let filterMenu = {
            reactId  : 'filter-friend',
            iconFmt  : 'btn-xs btn-warning',
            titleText: 'Filter',
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: 'Most promissing',
                itemHandler: function() {
                }.bind(this)
            }, {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: 'Give me most credit',
                itemHandler: function() {
                }.bind(this)
            } ]
        };
        let panelDef = {
            init   : false,
            reactId: 'task-info',
            icon   : 'fa fa-user',
            header : 'My Task Timeline',
            headerMenus: [filterMenu]
        };

        return (
            <Panel context={panelDef}>
                <h1>You don't have any pending tasks yet!</h1>
            </Panel>
        )
    }
});

export default TaskTimeline;
