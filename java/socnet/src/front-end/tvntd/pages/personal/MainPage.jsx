/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import Spinner            from 'react-spinjs';

import TabPanel           from 'vntd-shared/layout/TabPanel.jsx';
import AuthorBase         from 'vntd-shared/layout/AuthorBase.jsx';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import BaseStore          from 'vntd-root/stores/BaseStore.jsx';
import AuthorStore        from 'vntd-root/stores/AuthorStore.jsx';
import {VntdGlob}         from 'vntd-root/config/constants.js';
import ProfileAvatar      from './ProfileAvatar.jsx';
import ArticleBrief       from './ArticleBrief.jsx';
import ProfileCover       from './ProfileCover.jsx';

class CustMain extends AuthorBase
{
    constructor(props) {
        let userUuid;

        super(props);
        this._getBlogTab = this._getBlogTab.bind(this);

        userUuid = UserStore.getSelfUuid();
        this.state = _.merge(this.state, {
            userUuid: userUuid,
            tagList : this._updateTags(userUuid)
        });
    }

    componentWillReceiveProps(nextProps) {
        let uuid = this._getUserUuid(nextProps);

        if (uuid !== this.state.userUuid) {
            this.setState({
                userUuid: uuid,
                tagList : this._updateTags(uuid)
            })
        }
    }

    _getUserUuid(props) {
        if (props.userUuid != null) {
            return props.userUuid;
        }
        if (props.params != null && props.params.userUuid != null) {
            return props.params.userUuid;
        }
        return UserStore.getSelfUuid();
    }

    // @Override
    _updateAuthor(data, recv, status) {
        if (status === "startup" || status === "domain") {
            this.setState({
                tagList: this._updateTags(this.state.userUuid)
            });
        }
    }

    _updateTags(userUuid) {
        let allTags, tagMgr = AuthorStore.getAuthorTagMgr(userUuid);

        if (tagMgr != null) {
            allTags = tagMgr.getSortedTagList();
            if (allTags != null) {
                return BaseStore.sortTagByArticles(allTags).slice(0, 10);
            }
        }
        return [];
    }

    _getBlogTab(uuid) {
        let idx = 0, tagList = this.state.tagList,
        out = {
            tabItems: [],
            tabContents: []
        };
        if (uuid != null) {
            tagList = this._updateTags(uuid);
        }
        _.forOwn(tagList, function(tag) {
            out.tabItems.push({
                domId  : _.uniqueId('tag-'),
                tabText: tag.tagName,
                tabIdx : idx++
            });
            out.tabContents.push(
                <div key={_.uniqueId('tab-content-')} className="no-padding">
                    <ArticleBrief key={_.uniqueId('tag-brief-')} tag={tag}/>
                </div>
            );
        });
        return out;
    }

    render() {
        let self, tabData, spinner,
            userUuid = this.state.userUuid, params = this.props.params;

        if (params != null && params.userUuid != null && params.userUuid != userUuid) {
            userUuid = params.userUuid;
            tabData  = this._getBlogTab(userUuid);
        } else {
            tabData  = this._getBlogTab(null);
        }
        self = UserStore.getUserByUuid(userUuid);
        if (self == null) {
            return null;
        }
        spinner = (self.getPublicData() === true) ?
            <Spinner config={VntdGlob.spinner}/> : null;

        return (
            <div id="content">
                {spinner}
                <ProfileCover userUuid={userUuid}/>
                <ProfileAvatar userUuid={userUuid}/>
                <br/>
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <TabPanel className="padding-top-10" context={tabData}>
                            {tabData.tabContents}
                        </TabPanel>
                    </div>
                </div>
            </div>
        )
    }
}

export default CustMain
