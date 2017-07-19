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

        this._getId = this._getId.bind(this);
    }

    _getId() {
        return "prof-cover-" + this.props.userUuid;
    }

    render() {
        let imageId = this._getId(), cssImageId = '#' + imageId,
        imgList = [
            "/rs/img/bg/letamanh.jpg",
            "/rs/img/demo/s1.jpg",
            "/rs/img/demo/s2.jpg",
            "/rs/img/demo/s3.jpg"
        ],
        coverHdr = imgList.map(function(item, index) {
            let classn = index === 0 ? "active" : "";
            return (
                <li key={_.uniqueId('prof-')} data-target={cssImageId}
                    data-slide-to={index.toString()} className={classn}/>
            );
        }),
        coverImg = imgList.map(function(item, index) {
            return (
                <div key={_.uniqueId('prof-')}
                    className={index == 0 ? "item active" : "item"}>
                    <img src={item} alt="Cover Image"/>
                </div>
            );
        });
        return (
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <div id={imageId} className="carousel slide"
                        data-ride="carousel" data-interval="3000">
                        <div className="air air-bottom-right padding-10">
                        </div>
                        <ol className="carousel-indicators">
                            {coverHdr}
                        </ol>
                        <div className="carousel-inner">
                            {coverImg}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileCover;

