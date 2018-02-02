/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';
import StarRating      from 'react-star-rating';

import NavStore        from 'vntd-shared/stores/NavigationStore.jsx';
import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import AccordionView   from 'vntd-shared/layout/AccordionView.jsx';
import ArticleStore    from 'vntd-root/stores/ArticleStore.jsx';
import AuthorStore     from 'vntd-root/stores/AuthorStore.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import Lang            from 'vntd-root/stores/LanguageStore.jsx';
import LikeStat        from 'vntd-root/components/LikeStat.jsx';

import {VntdGlob}      from 'vntd-root/config/constants.js';
import {UserSection}   from 'vntd-root/components/UserIcon.jsx';
import {Util}          from 'vntd-shared/utils/Enum.jsx';

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

    static getArtCtx(articleUuid, authorUuid, clickCb) {
        let img, img1, author, artRank,
            article = ArticleStore.getArticleByUuid(articleUuid, authorUuid);

        author = UserStore.getUserByUuid(authorUuid);
        artRank = AuthorStore.getArticleRankByUuid(articleUuid, authorUuid);

        if (artRank == null) {
            return null;
        }
        if (artRank.contentBrief == null) {
            if (article.content != null && article.content.length > 255) {
                artRank.contentBrief = article.content.substring(0, 255);
            } else {
                artRank.contentBrief = "";
            }
        }
        img = artRank.getPictureUrl();
        if (img != null && !_.isEmpty(img)) {
            img1 = img[1];
            img  = img[Util.getRandomInt(0, img.length - 1)];
        } else {
            img  = null;
        }
        if (img == null) {
            img  = UserStore.getSelf().userImgUrl
            img1 = null;
        }
        return {
            article    : article,
            logo       : author.userImgUrl,
            image      : img,
            image1     : img1,
            dateInfo   : article.dateString,
            artTitle   : artRank.getArtTitle(),
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
    }

    static getClickCb(state, artUuid, clickFn, cbarg) {
        return {
            getBtnFormat: function() {
                if (state.articleUuid == null || state.articleUuid !== artUuid) {
                    return {
                        btnClass: "btn btn-success",
                        btnText : Lang.translate("Read more...")
                    }
                }
                return {
                    btnClass: "btn btn-success",
                    btnText : Lang.translate("Hide post")
                }
            },
            callbackArg : cbarg,
            clickHandler: clickFn != null ? clickFn : function() {}
        };
    }

    static article(articleUuid, authorUuid, clickCb) {
        let data = ArticleBox.getArtCtx(articleUuid, authorUuid, clickCb);
        return (data != null ? <ArticleBox data={data}/> : null);
    }

    static artBlog(articleUuid, authorUuid, clickCb) {
        let data = ArticleBox.getArtCtx(articleUuid, authorUuid, clickCb);
        return (data != null ? <ArtBlogStyle data={data}/> : null);
    }

    static artBlogWide(articleUuid, authorUuid, clickCb) {
        let data = ArticleBox.getArtCtx(articleUuid, authorUuid, clickCb);
        return (data != null ? <ArtBlogWide data={data}/> : null);
    }

    static artBlogList(data, state, clickFn, cbArg) {
        return (
            <ArtBlogListWide data={data} state={state} clickFn={clickFn} cbArg={cbArg}/>
        );
    }

    static youtubeLink(article, brief) {
        let rank = article.getArticleRank(), oid, code, url;

        if (rank == null || rank.contentLinkUrl == null) {
            return null;
        }
        oid = rank.contentOid;
        if (oid != null) {
            code = oid.substring(0, 3);
            if (code === "DOC") {
                url = "https://docs.google.com/" + rank.contentLinkUrl +
                    "/pub?embedded=true";

            } else if (code === "VID") {
                url = "https://www.youtube.com/embed/" + rank.contentLinkUrl;

            } else if (code === "DRV") {
                let linkId = rank.contentLinkUrl, idx = linkId.lastIndexOf('/');

                if (idx > 0) {
                    linkId = linkId.substring(idx);
                }
                url = "https://docs.google.com/viewer?srcid=" + linkId +
                    "&pid=explorer&efh=false&a=v&chrome=false&embedded=true";
            } else {
                return null;
            }
        } else {
            url = "https://www.youtube.com/embed/" + rank.contentLinkUrl;
        }

        const style = {
            position : "relative",
            width    : "100%",
            height   : brief === true ? "200px" : NavStore.getMaxHeight(),
            paddingBottom: "95%"
        };
        return (
            <div style={style}>
                <iframe style={VntdGlob.styleFrame} src={url}
                    frameborder="0" allowfullscreen className="video"/>
            </div>
        );
    }
}
// <iframe style={frame} src="https://docs.google.com/viewer?srcid=0B-PLkJ2jO9eYRHJzempNRG1PajA&pid=explorer&efh=false&a=v&chrome=false&embedded=true" frameborder="0"/>

