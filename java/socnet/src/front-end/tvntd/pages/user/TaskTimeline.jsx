/**
 * Copyright by Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import Panel          from 'vntd-shared/widgets/Panel.jsx';

class TaskTimeline extends React.Component
{
    constructor(props) {
        super(props);
        this._filterMenu = {
            reactId  : 'filter-friend',
            iconFmt  : 'btn-xs btn-warning',
            titleText: 'Filter',
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: 'Most promissing',
                itemHandler: function() {
                }
            }, {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: 'Give me most credit',
                itemHandler: function() {
                }
            } ]
        };
        this._panelDef = {
            init   : false,
            reactId: 'task-info',
            icon   : 'fa fa-user',
            header : 'My Task Timeline',
            headerMenus: [ this._filterMenu ]
        };

    }

    render() {
        return (
            <Panel context={this._panelDef}>
                <h1>You don't have any pending tasks yet!</h1>
            </Panel>
        )
    }
}

export default TaskTimeline;
