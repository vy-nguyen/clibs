/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                 from 'lodash';
import React             from 'react-mod'
import TabPanel          from 'vntd-shared/layout/TabPanel.jsx';
import ArtTagBase        from 'vntd-shared/layout/ArtTagBase.jsx';
import AuthorStore       from 'vntd-root/stores/AuthorStore.jsx';
import ArticleTagStore   from 'vntd-root/stores/ArticleTagStore.jsx';
import ArticleTagBrief   from 'vntd-root/components/ArticleTagBrief.jsx';
import EtherCrumbs       from 'vntd-root/pages/wall/EtherCrumbs.jsx';

class TagBlog extends ArtTagBase
{
    constructor(props) {
        super(props);
    }

    render() {
        let pubTags = this.state.pubTags, param = this.props.params,
            tag = ArticleTagStore.getTagFromRoute(param.tag);

        if (tag != null) {
            return (
                <div id="content">
                    <EtherCrumbs id="route-map"
                        crumb={tag.tagName} route={tag.getRouteLink()}/>
                    <ArticleTagBrief tag={tag}/>
                </div>
            );
        }
        return null;
    }
}

class MainBlog extends ArtTagBase
{
    constructor(props) {
        super(props);
        this._getBlogTab  = this._getBlogTab.bind(this);
    }

    _getBlogTab() {
        let idx = 0,
        out = {
            tabItems: [],
            tabContents: []
        },
        pubTags = this.state.pubTags,
        mode = this.props.params.blog;

        AuthorStore.fetchExtraArticles(mode);
        if (mode !== this.state.pubMode) {
            pubTags = ArticleTagStore.getAllPublicTags(true, mode)
        }
        _.forOwn(pubTags, function(tag) {
            out.tabItems.push({
                domId  : _.uniqueId('tag-'),
                tabText: tag.tagName,
                tabIdx : idx++
            });
            out.tabContents.push(
                <div key={_.uniqueId('tab-content-')} className="no-padding">
                    <ArticleTagBrief key={_.uniqueId('tag-brief-')} tag={tag}/>
                </div>
            );
        });
        return out;
    }

    render() {
        let tabData = this._getBlogTab();
        return (
            <div id="content">
                <EtherCrumbs id="route-map" crumb="Blogs" route="/public/blog"/>
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

export default MainBlog;
export { MainBlog, TagBlog }
