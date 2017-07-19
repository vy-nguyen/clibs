/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React             from 'react-mod';
import DropzoneComponent from 'react-dropzone-component';
import GenericForm       from 'vntd-shared/forms/commons/GenericForm.jsx';
import ImageCarousel     from 'vntd-shared/layout/ImageCarousel.jsx';

class MyProfile extends ImageCarousel
{
    constructor(props) {
        super(props);
        this.onSending = this.onSending.bind(this);
    }

    onSending(files, xhr, form) {
        form.append('name', files.name);
    }

    _renderEmbeded() {
        const djsConfig = GenericForm.getDjsConfig(),
        componentConfig = {
            iconFiletypes   : ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl         : '/api/upload-img'
        },
        eventHandlers = {
            sending: this.onSending,
        };
        return (
            <div className="air air-top-right padding-10">
                <DropzoneComponent config={componentConfig}
                    eventHandlers={eventHandlers} djsConfig={djsConfig}/>
            </div>
        );
    }
}

class ProfileCover extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let imgList = [
            "/rs/img/demo/s1.jpg",
            "/rs/img/demo/s2.jpg",
            "/rs/img/demo/s3.jpg"
        ];
        return <MyProfile imageList={imgList} className="profile-carousel"/>
    }
}

export default ProfileCover;
