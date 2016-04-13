/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React             from 'react-mod';
import DropzoneComponent from 'react-dropzone-component';

let ProfileCover = React.createClass({
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

        let imageId = "profile-cover";
        let imgList = [
            "/rs/img/demo/s1.jpg",
            "/rs/img/demo/s2.jpg",
            "/rs/img/demo/s3.jpg"
        ];

        let cover_hdr = imgList.map(function(item, index) {
            if (index == 0) {
                return <li key={index} data-target={'#' + imageId} data-slide-to={index.toString()} className='active'></li>;
            } else {
                return <li key={index} data-target={'#' + imageId} data-slide-to={index.toString()} class></li>;
            }
        });
        let cover_img = imgList.map(function(item, index) {
            return (
                <div key={index} className={index == 0 ? "item active" : "item"}>
                    <img src={item} alt="Cover Image"/>
                </div>
            );
        });

        return (
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
        );
    }
});

export default ProfileCover;

