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

var callback = function(files) {
    console.log("Callback is called");
    console.log(files);
};

let UserProfile = React.createClass({
    getInitialState: function() {
        return {
            files: []
        }
    },

    mixins: [Reflux.connect(UserStore)],

    onDrop: function(files) {
        console.log(files);
        this.setState({
            files: files
        });
    },

    componentConfig: {
        iconFiletypes: ['.jpg', '.png', '.gif'],
        showFiletypeIcon: true,
        postUrl: '/uploadHandler'
    },

    djsConfig: {
        addRemoveLinks: true,
        acceptedFiles: "image/jpeg,image/png,image/gif"
    },

    eventHandlers: {
        // All of these receive the event as first parameter:
        drop: callback,
        dragstart: null,
        dragend: null,
        dragenter: null,
        dragover: null,
        dragleave: null,
        // All of these receive the file as first parameter:
        addedfile: callback,
        removedfile: null,
        thumbnail: null,
        error: null,
        processing: null,
        uploadprogress: null,
        sending: null,
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
        console.log(this.eventHandlers);
        return (
            <div>
                <h2>User Profile</h2>
                <DropzoneComponent
                    config={this.componentConfig}
                    eventHandlers={this.eventHandlers}
                    djsConfig={this.djsConfig}/>
            </div>
        )
    }
});

export default UserProfile;
