/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';
import StarRating      from 'react-star-rating';

import Panel           from 'vntd-shared/widgets/Panel.jsx';
import WidgetGrid      from 'vntd-shared/widgets/WidgetGrid.jsx'
import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import AuthorStore     from 'vntd-root/stores/AuthorStore.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import {AdsStore}      from 'vntd-root/stores/ArticleStore.jsx';
import LikeStat        from 'vntd-root/components/LikeStat.jsx';
import Mesg            from 'vntd-root/components/Mesg.jsx';

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
                            <StarRating size={15}
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

    static renderKeyValue(key, value) {
        const
        labelFmt = "control-label col-xs-2 col-sm-2 col-md-2 col-lg-2",
        valueFmt = "control-label col-xs-10 col-sm-10 col-md-10 col-lg-10";

        return (
            <div className="inbox-info-bar no-padding">
                <div className="row">
                    <label className={labelFmt}>
                        <strong><Mesg text={key}/></strong>
                    </label>
                    <div className={valueFmt}>{value}</div>
                </div>
            </div>
        );
    }
}

class BusinessInfo extends React.Component
{
    constructor(props) {
        super(props);
        this._rawMarkup = this._rawMarkup.bind(this);
    }

    _rawMarkup(raw) {
        return { __html: raw };
    }

    render() {
        let adsRec = this.props.adsRec,
            ads    = adsRec.artObj,
            rank   = ads.adsRank,
            adsTag = adsRec.artTag,
            imgUrl = !_.isEmpty(ads.imageUrl) ?  ads.imageUrl[0] : null,
            likeStat = AdsBox.getLikeStat(rank),
        city = (
            <span>{ads.busCity}, {ads.busState} {ads.busZip}</span>
        ),
        busHour = (
            <div dangerouslySetInnerHTML= {this._rawMarkup(ads.busHour)}/>
        );

        const divStyle = {
            margin: "10px 10px 10px 10px",
            fontSize: "130%"
        };

        return (
            <WidgetGrid className={this.props.className} style={{ height: 'auto' }}>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="row">
                            <div className="product-image">
                                <img src={imgUrl} className="img-responsive"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sx-7 col-sm-7 col-md-7 col-lg-7">
                                <LikeStat data={likeStat}/>
                            </div>
                            <div className="col-sx-5 col-sm-5 col-md-5 col-lg-5">
                                <StarRating name={_.uniqueId('ads-')} size={20}
                                    totalStarts={5} rating={4}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                        <h1>{ads.busName}</h1>
                        {AdsBox.renderKeyValue("Phone", ads.busPhone)}
                        {AdsBox.renderKeyValue("Web",
                            <a href={ads.busWeb}>{ads.busWeb}</a>)}
                        {AdsBox.renderKeyValue("Address", ads.busStreet)}
                        {AdsBox.renderKeyValue("City", city)}
                        {AdsBox.renderKeyValue("Hours", busHour)}

                        <div style={divStyle}
                            dangerouslySetInnerHTML={this._rawMarkup(ads.busDesc)}/>
                    </div>
                </div>
            </WidgetGrid>
        );
    }
}

export { AdsBox, BusinessInfo };
export default AdsBox;
