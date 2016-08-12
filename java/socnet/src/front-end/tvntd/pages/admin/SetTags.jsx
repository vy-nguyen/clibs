/**
 * Vy Nguyen (2016)
 */
'use strict';

import React              from 'react-mod';
import Reflux             from 'reflux';

import ErrorView          from 'vntd-shared/layout/ErrorView.jsx';
import Actions            from 'vntd-root/actions/Actions.jsx';
import AdminStore         from 'vntd-root/stores/AdminStore.jsx';
import ArticleTagStore    from 'vntd-root/stores/ArticleTagStore.jsx';
import ArticleBox         from 'vntd-root/components/ArticleBox.jsx';
import TagInfo            from 'vntd-root/components/TagInfo.jsx';
import ArticleTagBrief    from 'vntd-root/components/ArticleTagBrief.jsx';

let SetTags = React.createClass({
    mixins: [
        Reflux.connect(AdminStore),
        Reflux.connect(ArticleTagStore)
    ],

    _submitSetTag: function(event) {
        event.preventDefault();
        Actions.setTags(ArticleTagStore.getSubmitTags());
        console.log(ArticleTagStore.getSubmitTags());
    },

    _tagArticle: function(uuid, artRank) {
        ArticleTagStore.addPublicTag(artRank.tagName, artRank.rank, null, uuid);
    },

    render: function() {
        let publicArts = AdminStore.getPublicArticle();
        let clickCb = {
            getBtnFormat: function() {
                if (ArticleTagStore.hasPublishedArticle(this.articleUuid) == true) {
                    return {
                        btnClass: "btn btn-success disabled",
                        btnText : "Article Added"
                    }
                }
                return {
                    btnClass: "btn btn-success",
                    btnText : "Add Article"
                }
            },
            callbackArg : this,
            clickHandler: this._tagArticle
        };
        let selected = [];

        _.forOwn(publicArts, function(v, artUuid) {
            clickCb.articleUuid = artUuid;
            selected.push(
                <div className="col-sm-6 col-md-6 col-lg-4" key={_.uniqueId("pub-art-selected-")}>
                    {ArticleBox.article(artUuid, clickCb)}
                </div> 
            )
        }.bind(this));

        let pubTagRender = [];
        let pubTagList = ArticleTagStore.getAllPublicTags();

        _.forOwn(pubTagList, function(item) {
            pubTagRender.push(
                <div className="col-sm-4 col-md-4 col-lg-4" key={_.uniqueId('pub-tag-')}>
                    <TagInfo artTag={item}/>
                </div>
            );
        });
        return (
            <div id="content">
                <section id="widget-grid" className="">
                    <div className="row">
                        {selected}
                    </div>
                </section>
                <div className="row">
                    {!_.isEmpty(pubTagRender) ? pubTagRender : null}
                </div>
                <div className="row">
                    <div className="col-sm-4 col-md-4 col-lg-4">
                        <TagInfo artTag={null}/>
                    </div>
                    <footer>
                        <button className="btn btn-primary" onClick={this._submitSetTag}>Save Tags</button>
                    </footer>
                </div>
                {ArticleTagBrief.renderPublicTags()}
            </div>
        );
    }
});

export default SetTags;
