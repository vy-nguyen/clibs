/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import Reflux             from 'reflux';

import MenuStore          from 'vntd-shared/stores/DropdownMenuStore.jsx';
import PanelStore         from 'vntd-shared/stores/PanelStore.jsx';
import TabPanelStore      from 'vntd-shared/stores/TabPanelStore.jsx';
import TabPanel           from 'vntd-shared/layout/TabPanel.jsx';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import Panel              from 'vntd-shared/widgets/Panel.jsx';
import Friends            from './Friends.jsx';
import ProfileCover       from './ProfileCover.jsx';
import UserAvatar         from './UserAvatar.jsx';

let UserInfo = React.createClass({
    profileMenu: {
        reactId  : 'profile',
        iconFmt  : 'btn-xs btn-success',
        titleText: 'Miann',
        itemFmt  : 'pull-right js-status-update',
        menuItems: [ {
            itemFmt : 'fa fa-circle txt-color-green',
            itemText: 'Online',
            itemHandler: function() {
                console.log("Online is clicked");
            }
        }, {
            itemFmt : 'fa fa-circle txt-color-yellow',
            itemText: 'Go to sleep',
            itemHandler: function() {
                console.log("Offline is clicked");
            }
        }, {
            itemFmt : 'fa fa-circle txt-color-red',
            itemText: 'Offline',
            itemHandler: function() {
                console.log("Offline is clicked");
            }
        } ]
    },
    panelData: {
        init   : false,
        reactId: 'basic-info',
        icon   : 'fa fa-book',
        header : 'My Basic Information',
        headerMenus: [ ]
    },

    getInitialState: function() {
        if (this.panelData.init != true) {
            this.panelData.init = true;
            this.panelData.headerMenus.push(this.profileMenu);
            MenuStore.setDropdownMenu(this.profileMenu.reactId, this.profileMenu);
            PanelStore.setPanel(this.panelData.reactId, this.panelData);
        }
        return this.panelData;
    },

    render: function() {
        return (
            <Panel reactId={this.panelData.reactId}>
                <form className="form-horizontal">
                    <fieldset>
                        <legend>Default Form Elements</legend>
                        <h1>About me</h1>
                    </fieldset>
                </form>
            </Panel>
        );
    }
});

let UserProfile = React.createClass({
    mixins: [Reflux.connect(UserStore)],

    profileTab: {
        init    : false,
        reactId : 'user-profile',
        tabItems: [ {
            domId  : 'profile-tab',
            tabText: 'About Me',
            panelContent: <UserInfo/>
        }, {
            domId  : 'connection-tab',
            tabText: 'Connections',
            panelContent: <Friends/>
        } ]
    },

    getInitialState: function() {
        if (this.profileTab.init != true) {
            this.profileTab.init = true;
            TabPanelStore.setTabPanel(this.profileTab.reactId, this.profileTab);
        }
        return UserStore.getData();
    },

    render: function() {
        let self = this.state.userSelf;
        if (self == undefined || self == null) {
            return null;
        }

        return (
            <div className="content">
                <ProfileCover/>
                <UserAvatar/>
                <div className="row">
                    <TabPanel tabId={this.profileTab.reactId}/>
                </div>
            </div>
        )
    }
});

export default UserProfile;
