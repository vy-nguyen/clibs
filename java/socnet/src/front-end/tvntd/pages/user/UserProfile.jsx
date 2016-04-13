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
import GenericForm        from 'vntd-shared/forms/commons/GenericForm.jsx';
import Friends            from './Friends.jsx';
import Messages           from './Messages.jsx';
import TaskTimeline       from './TaskTimeline.jsx';
import ProfileCover       from './ProfileCover.jsx';
import UserAvatar         from './UserAvatar.jsx';

let UserInfo = React.createClass({
    mixins: [Reflux.connect(UserStore)],

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
        return UserStore.getData();
    },

    render: function() {
        let self = this.state.userSelf;
        if (self == undefined || self == null) {
            console.log(this.state);
            return null;
        }
        let profile_form = {
            formFmt: "client-form",
            hiddenHead: null,
            hiddenTail: null,
            formEntries: [ {
                legend: "About me",
                entries: [ {
                    labelFmt: "col-sm-2 col-md-2 col-lg-2 control-label",
                    labelTxt: "First Name",
                    inputFmt: "col-sm-10 col-md-10 col-lg-8 control-label",
                    inpName : "firstName",
                    inpHolder: self.firstName
                }, {
                    labelFmt: "col-sm-2 col-md-2 col-lg-2 control-label",
                    labelTxt: "Last Name",
                    inputFmt: "col-sm-10 col-md-10 col-lg-8 control-label",
                    inpName : "lastName",
                    inpHolder: self.lastName
                }, {
                    labelFmt: "col-sm-2 col-md-2 col-lg-2 control-label",
                    labelTxt: "Home Town",
                    inputFmt: "col-sm-10 col-md-10 col-lg-8 control-label",
                    inpName : "homeTown",
                    inpHolder: "Home Town"
                }, {
                    labelFmt: "col-sm-2 col-md-2 col-lg-2 control-label",
                    labelTxt: "Country",
                    inputFmt: "col-sm-10 col-md-10 col-lg-8 control-label",
                    inpName : "lastName",
                    inpHolder: "Country"
                } ]
            }, {
                legend: "My interests",
                entries: [ {
                    labelFmt: "col-sm-2 col-md-2 col-lg-2 control-label",
                    labelTxt: "Favorite tags",
                    inputFmt: "col-sm-10 col-md-10 col-lg-8 control-label",
                    inpName : "favTags",
                    inpHolder: "Your interest tags"
                } ]
            }, {
                legend: "My security preferences",
                entries: [ {
                    labelFmt: "col-sm-2 col-md-2 col-lg-2 control-label",
                    labelTxt: "Something here",
                    inputFmt: "col-sm-10 col-md-10 col-lg-8 control-label",
                    inpName : "favTags",
                    inpHolder: "Something in here"
                } ]
            }, {
                legend: "My work",
                entries: [ {
                    labelFmt: "col-sm-2 col-md-2 col-lg-2 control-label",
                    labelTxt: "Something here",
                    inputFmt: "col-sm-10 col-md-10 col-lg-8 control-label",
                    inpName : "favTags",
                    inpHolder: "Something in here"
                } ]
            } ],
            buttons: [ {
                btnFmt : "btn btn-default",
                btnText: "Cancel",
                onClick: function(e, w) {
                    console.log("Cancel click: ");
                    console.log(e);
                    console.log(w);
                    e.preventDefault();
                }
            }, {
                btnFmt : "btn btn-primary",
                btnText: "Save",
                onClick: function(e, w) {
                    console.log("Save click: ");
                    console.log(e);
                    console.log(w);
                    e.preventDefault();
                }
            } ]
        };
        return (
            <Panel reactId={this.panelData.reactId} className="well no-padding">
                <GenericForm form={profile_form}/>
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
        }, {
            domId  : 'message',
            tabText: 'Secure Messages',
            panelContent: <Messages/>
        }, {
            domId  : 'pending-task',
            tabText: 'Pending Tasks',
            panelContent: <TaskTimeline/>
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
