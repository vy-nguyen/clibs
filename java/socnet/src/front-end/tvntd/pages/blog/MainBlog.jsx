/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod'
import Reflux          from 'reflux';
import TabPanel        from 'vntd-shared/layout/TabPanel.jsx';
import AdminStore      from 'vntd-root/stores/AdminStore.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import ArticleTagBrief from 'vntd-root/components/ArticleTagBrief.jsx';

let MainBlog = React.createClass({

    mixins: [
        Reflux.connect(ArticleTagStore)
    ],

    getBlogTab: function() {
        let idx = 0;
        let out = {
            tabItems: [],
            tabContents: []
        };
        let pubTags = ArticleTagStore.getAllPublicTags();
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
    },

    _getActivePane: function() {
        return 0;
    },

    _setActivePane: function(idx) {
    },

    render: function() {
        let tabData = this.getBlogTab();
        return (
            <div id="content">
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
});

export default MainBlog;
