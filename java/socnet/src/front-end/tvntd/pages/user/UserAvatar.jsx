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
        let file_drop = "";
        if (this.props.data.doFileDrop == true) {
            file_drop = (
                <DropzoneComponent className="col-sm-3 col-md-3 col-lg-2 profile-pic"
                    config={componentConfig} eventHandlers={eventHandlers} djsConfig={djsConfig}>
                    <img src="/rs/img/avatars/1.png"/>
                </DropzoneComponent>
            );
        } else {
            file_drop = (
                <div className="col-sm-3 col-md-3 col-lg-2 profile-pic">
                    <img src={self.userImgUrl}/>
                </div>
            );
        }
        return (
            <div className="row">
                {file_drop}
                <div className="col-sm-2 col-md-2 col-lg-2">
                    <h1 className="profile-username">
                        {self.lastName} <span className="semi-bold">{self.firstName}</span>
                    </h1>
                    <div className="padding-10">
                        <h4 className="font-md"><strong>{self.connections}</strong>
                            <br/><small>Connections</small>
                        </h4>
                        <br/>
                        <h4 className="font-md"><strong>{self.followers}</strong>
                            <br/><small>Followers</small>
                        </h4>
                    </div>
                </div>
                <div className="col-sm-7 col-md-7 col-lg-8">
                    <div className="row">
                        <SubHeader/>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <h1><small>Connections</small></h1>
                            <ul className="list-inline friends-list">
                                <li><img src="/rs/img/avatars/2.png" alt="friend-2"/></li>
                                <li><img src="/rs/img/avatars/3.png" alt="friend-3"/></li>
                                <li><img src="/rs/img/avatars/4.png" alt="friend-4"/></li>
                                <li><img src="/rs/img/avatars/5.png" alt="friend-5"/></li>
                                <li><img src="/rs/img/avatars/male.png" alt="friend-6"/></li>
                                <li><a href-void>420 more</a></li>
                            </ul>
                        </div>
                        <div className="col-sm-6">
                            <h1><small>Recent Visitors</small></h1>
                            <ul className="list-inline friends-list">
                                <li><img src="/rs/img/avatars/male.png" alt="friend-7"/></li>
                                <li><img src="/rs/img/avatars/female.png" alt="friend-8"/></li>
                                <li><img src="/rs/img/avatars/female.png" alt="friend-9"/></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default UserAvatar;

