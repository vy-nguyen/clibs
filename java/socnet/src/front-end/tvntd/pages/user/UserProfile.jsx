/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import Reflux             from 'reflux';
import DropzoneComponent  from 'react-dropzone-component';

import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import ProfileCover       from 'vntd-root/components/ProfileCover.jsx';

let UserProfile = React.createClass({
    getInitialState: function() {
        return {
            files: []
        }
    },

    mixins: [Reflux.connect(UserStore)],

    onDrop: function(files) {
        console.log("On drop");
        console.log(files);
        this.setState({
            files: files
        });
    },

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

        return (
            <div>
                <h2>User Profile</h2>
                <DropzoneComponent
                    config={componentConfig}
                    eventHandlers={eventHandlers}
                    djsConfig={djsConfig}/>
            </div>
        )
    }
});

export default UserProfile;
