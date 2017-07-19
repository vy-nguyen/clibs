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
import ImageCarousel  from 'vntd-shared/layout/ImageCarousel.jsx';
import { choose, getRandomInt } from 'vntd-shared/utils/Enum.jsx';

class UserProfile extends ImageCarousel
{
    constructor(props) {
        super(props);
    }

    _renderEmbeded() {
        let self = this.props.self, connectFmt = "", followFmt = "";

        if (UserStore.getSelf() != self) {
            if (self.isInConnection()) {
                connectFmt = (
                    <button className="btn btn-sm txt-color-white bg-color-pinkDark">
                        <i className="fa fa-link"/><Mesg text=" Connected "/>
                        <i className="fa fa-check"/>
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
            <div className="air air-top-right padding-10">
                {connectFmt}
                {htmlCodes.spaceNoBreak}
                {followFmt}
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
        let self = UserStore.getUserByUuid(this.props.userUuid), imgList, start;

        if (self === null) {
            return <h1><Mesg text="Invalid user id"/></h1>
        }
        imgList = [
            "/rs/img/demo/s1.jpg",
            "/rs/img/demo/s2.jpg",
            "/rs/img/demo/s3.jpg"
        ];
        start = getRandomInt(0, imgList.length).toString();
        return (
            <UserProfile self={self} select={start}
                imageList={imgList} className="profile-carousel"/>
        );
    }
}

export default ProfileCover;
