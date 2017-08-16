/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React             from 'react-mod';
import DropzoneComponent from 'react-dropzone-component';

import UserBase          from 'vntd-shared/layout/UserBase.jsx';
import GenericForm       from 'vntd-shared/forms/commons/GenericForm.jsx';
import SubHeader         from 'vntd-root/pages/layout/SubHeader.jsx';
import Actions           from 'vntd-root/actions/Actions.jsx';
import Mesg              from 'vntd-root/components/Mesg.jsx';

class UserAvatar extends UserBase
{
    constructor(props) {
        super(props);

        this.dropzone = null;
        this._onSending = this._onSending.bind(this);
        this._onSuccess = this._onSuccess.bind(this);
        this._onError = this._onError.bind(this);
    }

    _onSending(files, xhr, form) {
        form.append('name', files.name);
    }

    _onSuccess(files) {
        Actions.uploadAvataDone(JSON.parse(files.xhr.response));
    }

    _onError(file) {
    }

    render() {
        const djsConfig = GenericForm.getDjsConfig(),
        componentConfig = {
            iconFiletypes   : ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl         : '/user/upload-avatar'
        },
        eventHandlers = {
            sending: this._onSending,
            success: this._onSuccess,
            error  : this._onError,
            init   : function(dz) {
                this.dropzone = dz
            }.bind(this)
        };
        let file_drop, self = this.state.self;

        if (self == null) {
            return null;
        }
        if (this.props.data.doFileDrop == true) {
            file_drop = (
                <DropzoneComponent
                    className="col-xs-3 col-sm-3 col-md-2 col-lg-2 profile-pic"
                    config={componentConfig}
                    eventHandlers={eventHandlers} djsConfig={djsConfig}>
                    <img src={self.userImgUrl}/>
                </DropzoneComponent>
            );
        } else {
            file_drop = (
                <div className="col-xs-3 col-sm-3 col-md-2 col-lg-2 profile-pic">
                    <img src={self.userImgUrl}/>
                </div>
            );
        }
        return (
            <div className="row">
                {file_drop}
                <div className="col-xs-9 col-sm-9 col-md-3 col-lg-3">
                    <h1 className="profile-username">
                        {self.lastName} {self.firstName}
                    </h1>
                    <div className="padding-10">
                        {this._renderKV(self.connections, "Connections", true)}
                        {this._renderKV(self.followers, "Followers", true)}
                    </div>
                </div>
                <div className="col-md-7 col-lg-7 hidden-mobile hidden-sm hidden-xs">
                    <div className="row">
                        <SubHeader/>
                    </div>
                    <div className="row">
                        <h1><small><Mesg text="Connections"/></small></h1>
                        <ul className="list-inline friends-list">
                            <li>
                                <img src="/rs/img/avatars/2.png" alt="friend-2"/>
                            </li>
                            <li><a href-void>420 <Mesg text="more"/></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserAvatar;
