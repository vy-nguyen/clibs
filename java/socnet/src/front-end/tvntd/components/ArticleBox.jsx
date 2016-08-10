/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _         from 'lodash';
import React     from 'react-mod';

import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import ArticleStore    from 'vntd-root/stores/ArticleStore.jsx';
import AuthorStore     from 'vntd-root/stores/AuthorStore.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import LikeStat        from 'vntd-root/components/LikeStat.jsx';

let ArticleBox = React.createClass({

    _clickSelect: function() {
        console.log("Select artBox");
    },

    render: function() {
        let data = this.props.data;
        if (data.logoWidth == null) {
            data.logoWidth = 40;
            data.logoHeight = 40;
        }
        if (data.artBrief != null) {
            data.description = (
                <div className="description">
                    <p>{data.artBrief}</p>
                </div>
            );
        }
        if (data.clickCbFn == null) {
            data.clickCbFn = this._clickSelect;
        }
        return (
            <div className="product-content product-wrap clearfix">
                <div className="row">
                    <div className="col-md-4 col-sm-12 col-xs-12">
                        <div className="product-image" style={{minHeight: "150"}}>
                            <div className="air air-top-left padding-10">
                                <img src={data.logo} width={data.logoWidth} height={data.logoHeight} className="img-responsive"/>
                            </div>
                            <img src={data.image} className="img-responsive"/>
                        </div>
                        {data.tagImage ? <span className="tag2 hot">{data.tagImage}</span> : null}
                        <LikeStat data={data.likeStat} split={true}/>
                        <div className="smart-form">
                            <div className="rating">
                                <input type="radio" name="stars-rating" id="stars-rating-5"/>
                                <label for="stars-rating-5"><i className="fa fa-star"></i></label>
                                <input type="radio" name="stars-rating" id="stars-rating-4"/>
                                <label for="stars-rating-4"><i className="fa fa-star"></i></label>
                                <input type="radio" name="stars-rating" id="stars-rating-3"/>
                                <label for="stars-rating-3"><i className="fa fa-star text-primary"></i></label>
                                <input type="radio" name="stars-rating" id="stars-rating-2"/>
                                <label for="stars-rating-2"><i className="fa fa-star text-primary"></i></label>
                                <input type="radio" name="stars-rating" id="stars-rating-1"/>
                                <label for="stars-rating-1"><i className="fa fa-star text-primary"></i></label>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 col-sm-12 col-xs-12">
                        <div className="product-deatil">
                            <h4 className="name">
                                <a href="#"><span>{data.artCategory}</span></a>
                                <br/>
                                <a href="#">{data.artTitle}</a>
                            </h4>
                            <p className="price-container">
                                <span>{data.artPrice}</span>
                            </p>
                            {data.dateInfo ? <span><i className="fa fa-calendar"/> {data.dateInfo}</span> : null}
                        </div>
                        {data.description}
                        <div className="product-info smart-form">
                            <div className="row">
                                <div className="col-md-6 col-sm-6 col-xs-6">
                                    <a className={data.clickBtn.btnClass} onClick={data.clickCbFn}>{data.clickBtn.btnText}</a>
                                </div>
                                <div className="col-md-6 col-sm-6 col-xs-6">
                                </div>
                            </div>
                        </div>
                        <div className="product-info">
                        </div>
                    </div>
                </div>
            </div>
        )
    },

    statics: {
        article: function(articleUuid, clickCb, btnActive, btnDisabled, cbArg) {
            let article = ArticleStore.getArticleByUuid(articleUuid);
            if (article == null) {
                return null;
            }
            let author = UserStore.getUserByUuid(article.authorUuid);
            let artRank = AuthorStore.getArticleRank(article.authorUuid, articleUuid);
            let clickBtn = btnActive;
            if (ArticleTagStore.getPublicTag(artRank.tagName) != null) {
                clickBtn = btnDisabled;
            }
            if (artRank != null) {
            } else {
                arg.artBrief = article.content.substring(0, 100);
            }
            if (artRank.contentBrief == null) {
                artRank.contentBrief = article.content.substring(0, 100);
            }
            let arg = {
                logo       : author.userImgUrl,
                image      : article.pictureUrl[0],
                dateInfo   : article.dateString,
                artTitle   : article.topic,
                artCategory: artRank.tagName,
                artBrief   : artRank.contentBrief,
                artPrice   : author.getUserName(),
                clickCbFn  : clickCb.bind(cbArg, articleUuid, artRank),
                clickBtn   : clickBtn,
                likeStat   : {
                    dateMoment  : article.createdDate,
                    commentCount: artRank.notifCount ? artRank.notifCount : 0,
                    likesCount  : artRank.likes,
                    sharesCount : artRank.shares 
                }
            };
            return (<ArticleBox data = {arg}/>);
        }
    }
});

export default ArticleBox;
