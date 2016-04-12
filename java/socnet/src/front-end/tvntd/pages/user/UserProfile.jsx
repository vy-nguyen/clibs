/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import Reflux             from 'reflux';

import UiValidate         from 'vntd-shared/forms/validation/UiValidate.jsx';
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

    _submitUpdate: function() {
    },

    render: function() {
        let self = this.state.userSelf;
        if (self == undefined || self == null) {
            console.log(this.state);
            return null;
        }
        return (
            <Panel reactId={this.panelData.reactId} className="well no-padding">
                <form className="client-form" onSubmit={this._submitUpdate}>
                    <fieldset>
                        <section className="row">
                            <div className="form-group alert alert-danger" id="id-profile-error" style={{display:"none"}}>
                                <a className="close" data-dismiss="alert" aria-label="close">x</a>
                                <div id="id-profile-error-text"></div>
                            </div>
                        </section>
                    </fieldset>
                    <legend>About me</legend>
                    <fieldset>
                        <div className="row form-group">
                            <label className="col-sm-2 col-md-2 col-lg-2 control-label" for="textinput">First Name</label>
                            <div className="col-sm-10 col-md-10 col-lg-6">
                                <input type="text" className="form-control" name="firstname" ref="firstName" placeholder={self.firstName}/>
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-sm-2 col-md-2 col-lg-2 control-label" for="textinput">Last Name</label>
                            <div className="col-sm-10 col-md-10 col-lg-6">
                                <input type="text" className="form-control" name="lastname" ref="lastName" placeholder={self.lastName}/>
                            </div>
                        </div>
                    </fieldset>
                    
                    <legend>My preferences</legend>
                    <fieldset>
                    </fieldset>

                    <legend>My privacy settings</legend>
                    <fieldset>
                    </fieldset>

                    <fieldset>
                        <div className="row form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <div className="pull-right">
                                    <button type="submit" className="btn btn-default">Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save</button>
                                </div>
                            </div>
                        </div>
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
