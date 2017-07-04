/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';
import StarRating      from 'react-star-rating';

import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import ArticleStore    from 'vntd-root/stores/ArticleStore.jsx';
import AuthorStore     from 'vntd-root/stores/AuthorStore.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import LikeStat        from 'vntd-root/components/LikeStat.jsx';

const _artDefStyle  = { maxHeight: "auto", minHeight: "100%" },
    _artBoxStyle    = { border: "1px", marginBottom: "10px", background: "#fff" },
    _artAuthorStyle = { color: "#800000", fontSize: "110%" },
    _artHeaderStyle = { background: "#cbcbcb", padding: "5px 5px 10px 5px" };

class ArticleBox extends React.Component
{
    constructor(props) {
        super(props);
        this._clickSelect = this._clickSelect.bind(this);
    }

    _clickSelect() {
    }

    render() {
        let data = this.props.data,
            tagImg = data.tagImage ?
                <span className="tag2 hot">{data.tagImage}</span> : null,
            dateInfo = data.dateInfo ?
                <span><i className="fa fa-calendar"/>{data.dateInfo}</span> : null;

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
            <div style={_artBoxStyle} className="product-wrap clearfix">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="product-image" style={_artDefStyle}>
                            <div className="air air-top-left padding-10">
                                <img src={data.logo} className="img-responsive"
                                    width={data.logoWidth}
                                    height={data.logoHeight}/>
                            </div>
                            <img src={data.image} className="img-responsive"/>
                            <img src={data.image1} className="img-responsive"/>
                            {tagImg}
                        </div>
                        <LikeStat data={data.likeStat} split={true}/>
                        <StarRating size={15} totalStars={5} rating={4} disabled={true}/>
                    </div>
                    <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                        <div style={_artHeaderStyle}>
                            <h4 className="name">
                                {data.artTitle}
                            </h4>
                            <p style={_artAuthorStyle}>
                                <span>{data.artPrice}</span>
                            </p>
                            {dateInfo}
                        </div>
                        {data.description}
                        <div className="product-info">
                            <div className="row">
                                <div className="col-md-6 col-sm-6 col-xs-6">
                                    <a className={data.clickBtn.btnClass}
                                        onClick={data.clickCbFn}>
                                        {data.clickBtn.btnText}
                                    </a>
                                </div>
                                <div className="col-md-6 col-sm-6 col-xs-6">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    static article(articleUuid, clickCb) {
        let article = ArticleStore.getArticleByUuid(articleUuid);
        if (article == null) {
            return null;
        }
        let author = UserStore.getUserByUuid(article.authorUuid);
        let artRank = AuthorStore.getArticleRank(article.authorUuid, articleUuid);

        if (artRank == null) {
            return null;
        }
        if (artRank.contentBrief == null) {
            artRank.contentBrief = article.content.substring(0, 100);
        }
        let arg = {
            logo       : author.userImgUrl,
            image      : article.pictureUrl[0],
            image1     : article.pictureUrl[1],
            dateInfo   : article.dateString,
            artTitle   : article.topic,
            artCategory: artRank.tagName,
            artBrief   : artRank.contentBrief,
            artPrice   : author.getUserName(),
            clickCbFn  : clickCb.clickHandler
                            .bind(clickCb.callbackArg, articleUuid, artRank),
            clickBtn   : clickCb.getBtnFormat(clickCb.articleUuid),
            likeStat   : {
                dateMoment  : article.createdDate,
                commentCount: artRank.notifCount ? artRank.notifCount : 0,
                likesCount  : artRank.likes,
                sharesCount : artRank.shares 
            }
        };
        return (<ArticleBox data={arg}/>);
    }
}

export default ArticleBox;
