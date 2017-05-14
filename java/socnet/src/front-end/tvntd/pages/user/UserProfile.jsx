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
import ErrorStore         from 'vntd-shared/stores/ErrorStore.jsx';
import InputStore         from 'vntd-shared/stores/NestableStore.jsx';
import StateButtonStore   from 'vntd-shared/stores/StateButtonStore.jsx';
import Panel              from 'vntd-shared/widgets/Panel.jsx';
import GenericForm        from 'vntd-shared/forms/commons/GenericForm.jsx';
import Lang               from 'vntd-root/stores/LanguageStore.jsx';
import Mesg               from 'vntd-root/components/Mesg.jsx';
import Actions            from 'vntd-root/actions/Actions.jsx';
import Friends            from './Friends.jsx';
import Messages           from './Messages.jsx';
import TaskTimeline       from './TaskTimeline.jsx';
import ProfileCover       from './ProfileCover.jsx';
import UserAvatar         from './UserAvatar.jsx';
import UserTags           from './UserTags.jsx';

import {noOpRetNull}      from 'vntd-shared/utils/Enum.jsx';

class UserInfo extends React.Component
{
    constructor(props) {
        let self = UserStore.getSelf();

        super(props);
        this._assignState   = this._assignState.bind(this);
        this._updateState   = this._updateState.bind(this);
        this._onLineStatus  = this._onLineStatus.bind(this);
        this._offLineStatus = this._offLineStatus.bind(this);
        this._saveProfile   = this._saveProfile.bind(this);
        this._cancelSave    = this._cancelSave.bind(this);
        this._focusInput    = this._focusInput.bind(this);

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

        this.state      = this._assignState(self);
        this._submitId  = "prof-submit-id";
        this._submitBtn = StateButtonStore.createButton(this._submitId, function() {
            return StateButton.saveButtonFsmFull(
                { text: "Ok",              format: "btn btn-lg btn-primary" },
                { text: "Submit Change",   format: "btn btn-lg btn-danger"  },
                { text: "Changed Profile", format: "btn btn-lg btn-success" },
                { text: "Update Failed",   format: "btn btn-lg btn-danger"  },
                { text: "Submitting...",   format: "btn btn-lg btn-info" }
            );
        });
        this._lastNameId   = "prof-lastName";
        this._firstNameId  = "prof-firstName";
        this._hometownId   = "prof-hometown";
        this._stateId      = "prof-state";
        this._countryId    = "prof-country";
        this._currPasswdId = "prof-curr-passwd";
        this._passwordId0  = "prof-password0";
        this._passwordId1  = "prof-password1";
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

    _focusInput(entry) {
        StateButtonStore.setButtonStateObj(this._submitBtn, "needSave");
    }

    _assignState(self) {
        let firstName, lastName  = self.lastName;

        firstName = lastName != null ? self.firstName : null;
        return {
            self     : self,
            lastName : lastName,
            firstName: firstName,
            homeTown : self.homeTown,
            state    : self.state,
            country  : self.country
        };
    }

    _updateState(data, status) {
        if (status !== "update-profile") {
            return;
        }
        console.log(data);

        this.setState(this._assignState(this.state.self));
        InputStore.clearItemIndex(this._currPasswdId);
        InputStore.clearItemIndex(this._passwordId0);
        InputStore.clearItemIndex(this._passwordId1);
        StateButtonStore.setButtonStateObj(this._submitBtn, "saved");
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
        Actions.updateProfile({
            userUuid : this.state.self.userUuid,
            firstName: data[this._firstNameId],
            lastName : data[this._lastNameId],
            homeTown : data[this._hometownId],
            state    : data[this._stateId],
            country  : data[this._countryId],
            curPasswd: data[this._currPasswdId],
            password0: data[this._passwordId0],
            password1: data[this._passwordId1]
        });
        StateButtonStore.setButtonStateObj(this._submitBtn, "saving");
    }

    _cancelSave(data, btn) {
        History.pushState(null, "/");
    }

    render() {
        let self = this.state.self;
        if (self == null) {
            return null;
        }
        let defFirst = Lang.translate("Your first name"),
            defLast  = Lang.translate("Your last name"),
        profileInp = [ {
            onFocus  : this._focusInput,
            labelTxt : "First Name",
            inpHolder: defFirst,
            inpDefVal: this.state.firstName,
            inpName  : this._firstNameId,
            errorId  : this._firstNameId,
            errorFlag: false
        }, {
            onFocus  : this._focusInput,
            labelTxt : "Last Name",
            inpHolder: defLast,
            inpDefVal: this.state.lastName,
            inpName  : this._lastNameId,
            errorId  : this._lastNameId,
            errorFlag: false
        }, {
            onFocus  : this._focusInput,
            labelTxt : "Home Town",
            inpName  : this._hometownId,
            inpDefVal: this.state.self.homeTown,
            inpHolder: Lang.translate("Home Town")
        }, {
            onFocus  : this._focusInput,
            labelTxt : "State",
            inpName  : this._stateId,
            inpDefVal: this.state.self.state,
            inpHolder: Lang.translate("Home Town")
        }, {
            onFocus  : this._focusInput,
            labelTxt : "Country",
            inpName  : this._countryId,
            inpDefVal: this.state.self.country,
            inpHolder: Lang.translate("Country")
        } ],
        securityInp = [ {
            onFocus  : this._focusInput,
            labelTxt : "New Password",
            inpHolder: Lang.translate("Change your password"),
            inpType  : "password",
            inpName  : this._passwordId0,
            errorId  : this._passwordId0,
            errorFlag: false,
            inpValidate: noOpRetNull
        }, {
            onFocus  : this._focusInput,
            labelTxt : "Verify Password",
            inpHolder: Lang.translate("Verify password changes"),
            inpType  : "password",
            inpName  : this._passwordId1,
            errorId  : this._passwordId1,
            errorFlag: false,
            inpValidate: function(data, entry) {
                if (data[this._passwordId0] !== data[this._passwordId1]) {
                    return "Miss match passwords";
                }
                return null;
            }.bind(this)
        } ];
        if (self.secureAcct === true) {
            securityInp.push({
                onFocus  : this._focusInput,
                labelTxt : "Current Password",
                inpHolder: Lang.translate("Enter your current password"),
                inpType  : "password",
                inpName  : this._currPasswdId,
                errorId  : this._currPasswdId,
                errorFlag: false,
                inpValidate: noOpRetNull
            });
        }
        let profileForm = {
            formFmt    : "client-form",
            hiddenHead : null,
            hiddenTail : null,
            formEntries: [ {
                legend : "About Me",
                entries: profileInp
            }, {
                legend : "Security Preferences",
                entries: securityInp
            } ],
            buttons: [ {
                btnFmt  : "btn btn-lg btn-info",
                btnText : "Cancel",
                callOnly: true,
                onClick :  this._cancelSave
            }, {
                btnFmt : "btn btn-lg btn-primary",
                stateId: this._submitId,
                onClick: this._saveProfile
            } ]
        };
        return (
            <Panel context={this._panelData} className="well no-padding">
                <GenericForm form={profileForm}/>
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
