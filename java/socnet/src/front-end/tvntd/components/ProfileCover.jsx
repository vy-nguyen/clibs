/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React            from 'react-mod';
import { htmlCodes }    from 'vntd-root/config/constants';

let ProfileCover = React.createClass({
    render: function() {
        var imageId   = this.props.data.imageId;
        var cover_hdr = this.props.data.imageList.map(function(item, index) {
            var fmt;
            if (index == 0) {
                fmt = <li key={index} data-target={'#' + imageId} data-slide-to={index.toString()} className='active'></li>;
            } else {
                fmt = <li key={index} data-target={'#' + imageId} data-slide-to={index.toString()} class></li>;
            }
            return fmt;
        });
        var cover_img = this.props.data.imageList.map(function(item, index) {
            return (
                <div key={index} className={index == 0 ? "item active" : "item"}>
                    <img src={item} alt="Cover Image"/>
                </div>
            );
        });
        return (
<div className="row">            
    <div className="col-sm-12">
        <div id={imageId} className="carousel fade profile-carousel">
            <div className="air air-top-right padding-10">
                <a href-void className="btn txt-color-white bg-color-teal btn-sm">
                    <i className="fa fa-check"></i>Follow
                </a>{htmlCodes.spaceNoBreak}
                <a href-void className="btn txt-color-white bg-color-pinkDark btn-sm">
                    <i className="fa fa-link"></i>Connect
                </a>
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
});

export default ProfileCover;
