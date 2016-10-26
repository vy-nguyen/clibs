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

class UserInfo extends React.Component
{
    constructor(props) {
        super(props);
        this._updateState   = this._updateState.bind(this);
        this._onLineStatus  = this._onLineStatus.bind(this);
        this._offLineStatus = this._offLineStatus.bind(this);
        this._saveProfile   = this._saveProfile.bind(this);
        this._cancelSave    = this._cancelSave.bind(this);

        this.state = {
            self: UserStore.getSelf()
        };
        this._profileMenu = {
            iconFmt  : 'btn-xs btn-success',
            titleText: 'Status',
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: 'Online',
                itemHandler: this._onLineStatus
            }, {
                itemFmt : 'fa fa-circle txt-color-red',
                itemText: 'Offline',
                itemHandler: this._offLineStatus
            } ]
        };
        this._panelData = {
            icon   : 'fa fa-book',
            header : 'My Basic Information',
            headerMenus: [this._profileMenu]
        };
        this._profileForm = {
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
                btnFmt : "btn btn-lg btn-default",
                btnText: "Cancel",
                onClick: this._cancelSave
            }, {
                btnFmt : "btn btn-lg btn-primary",
                btnText: "Save",
                onClick: this._saveProfile
            } ]
        };

    }

    componentDidMount() {
        this.unsub = UserStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(data) {
        this.setState({
            self: UserStore.getSelf()
        });
    }

    _onLineStatus() {
        console.log("onLine status");
        console.log(this);
    }

    _offLineStatus() {
        console.log("offline status");
        console.log(this);
    }

    _saveProfile(a, b) {
        console.log("Save profile");
        console.log(this);
        console.log(a);
        console.log(b);
    }

    _cancelSave(a, b) {
        console.log("Cancel Save");
        console.log(this);
        console.log(a);
        console.log(b);
    }

    render() {
        let self = this.state.self;
        if (self == null) {
            return null;
        }
        return (
            <Panel context={this._panelData} className="well no-padding">
                <GenericForm form={this._profileForm}/>
            </Panel>
        );
    }
}

const ProfileTab = {
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
};

class UserProfile extends React.Component
{
    render() {
        let self = UserStore.getSelf();
        if (self === undefined || self === null) {
            return <h1>Something's wrong, try logout and login again</h1>;
        }
        return (
            <div className="content">
                <ProfileCover/>
                <UserAvatar data={{doFileDrop: true}}/>
                <div className="row">
                    <TabPanel context={ProfileTab}>
                        <UserInfo/>
                        <Friends/>
                        <Messages/>
                        <TaskTimeline/>
                    </TabPanel>
                </div>
            </div>
        )
    }
}

export default UserProfile;
