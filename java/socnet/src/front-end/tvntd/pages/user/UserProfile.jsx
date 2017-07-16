/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import _                  from 'lodash';

import History            from 'vntd-shared/utils/History.jsx';
import StateButton        from 'vntd-shared/utils/StateButton.jsx';
import TabPanel           from 'vntd-shared/layout/TabPanel.jsx';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import Panel              from 'vntd-shared/widgets/Panel.jsx';
import Actions            from 'vntd-root/actions/Actions.jsx';
import Friends            from './Friends.jsx';
import Messages           from './Messages.jsx';
import TaskTimeline       from './TaskTimeline.jsx';
import ProfileCover       from './ProfileCover.jsx';
import UserAvatar         from './UserAvatar.jsx';
import UserTags           from './UserTags.jsx';

import { FormData, ProcessForm } from 'vntd-shared/forms/commons/ProcessForm.jsx';

class ProfileForm extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        this.initData();
        return this;
    }

    initData() {
        let self = UserStore.getSelf(), first, last,
        profileInfo = [ {
            labelTxt : 'First Name',
            inpHolder: 'Your first name',
            inpName  : 'prof-first',
            field    : 'firstName'
        }, {
            labelTxt : 'Last Name',
            inpHolder: 'Your last name',
            inpName  : 'prof-last',
            field    : 'lastName'
        }, {
            emptyOk  : true,
            labelTxt : 'Your Domain',
            inpHolder: 'Domain for your own page',
            inpName  : 'prof-domain',
            field    : 'domain'
        }, {
            emptyOk  : true,
            labelTxt : 'Birth Year',
            inpHolder: 'Your year of birth',
            inpName  : 'prof-year',
            field    : 'birthYear',
        }, {
            labelTxt : 'Home Town',
            inpHolder: 'Your home town',
            inpName  : 'prof-city',
            field    : 'homeTown'
        }, {
            labelTxt : 'State',
            inpHolder: 'Your state',
            inpName  : 'prof-state',
            field    : 'state'
        }, {
            labelTxt : 'Country',
            inpHolder: 'Country',
            inpName  : 'prof-country',
            field    : 'country'
        } ],
        securityInfo = [ {
            emptyOk  : true,
            labelTxt : 'New Password',
            inpHolder: 'Change your password',
            inpType  : 'password',
            inpName  : 'prof-passw0',
            field    : 'password0'
        }, {
            emptyOk  : true,
            labelTxt : 'Verify Password',
            inpHolder: 'Verify password changes',
            inpType  : 'password',
            inpName  : 'prof-passw1',
            field    : 'password1'
        } ];

        if (self.secureAcct === true) {
            securityInfo.push({
                emptyOk  : true,
                labelTxt : 'Current Password',
                inpHolder: 'Enter your current password',
                inpType  : 'password',
                inpName  : 'prof-password',
                field    : 'password'
            });
        }
        this.forms = {
            formId     : 'prof-form',
            formFmt    : "client-form",
            submitFn   : Actions.updateProfile,
            formEntries: [ {
                legend : "About Me",
                twoCols: true,
                entries: profileInfo
            }, {
                legend : "Security Preferences",
                entries: securityInfo
            } ],
            buttons: [ {
                btnName  : 'prof-cancel',
                btnFmt   : 'btn btn-lg btn-info',
                btnCreate: function() {
                    return StateButton.basicButton("Cancel");
                }
            }, {
                btnName  : 'prof-submit',
                btnFmt   : 'btn btn-lg btn-primary',
                btnSubmit: true,
                btnCreate: function() {
                    return StateButton.saveButtonFsm("Change", "Submit", "Ok");
                }
            } ]
        };
        last  = self.lastName;
        first = last != null ? self.firstName : null;

        this.self = self;
        this.defValue = {
            lastName : last,
            firstName: first,
            homeTown : self.homeTown,
            state    : self.state,
            country  : self.country,
            birthYear: self.birthYear,
            domain   : self.domain
        };
    }

    submitNotif(store, result, status, resp) {
        console.log("Submit notif");
        console.log(result);
        console.log(status);
        console.log(resp);
        super.submitNotif(store, result, status);
    }

    validateInput(data, errFlags) {
        if (data.password != null && data.password != "") {
            if (_.isEmpty(data.password0) || data.password0 !== data.password1) {
                errFlags.password0 = true;
                errFlags.password1 = true;
                errFlags.errText   = "Password doesn't match";
                errFlags.helpText  = "You need to enter matching passwords";
                return null;
            }
        } else {
            if (data.password0 != "" || data.password1 != "") {
                errFlags.password  = true;
                errFlags.password0 = true;
                errFlags.password1 = true;
                errFlags.errText   = "Missing current password";
                errFlags.helpText  = "Enter your current password to change";
                return null;
            }
        }
        return {
            userUuid : this.self.userUuid,
            firstName: data.firstName,
            lastName : data.lastName,
            homeTown : data.homeTown,
            state    : data.state,
            country  : data.country,
            birthYear: data.birthYear,
            domain   : data.domain,
            curPasswd: data.password,
            password0: data.password0,
            password1: data.password1
        };
    }

    onClick(btn, btnState) {
        console.log("on click button");
        console.log(btn);
        console.log(btnState);
        super.submitNotif(null, null, null);
        History.pushState(null, "/");
    }
}

class UserInfo extends React.Component
{
    constructor(props) {
        super(props);
        this._onLineStatus  = this._onLineStatus.bind(this);
        this._offLineStatus = this._offLineStatus.bind(this);
        this._saveProfile   = this._saveProfile.bind(this);
        this._cancelSave    = this._cancelSave.bind(this);

        this._profileMenu = {
            iconFmt  : 'btn-xs btn-success',
            titleText: 'Status',
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt    : 'fa fa-circle txt-color-green',
                itemText   : 'Online',
                itemHandler: this._onLineStatus
            }, {
                itemFmt    : 'fa fa-circle txt-color-red',
                itemText   : 'Offline',
                itemHandler: this._offLineStatus
            } ]
        };
        this._panelData = {
            icon       : 'fa fa-book',
            header     : 'My Basic Information',
            headerMenus: [this._profileMenu]
        };
        this.profileForm = new ProfileForm(props);
    }

    _onLineStatus() {
        console.log("onLine status");
    }

    _offLineStatus() {
        console.log("offline status");
    }

    _saveProfile(data, btn, hasError) {
        if (hasError === true) {
            return;
        }
    }

    _cancelSave(data, btn) {
        History.pushState(null, "/");
    }

    render() {
        return (
            <Panel context={this._panelData} className="well no-padding">
                <ProcessForm form={this.profileForm} store={UserStore}/>
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
