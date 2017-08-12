/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import AuthorBase         from 'vntd-shared/layout/AuthorBase.jsx';
import ArtTagBase         from 'vntd-shared/layout/ArtTagBase.jsx';
import { SectionWall }    from 'vntd-shared/layout/UserBase.jsx';
import { Util }           from 'vntd-shared/utils/Enum.jsx';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';

import { VntdGlob }       from 'vntd-root/config/constants.js';
import ArticleTagBrief    from 'vntd-root/components/ArticleTagBrief.jsx';
import Mesg               from 'vntd-root/components/Mesg.jsx';
import DomainWall         from 'vntd-root/pages/personal/Domain.jsx';

class ServiceWall extends ArtTagBase
{
    constructor(props) {
        super(props);
        this._renderAllSections = this._renderAllSections.bind(this);
    }

    _getSerevices(out) {
        let i, len, tag;

        if (this.props.services != null) {
            return this.props.services;
        }
        if (out == null) {
            out = [];
        }
        tag = this.state.pubTags;
        if (tag != null) {
            len = tag.length > 8 ? 8 : tag.length;
            for (i = 0; i < len; i++) {
                out.push(this._convertTag(tag[i]));
            }
        }
        return out;
    }

    _convertTag(tag) {
        return {
            link  : "",
            imgUrl: this._getImgUrl(),
            title : tag.tagName,
            keyValues: [ {
                key  : tag.sortedArts != null ? tag.sortedArts.length : 0,
                value: "Posts",
                small: true
            } ]
        }
    }

    _renderAllSections() {
        return ArticleTagBrief.renderArtBox(
            this._getSerevices(null), SectionWall.renderSection, Util.noOpRetNull, true
        );
    }

    _mainRender(title, className) {
        return (
            <SectionWall title={title} className={className}
                render={this._renderAllSections}/>
        );
    }

    _getImgUrl() {
        const imgs = [
            "/rs/img/superbox/superbox-full-10.jpg",
            "/rs/img/superbox/superbox-full-11.jpg",
            "/rs/img/superbox/superbox-full-12.jpg",
            "/rs/img/superbox/superbox-full-13.jpg",
            "/rs/img/superbox/superbox-full-14.jpg",
            "/rs/img/superbox/superbox-full-15.jpg",
            "/rs/img/superbox/superbox-full-16.jpg",
            "/rs/img/superbox/superbox-full-17.jpg",
            "/rs/img/superbox/superbox-full-18.jpg",
            "/rs/img/superbox/superbox-full-19.jpg"
        ];
        return imgs[Util.getRandomInt(0, imgs.length - 1)];
    }
}

class BlogWall extends ServiceWall
{
    constructor(props) {
        super(props);
    }

    render() {
        return this._mainRender("Publish Posts", "panel-primary");
    }
}

class SpecialSvc extends ServiceWall
{
    constructor(props) {
        super(props);
    }

    // @Override
    //
    _getSerevices(out) {
        out = [ {
            link  : "",
            imgUrl: this._getImgUrl(),
            title : "Abc",
            keyValues: [ {
                key  : "1",
                value: "Key 1",
                small: true
            }, {
                key  : "2",
                value: "Key 2",
                small: true
            } ]
        } ];
        return super._getSerevices(out);
    }

    render() {
        return this._mainRender("Service Apps", "panel-warning");
    }
}

class AdsWall extends ServiceWall
{
    constructor(props) {
        super(props);
    }

    render() {
        return this._mainRender("Advertising", "panel-success");
    }
}

class ProdWall extends ServiceWall
{
    constructor(props) {
        super(props);
    }

    render() {
        return this._mainRender("Online Market", "panel-info");
    }
}

class MainWall extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="content">
                <DomainWall/>
                <BlogWall tagKind="blog"/>
                <SpecialSvc tagKind="edu"/>
                <AdsWall tagKind="ads"/>
                <ProdWall tagKind="estore"/>
            </div>
        );
    }
}

export default MainWall;
