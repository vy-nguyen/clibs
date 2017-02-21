/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _              from 'lodash';
import React          from 'react-mod';
import { htmlCodes }  from 'vntd-root/config/constants';
import Mesg           from 'vntd-root/components/Mesg.jsx'
import UserStore      from 'vntd-shared/stores/UserStore.jsx';

import { choose, getRandomInt } from 'vntd-shared/utils/Enum.jsx';

class ProfileCover extends React.Component
{
    render() {
        let self = UserStore.getUserByUuid(this.props.userUuid), imageId, imgList,
            active, cover_hdr, cover_img, connectFmt, followFmt;

        if (self === null) {
            return <h1><Mesg text="Invalid user id"/></h1>
        }
        imageId = 'prof-' + self.userUuid;
        imgList = [
            choose(self.coverImg0, '/rs/img/demo/s1.jpg'),
            choose(self.coverImg1, '/rs/img/demo/s2.jpg'),
            choose(self.coverImg2, '/rs/img/demo/s3.jpg')
        ];
        active = getRandomInt(0, imgList.length);
        cover_hdr = imgList.map(function(item, index) {
            let id = _.uniqueId('prof-cover-img-');
            if (index == active) {
                return <li key={id} data-target={'#' + imageId} data-slide-to={index.toString()} className='active'></li>;
            }
            return <li key={id} data-target={'#' + imageId} data-slide-to={index.toString()} className=''></li>;
        });
        cover_img = imgList.map(function(item, index) {
            return (
                <div key={_.uniqueId('prof-cover-img-')} className={index == active ? "item active" : "item"}>
                    <img src={item} alt="Cover Image"/>
                </div>
            );
        });
        connectFmt = "";
        followFmt = "";

        if (UserStore.getSelf() != self) {
            if (self.isInConnection()) {
                connectFmt = (
                    <button className="btn btn-sm txt-color-white bg-color-pinkDark">
                        <i className="fa fa-link"/><Mesg text=" Connected "/><i className="fa fa-check"/>
                    </button>
                );
            } else if (self.isInFollowed()) {
                followFmt = (
                    <button className="btn btn-sm txt-color-white bg-color-teal">
                        <Mesg text=" Followed "/><i className="fa fa-check"/>
                    </button>
                );
            } else if (self.isFollower()) {
                connectFmt = (
                    <button className="btn btn-sm txt-color-white bg-color-pinkDark">
                        <i className="fa fa-link"/><Mesg text=" Connect"/>
                    </button>
                );
            } else {
                connectFmt = (
                    <button className="btn btn-sm txt-color-white bg-color-pinkDark">
                        <i className="fa fa-link"/><Mesg text=" Connect"/>
                    </button>
                );
                followFmt = (
                    <button className="btn btn-sm txt-color-white bg-color-teal">
                        <i className="fa fa-check"/><Mesg text=" Follow"/>
                    </button>
                );
            }
        }
        return (
            <div className="row">            
                <div className="col-sm-12">
                    <div id={imageId} className="carousel fade profile-carousel">
                        <div className="air air-top-right padding-10">
                            {connectFmt}
                            {htmlCodes.spaceNoBreak}
                            {followFmt}
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
        )
    }
}

export default ProfileCover;
