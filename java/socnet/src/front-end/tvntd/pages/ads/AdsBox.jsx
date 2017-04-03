/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';
import StarRating      from 'react-star-rating';

import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import AuthorStore     from 'vntd-root/stores/AuthorStore.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import {AdsStore}      from 'vntd-root/stores/ArticleStore.jsx';

class AdsBox extends React.Component
{
    constructor(props) {
        super(props);
        this._clickSelect = this._clickSelect.bind(this);
    }

    _clickSelect() {
    }

    render() {
        const style = { maxWidth: "100%" };
        let adsRec = this.props.adsRec,
            ads = adsRec.artObj,
            rank = ads.adsRank,
            adsTag = adsRec.artTag,
            imgUrl = !_.isEmpty(ads.imageUrl) ? ads.imageUrl[0] : null;

        return (
            <div className="product-content product-wrap clearfix">
                <div className="row">
                    <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                        <h4 className="no-padding">
                            {ads.busName}
                        </h4>
                    </div>
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <StarRating name={_.uniqueId('ads-')} size={10}
                            totalStars={5} rating={4} disabled={true}/>
                    </div>
                </div>
                <div className="row">
                    <div className="product-image" style={{height: 150}}>
                        <img src={imgUrl} className="img-responsive" style={style}/>
                        {/*<span className="tag2 hot">Hot</span>*/}
                    </div>
                </div>
                <div className="row">
                    <div className="product-deatil">
                        <h4 className="name">
                            {ads.busStreet}
                        </h4>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdsBox;
