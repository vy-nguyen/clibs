/**
 * Copyright by Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import _              from 'lodash';

import Panel          from 'vntd-shared/widgets/Panel.jsx';
import UserStore      from 'vntd-shared/stores/UserStore.jsx';
import UserList       from 'vntd-root/components/UserList.jsx';

let Friends = React.createClass({

    render: function() {
        let filterMenu = {
            iconFmt  : 'btn-xs btn-warning',
            titleText: 'Filter',
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: 'Most active',
                itemHandler: function() {
                }.bind(this)
            }, {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: 'Give me most credit',
                itemHandler: function() {
                }.bind(this)
            } ]
        };
        let queryMenu = {
            iconFmt  : 'btn-xs btn-success',
            titleText: 'Query',
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: 'abc...',
                itemHandler: function() {
                }.bind(this)
            }, {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: 'def...',
                itemHandler: function() {
                }.bind(this)
            } ]
        };
        let panelDef = {
            init   : false,
            icon   : 'fa fa-user',
            header : 'My Connections',
            headerMenus: [filterMenu, queryMenu]
        };
        let self = UserStore.getUserByUuid(this.props.userUuid);
        if (self === null) {
            return (
                <Panel context={panelDef}>
                    <h1>You don't have any friends yet!</h1>
                </Panel>
            )
        }

        let connectList = _.isEmpty(self.connectList) ? [] : self.connectList;
        let followList  = _.isEmpty(self.followList) ? [] : self.followList;
        let followerList = _.isEmpty(self.followerList) ? [] : self.followerList;
        return (
            <Panel context={panelDef}>
                <UserList userList={connectList} noSaveBtn="true" tableTitle="Connections"/>
                <UserList userList={followList}  noSaveBtn="true" tableTitle="Follows"/>
                <UserList userList={followerList}  noSaveBtn="true" tableTitle="People Follow Me"/>
            </Panel>
        )
    }
});

export default Friends;
