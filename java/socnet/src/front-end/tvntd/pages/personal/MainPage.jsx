/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod'

import TabPanel           from 'vntd-shared/layout/TabPanel.jsx';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import BaseStore          from 'vntd-root/stores/BaseStore.jsx';
import AuthorStore        from 'vntd-root/stores/AuthorStore.jsx';
import ProfileAvatar      from './ProfileAvatar.jsx';
import ArticleBrief       from './ArticleBrief.jsx';
import ProfileCover       from './ProfileCover.jsx';

class CustMain extends React.Component
{
    constructor(props) {
        let userUuid;

        super(props);
        this._updateState = this._updateState.bind(this);
        this._getBlogTab  = this._getBlogTab.bind(this);

        userUuid = UserStore.getSelfUuid();
        this.state = {
            userUuid: userUuid,
            tagList : this._updateTags(userUuid)
        }
    }

    componentDidMount() {
        this.unsub = AuthorStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    componentWillReceiveProps(nextProps) {
        let uuid = this._getUserUuid(nextProps);

        if (uuid !== this.state.userUuid) {
            console.log("change uuid " + uuid);
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

    _updateState(data, recv, status) {
        if (status === "startup") {
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
                return BaseStore.sortTagByArticles(allTags).slice(0, 5);
            }
        }
        return [];
    }

    _getBlogTab() {
        let idx = 0, tagList = this.state.tagList,
        out = {
            tabItems: [],
            tabContents: []
        };
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
        let userUuid = this.state.userUuid, tabData = this._getBlogTab();

        return (
            <div id="content">
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
