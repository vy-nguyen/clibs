/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _              from 'lodash';
import React          from 'react-mod';
import { htmlCodes }  from 'vntd-root/config/constants';
import UserStore      from 'vntd-shared/stores/UserStore.jsx';

class ProfileCover extends React.Component
{
    render() {
        let self = UserStore.getUserByUuid(this.props.userUuid);
        if (self === null) {
            return <h1>Invalid user id</h1>
        }
        let imageId = self._id;
        let imgList = [
            self.coverImg0,
            self.coverImg1,
            self.coverImg2,
        ];
        let cover_hdr = imgList.map(function(item, index) {
            let id = _.uniqueId('prof-cover-img-');
            if (index == 0) {
                return <li key={id} data-target={'#' + imageId} data-slide-to={index.toString()} className='active'></li>;
            }
            return <li key={id} data-target={'#' + imageId} data-slide-to={index.toString()} className=''></li>;
        });
        var cover_img = imgList.map(function(item, index) {
            return (
                <div key={_.uniqueId('prof-cover-img-')} className={index == 0 ? "item active" : "item"}>
                    <img src={item} alt="Cover Image"/>
                </div>
            );
        });
        let connectFmt = "";
        let followFmt = "";

        if (UserStore.getSelf() != self) {
            if (self.isInConnection()) {
                connectFmt = (
                    <button className="btn btn-sm txt-color-white bg-color-pinkDark">
                        <i className="fa fa-link"/> Connected <i className="fa fa-check"/>
                    </button>
                );
            } else if (self.isInFollowed()) {
                followFmt = (
                    <button className="btn btn-sm txt-color-white bg-color-teal">
                        Followed <i className="fa fa-check"/>
                    </button>
                );
            } else if (self.isFollower()) {
                connectFmt = (
                    <button className="btn btn-sm txt-color-white bg-color-pinkDark">
                        <i className="fa fa-link"/> Connect
                    </button>
                );
            } else {
                connectFmt = (
                    <button className="btn btn-sm txt-color-white bg-color-pinkDark">
                        <i className="fa fa-link"/> Connect
                    </button>
                );
                followFmt = (
                    <button className="btn btn-sm txt-color-white bg-color-teal">
                        <i className="fa fa-check"/> Follow
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
