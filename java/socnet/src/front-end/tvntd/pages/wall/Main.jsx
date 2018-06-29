/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';

import AuthorBase         from 'vntd-shared/layout/AuthorBase.jsx';
import ArtTagBase         from 'vntd-shared/layout/ArtTagBase.jsx';
import { SectionWall }    from 'vntd-shared/layout/UserBase.jsx';
import { Util }           from 'vntd-shared/utils/Enum.jsx';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';

import { VntdGlob }       from 'vntd-root/config/constants.js';
import EtherStore         from 'vntd-root/stores/EtherStore.jsx';
import ArticleTagBrief    from 'vntd-root/components/ArticleTagBrief.jsx';
import Mesg               from 'vntd-root/components/Mesg.jsx';
import DomainWall         from 'vntd-root/pages/personal/Domain.jsx';
import EtherCrumbs        from 'vntd-root/pages/wall/EtherCrumbs.jsx';
import EtherWall          from 'vntd-root/pages/wall/EtherWall.jsx';

class ServiceWall extends ArtTagBase
{
    constructor(props) {
        super(props);
        this._renderAllSections = this._renderAllSections.bind(this);
    }

    _cmpTags(pivot, tag) {
        return tag.order - pivot.order;
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
                Util.insertSorted(this._convertTag(tag[i]), out, this._cmpTags);
            }
        }
        return out;
    }

    _convertTag(tag) {
        let key = tag.sortedArts != null ? tag.sortedArts.length : 0;

        return {
            link  : tag.getRouteLink(),
            order : key,
            title : tag.tagName,
            imgUrl: tag.getImgUrl(),
            keyValues: [ {
                key  : key,
                value: "Article Posts",
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
            link  : "/app/rent",
            imgUrl: "/rs/img/bg/renting.jpg",
            order : 10000,
            title : "Renting",
            keyValues: [ {
                key  : "1",
                value: "New Listings",
                small: true
            }, {
                key  : "10",
                value: "Active Listings",
                small: true
            } ]
        }, {
            link  : "/app/yp",
            imgUrl: "/rs/img/bg/yp.jpg",
            order : 999,
            title : "Yellow Page",
            keyValues: [ {
                key  : "1",
                value: "City",
                small: true
            }, {
                key  : "100",
                value: "Business Listings",
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
                <EtherCrumbs id="route-map" crumb="Home" route="/"/>
                <EtherWall/>
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
