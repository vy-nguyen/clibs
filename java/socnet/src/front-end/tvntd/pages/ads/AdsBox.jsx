/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';

import Panel           from 'vntd-shared/widgets/Panel.jsx';
import WidgetGrid      from 'vntd-shared/widgets/WidgetGrid.jsx'
import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import AuthorStore     from 'vntd-root/stores/AuthorStore.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import {AdsStore}      from 'vntd-root/stores/ArticleStore.jsx';
import {RatingInfo}    from 'vntd-root/components/LikeStat.jsx';
import Mesg            from 'vntd-root/components/Mesg.jsx';

const _adsDefStyle = { maxHeight: "auto", minHeight: "100%" },
    _adsTitleStyle = { color: "#800000", margin: "10px 0" },
    _adsBoxStyle   = { border: "1px", marginBottom: "10px", background: "#fff" },
    _adsTextStyle  = { textAlign: "center", padding: "5px 0px 10px 5px" };

class AdsBox extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let { ads, rank, adsTag, imgUrl, active, likeStat } =
            AdsBox.getAdsInfo(this.props.adsRec, this.props.active);

        return (
            <div style={_adsBoxStyle}
                className="product-wrap" onClick={this.props.onClick}>
                <div className="row">
                    <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4 no-padding">
                        <div className="product-image" style={_adsDefStyle}>
                            <img src={imgUrl} className="img-responsive"/>
                            {active}
                            <p style={_adsTextStyle}>{ads.busInfo}</p>
                        </div>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-8 col-lg-8 no-padding">
                        <div style={_adsTextStyle}> 
                            <h2 style={_adsTitleStyle}>{ads.busName}</h2>
                            <p>{AdsBox.businessAddr(ads)}</p>
                            <p>{ads.busWeb || ads.busEmail}</p>
                            <h3>{ads.busPhone}</h3>
                        </div>
                    </div>
                </div>
                <RatingInfo likeStat={likeStat}/>
            </div>
        );
    }

    static businessAddr(ads) {
        let street, city, state, zip;

        street = ads.busStreet ? ads.busStreet.substring(0, 20) : "";
        city   = ads.busCity ? ads.busCity.substring(0, 20) : "";
        state  = ads.busState ? ads.busState.substring(0, 20) : "";
        zip    = ads.busZip ? ads.busZip.substring(0, 8) : "";
        return (
            <span>
                {street}<br/>{city}, {state} {zip}
            </span>
        );
    }

    static getAdsInfo(adsRec, active) {
        let ads = adsRec.getArticle(), rank = adsRec.getArticleRank();

        return {
            ads    : ads,
            rank   : rank,
            adsTag : adsRec.getTagObj(),
            imgUrl : !_.isEmpty(ads.imageUrl) ?  ads.imageUrl[0] : null,
            active : active === true ? <span className="tag2 hot">Active</span> : null,
            likeStat: RatingInfo.getLikeStat(rank)
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

class AdsBigBox extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let { ads, rank, adsTag, imgUrl, active, likeStat } =
            AdsBox.getAdsInfo(this.props.adsRec, this.props.active),
            businessAddr = AdsBox.businessAddr(ads);

        return (
            <div className="product-content product-wrap">
                <div className="product-deatil" onClick={this.props.onClick}>
                    <div className="row">
                        <div className="product-image" style={{height: "100"}}>
                            <img src={imgUrl} className="img-responsive"
                                style={_adsDefStyle}/>
                            {active}
                        </div>
                    </div>
                    <div className="row">
                        <h2 style={_adsTitleStyle}>{ads.busName}</h2>
                    </div>
                    <RatingInfo likeStat={likeStat}/>
                    <div className="row">
                        <h4>{ads.busPhone}</h4>
                        {businessAddr}
                    </div>
                </div>
            </div>
        )
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
        let { ads, rank, adsTag, imgUrl, active, likeStat } =
            AdsBox.getAdsInfo(this.props.adsRec, null),
            address = AdsBox.businessAddr(ads),
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
                        <RatingInfo likeStat={likeStat} starSize={20}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                        <h1>{ads.busName}</h1>
                        {AdsBox.renderKeyValue("Phone", ads.busPhone)}
                        {AdsBox.renderKeyValue("Web",
                            <a href={ads.busWeb}>{ads.busWeb}</a>)}
                        {AdsBox.renderKeyValue("Address", address)}
                        {AdsBox.renderKeyValue("Hours", busHour)}

                        <div style={divStyle}
                            dangerouslySetInnerHTML={this._rawMarkup(ads.busDesc)}/>
                    </div>
                </div>
            </WidgetGrid>
        );
    }
}

export { AdsBox, AdsBigBox, BusinessInfo };
export default AdsBox;
