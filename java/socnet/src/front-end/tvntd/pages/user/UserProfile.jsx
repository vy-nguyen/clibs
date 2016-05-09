/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import Reflux             from 'reflux';

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

    render: function() {
        let self = UserStore.getSelf();
        if (self === undefined || self === null) {
            console.log(this.state);
            return null;
        }
        let profileMenu = {
            iconFmt  : 'btn-xs btn-success',
            titleText: 'Miann',
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: 'Online',
                itemHandler: function() {
                    console.log("Online is clicked");
                }.bind(this)
            }, {
                itemFmt : 'fa fa-circle txt-color-yellow',
                itemText: 'Go to sleep',
                itemHandler: function() {
                    console.log("Offline is clicked");
                }.bind(this)
            }, {
                itemFmt : 'fa fa-circle txt-color-red',
                itemText: 'Offline',
                itemHandler: function() {
                    console.log("Offline is clicked");
                }.bind(this)
            } ]
        };
        let panelData = {
            icon   : 'fa fa-book',
            header : 'My Basic Information',
            headerMenus: [profileMenu]
        };

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
                }.bind(this)
            }, {
                btnFmt : "btn btn-primary",
                btnText: "Save",
                onClick: function(e, w) {
                    console.log("Save click: ");
                    console.log(e);
                    console.log(w);
                    e.preventDefault();
                }.bind(this)
            } ]
        };
        return (
            <Panel context={panelData} className="well no-padding">
                <GenericForm form={profile_form}/>
            </Panel>
        );
    }
});

let UserProfile = React.createClass({

    profileTab: {
        reactId : 'user-profile',
        tabItems: [ {
            domId  : 'profile-tab',
            tabText: 'About Me',
            tabIdx : 0
        }, {
            domId  : 'connection-tab',
            tabText: 'Connections',
            tabIdx : 1
        }, {
            domId  : 'message',
            tabText: 'Secure Messages',
            tabIdx : 2
        }, {
            domId  : 'pending-task',
            tabText: 'Pending Tasks',
            tabIdx : 3
        } ]
    },

    render: function() {
        let self = UserStore.getSelf();
        if (self === undefined || self === null) {
            return <h1>Something's wrong, try logout and login again</h1>;
        }
        return (
            <div className="content">
                <ProfileCover/>
                <UserAvatar data={{doFileDrop: true}}/>
                <div className="row">
                    <TabPanel context={this.profileTab}>
                        <UserInfo/>
                        <Friends/>
                        <Messages/>
                        <TaskTimeline/>
                    </TabPanel>
                </div>
            </div>
        )
    }
});

export default UserProfile;
