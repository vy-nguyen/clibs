/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                 from 'lodash';
import React             from 'react-mod';

import UserStore         from 'vntd-shared/stores/UserStore.jsx';
import ImageCarousel     from 'vntd-shared/layout/ImageCarousel.jsx';

class ProfileCover extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let imgList = [
            "/rs/img/bg/letamanh.jpg",
            "/rs/img/demo/s1.jpg",
            "/rs/img/demo/s2.jpg",
            "/rs/img/demo/s3.jpg"
        ];
        return <ImageCarousel imageList={imgList} className="profile-carousel"/>;
    }
}

export default ProfileCover;
