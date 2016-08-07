/**
 * Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import Reflux         from 'reflux';

import ErrorView          from 'vntd-shared/layout/ErrorView.jsx';
import Actions            from 'vntd-root/actions/Actions.jsx';
import AdminStore         from 'vntd-root/stores/AdminStore.jsx';
import ArticleTagStore    from 'vntd-root/stores/ArticleTagStore.jsx';
import ArticleBox         from 'vntd-root/components/ArticleBox.jsx';
import TagInfo            from 'vntd-root/components/TagInfo.jsx';

let SetTags = React.createClass({
    mixins: [
        Reflux.connect(AdminStore),
        Reflux.connect(ArticleTagStore)
    ],

    _submitSetTag: function(event) {
        event.preventDefault();
        let data = {
            tagList: [ {
                tagName: this.refs.tagName.value,
                artTagUuids: this.refs.artTag.value
            } ]
        };
        Actions.setTags(data);
    },

    _tagArticle: function(uuid, artTag, parentName) {
        console.log("add article uuid " + uuid);
        ArticleTagStore.addPublicTag(artTag.tagName, artTag.rank, null);
    },

    render: function() {
        let publicArts = AdminStore.getPublicArticle();
        let selected = [];
        _.forOwn(publicArts, function(v, artUuid) {
            selected.push(
                <div className="col-sm-6 col-md-6 col-lg-4" key={_.uniqueId("pub-art-selected-")}>
                    {ArticleBox.article(artUuid, this._tagArticle, this)}
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
                    <div className="col-sm-4 col-md-4 col-lg-4">
                        <TagInfo artTag={null}/>
                    </div>
                    {!_.isEmpty(pubTagRender) ? pubTagRender : null}
                </div>

                <form className="smart-form client-form">
                    <header>Admin Set Tags</header>
                    <fieldset>
                        <section>
                            <ErrorView className="form-group alert-danger"/>
                        </section>
                    </fieldset>
                    <fieldset>
                        <section>
                            <label className="label">Tag Name</label>
                            <label className="input">
                                <input name="tagName" ref="tagName"/>
                            </label>
                        </section>
                        <section>
                            <label className="label">ArticleTag Uuid</label>
                            <label className="input">
                                <input name="artTag" ref="artTag"/>
                            </label>
                        </section>
                    </fieldset>
                    <footer>
                        <button className="btn btn-primary" onClick={this._submitSetTag}>Submit</button>
                    </footer>
                </form>
            </div>
        );
    }
});

export default SetTags;
