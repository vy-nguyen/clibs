/**
 * Copyright by Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import MenuStore      from 'vntd-shared/stores/DropdownMenuStore.jsx';
import PanelStore     from 'vntd-shared/stores/PanelStore.jsx';
import Panel          from 'vntd-shared/widgets/Panel.jsx';

let Messages = React.createClass({
    filterMenu: {
        reactId  : 'filter-mesg',
        iconFmt  : 'btn-xs btn-warning',
        titleText: 'Filter',
        itemFmt  : 'pull-right js-status-update',
        menuItems: [ {
            itemFmt : 'fa fa-circle txt-color-green',
            itemText: 'Most recent',
            itemHandler: function() {
            }
        }, {
            itemFmt : 'fa fa-circle txt-color-green',
            itemText: 'With tasks',
            itemHandler: function() {
            }
        } ]
    },
    queryMenu: {
        reactId  : 'query-mesg',
        iconFmt  : 'btn-xs btn-success',
        titleText: 'Search by',
        itemFmt  : 'pull-right js-status-update',
        menuItems: [ {
            itemFmt : 'fa fa-circle txt-color-green',
            itemText: 'User name',
            itemHandler: function() {
            }
        }, {
            itemFmt : 'fa fa-circle txt-color-green',
            itemText: 'Keyword',
            itemHandler: function() {
            }
        } ]
    },
    panelDef: {
        init   : false,
        reactId: 'mesg-info',
        icon   : 'fa fa-user',
        header : 'My Messages',
        headerMenus: []
    },

    getInitialState: function() {
        if (this.panelDef.init != true) {
            this.panelDef.init = true;
            this.panelDef.headerMenus.push(this.filterMenu);
            this.panelDef.headerMenus.push(this.queryMenu);
            MenuStore.setDropdownMenu(this.filterMenu.reactId, this.filterMenu);
            MenuStore.setDropdownMenu(this.queryMenu.reactId, this.queryMenu);
            PanelStore.setPanel(this.panelDef.reactId, this.panelDef);
        }
        return this.panelDef;
    },

    render: function() {
        return (
            <Panel reactId={this.panelDef.reactId}>
                <h1>You don't have any messages yet!</h1>
            </Panel>
        )
    }
});

export default Messages;
