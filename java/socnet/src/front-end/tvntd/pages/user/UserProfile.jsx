/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import Reflux             from 'reflux';
import DropzoneComponent  from 'react-dropzone-component';
import {Dropdown, MenuItem} from 'react-bootstrap';

import MenuStore          from 'vntd-shared/stores/DropdownMenuStore.jsx';
import PanelStore         from 'vntd-shared/stores/PanelStore.jsx';
import TabPanelStore      from 'vntd-shared/stores/TabPanelStore.jsx';
import TabPanel           from 'vntd-shared/layout/TabPanel.jsx';
import DropdownMenu       from 'vntd-shared/layout/DropdownMenu.jsx';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import JarvisWidget       from 'vntd-shared/widgets/JarvisWidget.jsx';
import Panel              from 'vntd-shared/widgets/Panel.jsx';
import WidgetGrid         from 'vntd-shared/widgets/WidgetGrid.jsx';
import Friends            from './Friends.jsx';

let UserInfo = React.createClass({
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
        return this.panelData;
    },

    render: function() {
        return (
            <Panel reactId={this.panelData.reactId}>
                <form className="form-horizontal">
                    <fieldset>
                        <legend>Default Form Elements</legend>
                        <h1>About me</h1>
                    </fieldset>
                </form>
            </Panel>
        );
    }
});

let UserProfile = React.createClass({
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

    mixins: [Reflux.connect(UserStore)],

    onSending: function(files, xhr, form) {
        form.append('name', files.name);
    },

    render: function() {
        let status = null;

        if (this.state.files) {
            let files = this.state.files;
            let preview = files.map(function(f) {
                console.log(f.preview);
                return <img src={f.preview}/>
            });
            status = (
                <div>
                    <h2>Uploading {files.length} files...</h2>
                    <div>{preview}</div>
                </div>
            );
        }
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
            // All of these receive the event as first parameter:
            drop: null,
            dragstart: null,
            dragend: null,
            dragenter: null,
            dragover: null,
            dragleave: null,
            // All of these receive the file as first parameter:
            addedfile: null,
            removedfile: null,
            thumbnail: null,
            error: null,
            processing: null,
            uploadprogress: null,
            sending: this.onSending,
            success: null,
            complete: null,
            canceled: null,
            maxfilesreached: null,
            maxfilesexceeded: null,

            processingmultiple: null,
            sendingmultiple: null,
            successmultiple: null,
            completemultiple: null,
            canceledmultiple: null,
            // Special Events
            totaluploadprogress: null,
            reset: null,
            queuecompleted: null
        };

        let imageId = "example"; // this.props.data.imageId;
        let imgList = [
            "/rs/img/demo/s1.jpg",
            "/rs/img/demo/s2.jpg",
            "/rs/img/demo/s3.jpg"
        ];

        let cover_hdr = imgList.map(function(item, index) {
            if (index == 0) {
                return <li data-target={'#' + imageId} data-slide-to={index.toString()} className='active'></li>;
            } else {
                return <li data-target={'#' + imageId} data-slide-to={index.toString()} class></li>;
            }
        });
        let cover_img = imgList.map(function(item, index) {
            return (
                <div className={index == 0 ? "item active" : "item"}>
                    <img src={item} alt="Cover Image"/>
                </div>
            );
        });
        let self = this.state.userSelf;
        if (self == undefined || self == null) {
            return null;
        }

        return (
<div className="content">
    <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12">
            <div id={imageId} className="carousel fade profile-carousel">
                <div className="air air-top-right padding-10">
                    <DropzoneComponent
                        config={componentConfig}
                        eventHandlers={eventHandlers}
                        djsConfig={djsConfig}/>
                </div>
                <ol className="carousel-indicators">
                    {cover_hdr}
                </ol>
                <div className="carousel-inner">
                    {cover_img}
                </div>
            </div>
        </div>
    </div>
    <div className="row">
        <DropzoneComponent
            className="col-sm-3 col-md-2 col-lg-1 profile-pic"
            config={componentConfig}
            eventHandlers={eventHandlers}
            djsConfig={djsConfig}>
            <img src="/rs/img/avatars/1.png"/>
        </DropzoneComponent>
        <div className="col-sm-9 col-md-10 col-lg-11">
            <div className="box-header">
                <h1 className="profile-username">
                    {self.lastName} <span className="semi-bold">{self.firstName}</span>
                    <br/>
                    <small>Member since 1/2</small>
                </h1>
            </div>
        </div>
    </div>
    <div className="row">
        <TabPanel tabId={this.profileTab.reactId}/>
    </div>
</div>
        )
    }
});

export default UserProfile;
