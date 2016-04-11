/**
 * Copyright by Vy Nguyen (2016)
 */
import React          from 'react-mod';
import MenuStore      from 'vntd-shared/stores/DropdownMenuStore.jsx';
import PanelStore     from 'vntd-shared/stores/PanelStore.jsx';
import Panel          from 'vntd-shared/widgets/Panel.jsx';

let Friends = React.createClass({
    filterMenu: {
        reactId  : 'filter-friend',
        iconFmt  : 'btn-xs btn-warning',
        titleText: 'Filter',
        itemFmt  : 'pull-right js-status-update',
        menuItems: [ {
            itemFmt : 'fa fa-circle txt-color-green',
            itemText: 'Most active',
            itemHandler: function() {
            }
        }, {
            itemFmt : 'fa fa-circle txt-color-green',
            itemText: 'Give me most credit',
            itemHandler: function() {
            }
        } ]
    },
    queryMenu: {
        reactId  : 'query-friend',
        iconFmt  : 'btn-xs btn-success',
        titleText: 'Query',
        itemFmt  : 'pull-right js-status-update',
        menuItems: [ {
            itemFmt : 'fa fa-circle txt-color-green',
            itemText: 'abc...',
            itemHandler: function() {
            }
        }, {
            itemFmt : 'fa fa-circle txt-color-green',
            itemText: 'def...',
            itemHandler: function() {
            }
        } ]
    },
    panelDef: {
        init   : false,
        reactId: 'friend-info',
        icon   : 'fa fa-user',
        header : 'My connections',
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
                <h1>You don't have any friends yet!</h1>
            </Panel>
        )
    }
});

export default Friends;
