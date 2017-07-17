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
//import ArticleTagBrief    from 'vntd-root/components/ArticleTagBrief.jsx';
import ProfileCover       from './ProfileCover.jsx';
import ProfileAvatar      from './ProfileAvatar.jsx';
import ArticleBrief       from './ArticleBrief.jsx';

class CustMain extends React.Component
{
    constructor(props) {
        super(props);
        this._updateState = this._updateState.bind(this);
        this._getBlogTab  = this._getBlogTab.bind(this);
        this.state = {
            tagList: []
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

    _updateState(data, recv, status) {
        if (status === "startup") {
            this.setState({
                tagList: this._updateTags()
            });
        }
    }

    _updateTags() {
        let allTags, userUuid = UserStore.getSelfUuid(),
            tagMgr = AuthorStore.getAuthorTagMgr(userUuid);

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
        let userUuid = UserStore.getSelfUuid(),
            tabData = this._getBlogTab();

        return (
            <div id="content">
                <ProfileCover userUuid={userUuid}/>
                <ProfileAvatar/>
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
