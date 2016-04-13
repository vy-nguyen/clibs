/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React             from 'react-mod';
import Reflux            from 'reflux';
import DropzoneComponent from 'react-dropzone-component';

import SubHeader         from '../layout/SubHeader.jsx';
import UserStore         from 'vntd-shared/stores/UserStore.jsx';

let UserAvatar = React.createClass({
    mixins: [Reflux.connect(UserStore)],

    getInitialState: function() {
        return UserStore.getData();
    },

    onSending: function(files, xhr, form) {
        form.append('name', files.name);
    },

    render: function() {
        let djsConfig = {
            addRemoveLinks: true,
            acceptedFiles: "image/jpeg,image/png,image/gif",
            params: {},
            headers: {}
        };
        let token  = $("meta[name='_csrf']").attr("content");
        let header = $("meta[name='_csrf_header']").attr("content");
        djsConfig.headers[header] = token;

        let componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: '/api/upload-img'
        };
        let eventHandlers = {
            sending: this.onSending,
        };
        let self = this.state.userSelf;

        if (self == undefined || self == null) {
            return null;
        }
        return (
            <div className="row">
                <DropzoneComponent className="col-sm-3 col-md-1 col-lg-1 profile-pic"
                    config={componentConfig} eventHandlers={eventHandlers} djsConfig={djsConfig}>
                    <img src="/rs/img/avatars/1.png"/>
                </DropzoneComponent>

                <div className="col-sm-3 col-md-3 col-lg-3">
                    <div className="box-header">
                        <h1 className="profile-username">
                            {self.lastName} <span className="semi-bold">{self.firstName}</span>
                        </h1>
                        <br/>
                        <small>Member since 1/2</small>
                    </div>
                </div>
                <div className="col-sm-6 col-md-8 col-lg-8">
                    <SubHeader/>
                </div>
            </div>
        );
    }
});

export default UserAvatar;

