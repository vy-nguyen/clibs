/**
 * Copyright by Vy Nguyen (2016)
 */
'use strict';

import _              from 'lodash';
import React          from 'react-mod';

import UserFriends    from './UserFriends.jsx';
import Panel          from 'vntd-shared/widgets/Panel.jsx';
import UserStore      from 'vntd-shared/stores/UserStore.jsx';

class Friends extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
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
        let owned = UserStore.isUserMe(self.userUuid);
        let connect = _.isEmpty(self.connectList) ? null
            : <UserFriends owned={owned} userList={self.connectList} tableType="connect" tableTitle="Connections"/>;

        let follow  = _.isEmpty(self.followList) ? null
            : <UserFriends owned={owned} userList={self.followList} tableType="follow" tableTitle="Follows"/>;

        let follower = _.isEmpty(self.followerList) ? null
            : <UserFriends owned={owned} userList={self.followerList} tableType="follower" tableTitle="Followers"/>;

        return (
            <div>
                {connect}
                {follow}
                {follower}
            </div>
        )
    }
}

export default Friends;