class ArtBlogStyle extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let img, arg = this.props.data, clickBtn = arg.clickBtn,
            article = arg.article, artRank = article.getArticleRank();

        if (article.youtube != null ||
            (artRank != null && artRank.contentLinkUrl != null)) {
            img = ArticleBox.youtubeLink(article, true);
        } else {
            img = (
                <a onClick={arg.clickCbFn}>
                    <img src={arg.image}
                            style={VntdGlob.styleFit} className="img-responsive"/>
                </a>
            );
        }
        return (
            <div className="well">
                <div className="row">
                    {img}
                    <LikeStat data={arg.likeStat} className="padding-10"/>
                </div>
                <div className="row">
                    <h3 className="margin-top-0"> 
                        <a onClick={arg.clickCbFn}>{arg.artTitle}</a>
                    </h3>
                    <p className="padding-10">{arg.artBrief}</p>
                    <a className={clickBtn.btnClass} onClick={arg.clickCbFn}>
                        {clickBtn.btnText}
                    </a>
                </div>
            </div>
        );
    }
}

class ArtBlogWide extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let arg = this.props.data, clickBtn = arg.clickBtn;

        if (arg == null) {
            return null;
        }
        return (
            <div className="well">
                <div className="row">
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <a onClick={arg.clickCbFn}>
                            <img src={arg.image}
                                style={VntdGlob.styleFit} className="img-responsive"/>
                        </a>
                        <LikeStat data={arg.likeStat} className="padding-10"/>
                    </div>
                    <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 padding-left-0">
                        <h3 className="margin-top-10">
                            <a onClick={arg.clickCbFn}>{arg.artTitle}</a>
                        </h3>
                        <p>{arg.artBrief}</p>
                        <a className={clickBtn.btnClass} onClick={arg.clickCbFn}>
                            {clickBtn.btnText}
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

class ArtBlogListWide extends React.Component
{
    constructor(props) {
        super(props);
        this._renderTag     = this._renderTag.bind(this);
        this._renderArtLink = this._renderArtLink.bind(this);
    }

    _clickLink(artRank) {
        this.props.clickFn(artRank.getArticleUuid(), artRank);
    }

    _renderTag(tag) {
        return <span>{tag.tagName}</span>;
    }

    _renderArtLink(artRank) {
        let text = artRank.artTitle.substring(0, 40);
        return (
            <p><a onClick={this._clickLink.bind(this, artRank)}>{text}</a></p>
        );
    }

    _genArtTree(data, artTree) {
        let artTag, anchor, evenRow = true, tagList = {};

        _.forEach(data.artArray, function(pubArt) {
            artTag = pubArt.getTagObj();
            anchor = tagList[artTag.tagName];
            if (anchor == null) {
                anchor = {
                    children : [],
                    iconOpen : "fa fa-folder-open",
                    iconClose: "fa fa-folder",
                    renderFn : this._renderTag,
                    renderArg: artTag,
                    fontSize : "12",
                    defLabel : true,
                    textStyle: evenRow ? "label label-info" : "label label-primary"
                };
                evenRow = !evenRow;
                tagList[artTag.tagName] = anchor;
            }
            anchor.children.push({
                children : null,
                parent   : anchor,
                renderFn : this._renderArtLink,
                renderArg: pubArt.getArticleRank()
            });
        }.bind(this));

        _.forOwn(tagList, function(elm) {
            artTree.push(elm);
        });
    }

    render() {
        let pub, articleUuid, authorUuid, artTree = [], data = this.props.data;

        if (data.artArray.length == 1) {
            let { state, clickFn, cbArg } = this.props;

            pub         = data.artArray[0];
            authorUuid  = pub.getAuthorUuid();
            articleUuid = pub.getArticleUuid();

            return ArticleBox.artBlog(articleUuid, authorUuid,
                ArticleBox.getClickCb(state, articleUuid, clickFn, cbArg)
            );
        }
        this._genArtTree(data, artTree);

        return (
            <div className="row">
                <UserSection userUuid={data.authorUuid}/>
                <div style={{maxHeight:300, overflow: "auto"}}>
                    <AccordionView items={artTree}/>
                </div>
            </div>
        );
    }
}

export default ArticleBox;
