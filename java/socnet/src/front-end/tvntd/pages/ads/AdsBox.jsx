/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';
import StarRating      from 'react-star-rating';

import WidgetGrid      from 'vntd-shared/widgets/WidgetGrid.jsx'
import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import AuthorStore     from 'vntd-root/stores/AuthorStore.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import {AdsStore}      from 'vntd-root/stores/ArticleStore.jsx';
import LikeStat        from 'vntd-root/components/LikeStat.jsx';

class AdsBox extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        const style = { maxWidth: "100%" };
        let adsRec = this.props.adsRec,
            ads    = adsRec.artObj,
            rank   = ads.adsRank,
            adsTag = adsRec.artTag,
            imgUrl = !_.isEmpty(ads.imageUrl) ?  ads.imageUrl[0] : null,
            active = this.props.active === true ?
                <span className="tag2 hot">Active</span> : null,
            likeStat = AdsBox.getLikeStat(rank);

        return (
            <div className="product-content product-wrap clearfix">
                <div className="product-deatil" onClick={this.props.onClick}>
                    <div className="row">
                        <div className="product-image" style={{height: "100"}}>
                            <img src={imgUrl} className="img-responsive"
                                style={style}/>
                            {active}
                        </div>
                    </div>
                    <div className="row">
                        <h4>{ads.busName}</h4>
                    </div>
                    <div className="row">
                        <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
                            <LikeStat data={likeStat}/>
                        </div>
                        <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                            <StarRating name={_.uniqueId('ads-')} size={15}
                                totalStars={5} rating={4} disabled={true}/>
                        </div>
                    </div>
                    <div className="row">
                        <h4 className="name">{ads.busPhone}</h4>
                        <span>
                            {ads.busStreet}<br/>
                            {ads.busCity}, {ads.busState} {ads.busZip}
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    static getLikeStat(rank) {
        return {
            commentCount: rank.notifCount ? rank.notifCount : 0,
            likesCount  : rank.likes,
            sharesCount : rank.shares
        };
    }
}

class BusinessInfo extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let adsRec = this.props.adsRec,
            ads    = adsRec.artObj,
            rank   = ads.adsRank,
            adsTag = adsRec.artTag;

        return (
            <WidgetGrid className={this.props.className} style={{ height: 'auto' }}>
                <h1>{ads.busName}</h1>
            </WidgetGrid>
        );
    }
}

export { AdsBox, BusinessInfo };
export default AdsBox;
