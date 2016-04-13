/**
 * Copyright by Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import MenuStore      from 'vntd-shared/stores/DropdownMenuStore.jsx';
import PanelStore     from 'vntd-shared/stores/PanelStore.jsx';
import Panel          from 'vntd-shared/widgets/Panel.jsx';

let TaskTimeline = React.createClass({
    filterMenu: {
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
    },
    panelDef: {
        init   : false,
        reactId: 'task-info',
        icon   : 'fa fa-user',
        header : 'My Task Timeline',
        headerMenus: []
    },

    getInitialState: function() {
        if (this.panelDef.init != true) {
            this.panelDef.init = true;
            this.panelDef.headerMenus.push(this.filterMenu);
            MenuStore.setDropdownMenu(this.filterMenu.reactId, this.filterMenu);
            PanelStore.setPanel(this.panelDef.reactId, this.panelDef);
        }
        return this.panelDef;
    },

    render: function() {
        return (
            <Panel reactId={this.panelDef.reactId}>
                <h1>You don't have any pending tasks yet!</h1>
            </Panel>
        )
    }
});

export default TaskTimeline;
