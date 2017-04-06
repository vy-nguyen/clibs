/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';

import TabPanel           from 'vntd-shared/layout/TabPanel.jsx';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import Panel              from 'vntd-shared/widgets/Panel.jsx';
import GenericForm        from 'vntd-shared/forms/commons/GenericForm.jsx';
import Lang               from 'vntd-root/stores/LanguageStore.jsx';
import Friends            from './Friends.jsx';
import Messages           from './Messages.jsx';
import TaskTimeline       from './TaskTimeline.jsx';
import ProfileCover       from './ProfileCover.jsx';
import UserAvatar         from './UserAvatar.jsx';
import UserTags           from './UserTags.jsx';

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
            titleText: Lang.translate('Status'),
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: Lang.translate('Online'),
                itemHandler: this._onLineStatus
            }, {
                itemFmt : 'fa fa-circle txt-color-red',
                itemText: Lang.translate('Offline'),
                itemHandler: this._offLineStatus
            } ]
        };
        this._panelData = {
            icon   : 'fa fa-book',
            header : Lang.translate('My Basic Information'),
            headerMenus: [this._profileMenu]
        };
        this._profileForm = {
            formFmt: "client-form",
            hiddenHead: null,
            hiddenTail: null,
            formEntries: [ {
                legend: Lang.translate("About Me"),
                entries: [ {
                    labelTxt: Lang.translate("First Name"),
                    inpName : "firstName",
                    inpHolder: self.firstName
                }, {
                    labelTxt: Lang.translate("Last Name"),
                    inpName : "lastName",
                    inpHolder: self.lastName
                }, {
                    labelTxt: Lang.translate("Home Town"),
                    inpName : "homeTown",
                    inpHolder: Lang.translate("Home Town")
                }, {
                    labelTxt: Lang.translate("Country"),
                    inpName : "country",
                    inpHolder: Lang.translate("Country")
                } ]
            }, {
                legend: Lang.translate("My interests"),
                entries: [ {
                    labelTxt: Lang.translate("Favorite tags"),
                    inpName : "favTags",
                    inpHolder: Lang.translate("Your interest tags")
                } ]
            }, {
                legend: Lang.translate("My security preferences"),
                entries: [ {
                    labelTxt: "Something here",
                    inpName : "favTags",
                    inpHolder: "Something in here"
                } ]
            }, {
                legend: Lang.translate("My work"),
                entries: [ {
                    labelTxt: "Something here",
                    inpName : "favTags",
                    inpHolder: "Something in here"
                } ]
            } ],
            buttons: [ {
                btnFmt : "btn btn-lg btn-default",
                btnText: Lang.translate("Cancel"),
                onClick: this._cancelSave
            }, {
                btnFmt : "btn btn-lg btn-primary",
                btnText: Lang.translate("Save"),
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
    }

    _offLineStatus() {
        console.log("offline status");
    }

    _saveProfile(a, b) {
        console.log("Save profile");
    }

    _cancelSave(a, b) {
        console.log("Cancel Save");
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
        domId  : 'user-tags',
        tabText: 'Post Categories',
        tabIdx : 2
    }, {
        domId  : 'message',
        tabText: 'Secure Messages',
        tabIdx : 3
    }, {
        domId  : 'pending-task',
        tabText: 'Pending Tasks',
        tabIdx : 4
    } ]
};

class UserProfile extends React.Component
{
    render() {
        let self = UserStore.getSelf();
        if (self == null) {
            return null;
        }
        console.log(self);
        return (
            <div className="content">
                <ProfileCover/>
                <UserAvatar data={{doFileDrop: true}}/>
                <div className="row">
                    <TabPanel context={ProfileTab}>
                        <UserInfo/>
                        <Friends/>
                        <UserTags userUuid={self.userUuid}/>
                        <Messages/>
                        <TaskTimeline/>
                    </TabPanel>
                </div>
            </div>
        )
    }
}

export default UserProfile;
