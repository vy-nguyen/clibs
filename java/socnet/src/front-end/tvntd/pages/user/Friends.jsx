/**
 * Copyright by Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import Reflux         from 'reflux';
import _              from 'lodash';

import MenuStore      from 'vntd-shared/stores/DropdownMenuStore.jsx';
import PanelStore     from 'vntd-shared/stores/PanelStore.jsx';
import Panel          from 'vntd-shared/widgets/Panel.jsx';
import UserStore      from 'vntd-shared/stores/UserStore.jsx';
import UserList       from 'vntd-root/components/UserList.jsx';

let Friends = React.createClass({
    mixins: [Reflux.connect(UserStore)],

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
        header : 'My Connections',
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
        let self = UserStore.getUserByUuid(this.props.userUuid);
        if (self === null) {
            return (
                <Panel reactId={this.panelDef.reactId}>
                    <h1>You don't have any friends yet!</h1>
                </Panel>
            )
        }
        let connectList = _.isEmpty(self.connectList) ? [] : self.connectList;
        let followList  = _.isEmpty(self.followList) ? [] : self.followList;
        let followerList = _.isEmpty(self.followerList) ? [] : self.followerList;
        return (
            <div id={this.panelDef.reactId}>
                <UserList userList={connectList} noSaveBtn="true" tableTitle="Connections"/>
                <UserList userList={followList}  noSaveBtn="true" tableTitle="Follows"/>
                <UserList userList={followerList}  noSaveBtn="true" tableTitle="People Follow Me"/>
            </div>
        )
    }
});

export default Friends;
