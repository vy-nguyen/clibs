/**
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import { Link }           from 'react-router';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';

import Mesg               from 'vntd-root/components/Mesg.jsx';
import ArticleTagBrief    from 'vntd-root/components/ArticleTagBrief.jsx';
import { VntdGlob }       from 'vntd-root/config/constants.js';
import { Util }           from 'vntd-shared/utils/Enum.jsx';
import { UserBase, SectionWall } from 'vntd-shared/layout/UserBase.jsx';

class Domain extends UserBase
{
    constructor(props) {
        super(props);
    }

    render() {
        let idx, link, cover, self = this.state.self;

        if (self == null) {
            return null;
        }
        idx = Util.getRandomInt(0, 2);
        if (idx === 0) {
            cover = self.coverImg0;
        } else if (idx === 1) {
            cover = self.coverImg1;
        } else {
            cover = self.coverImg2;
        }
        link = "/domain/" + self.userUuid;
        return (
            <div className="well no-padding">
                <Link to={link}>
                    <img src={cover} style={VntdGlob.styleFit}/>
                </Link>
                <div className="air air-top-left padding-10">
                    {this._renderAvatar()}
                </div>
            </div>
        );
    }
}

class DomainWall extends UserBase
{
    constructor(props) {
        super(props);
        this._renderEachDomain = this._renderEachDomain.bind(this);
        this._renderAllDomains = this._renderAllDomains.bind(this);

        this.state = _.merge(this.state, {
            domains: UserStore.getAllUserDomains()
        });
    }

    _updateUser(data) {
        this.setState({
            domains: UserStore.getAllUserDomains()
        });
    }

    _renderEachDomain(domain) {
        return <Domain userUuid={domain.userUuid}/>
    }

    _renderAllDomains() {
        return ArticleTagBrief.renderArtBox(
            this.state.domains, this._renderEachDomain, Util.noOpRetNull, true
        );
    }

    render() {
        return (
            <SectionWall title="User Home" className="panel-success"
                render={this._renderAllDomains}/>
        );
    }
}

export default DomainWall;
