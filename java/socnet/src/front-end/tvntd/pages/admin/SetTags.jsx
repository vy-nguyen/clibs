/**
 * Vy Nguyen (2016)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';

import ErrorView          from 'vntd-shared/layout/ErrorView.jsx';
import Actions            from 'vntd-root/actions/Actions.jsx';
import AdminStore         from 'vntd-root/stores/AdminStore.jsx';
import ArticleTagStore    from 'vntd-root/stores/ArticleTagStore.jsx';
import ArticleBox         from 'vntd-root/components/ArticleBox.jsx';
import TagInfo            from 'vntd-root/components/TagInfo.jsx';
import ArticleTagBrief    from 'vntd-root/components/ArticleTagBrief.jsx';
import Mesg               from 'vntd-root/components/Mesg.jsx';
import ListTags           from './ListTags.jsx';

class SetTags extends React.Component
{
    constructor(props) {
        super(props);
        this._updateAdmin   = this._updateAdmin.bind(this);
        this._updateArtTag  = this._updateArtTag.bind(this);
        this._tagArticle    = this._tagArticle.bind(this);
        this._renderTagInfo = this._renderTagInfo.bind(this);

        this.state = {
            publicArts: AdminStore.getPublicArticle()
        };
    }

    componentDidMount() {
        this.unsubAdmin  = AdminStore.listen(this._updateAdmin);
        this.unsubArtTag = ArticleTagStore.listen(this._updateArtTag);
    }

    componentWillUnmount() {
        if (this.unsubAdmin != null) {
            this.unsubAdmin();
            this.unsubArtTag();
            this.unsubAdmin  = null;
            this.unsubArtTag = null;
        }
    }

    _updateAdmin(data) {
        this.setState({
            publicArts: AdminStore.getPublicArticle()
        });
    }

    _updateArtTag(data) {
        this.setState({
        });
    }

    /*
     * Tag articles to publish to public space.
     */
    _tagArticle(uuid, artRank) {
        ArticleTagStore.addPublicTag(artRank, null, uuid);
    }

    _renderTagInfo(artTag) {
        return (
            <div className="col-sm-4 col-md-4 col-lg-4" key={_.uniqueId('pub-tag-')}>
                <TagInfo artTag={artTag}/>
            </div>
        );
    }

    static getBtnFormat(articleUuid) {
        if (ArticleTagStore.hasPublishedArticle(articleUuid) == true) {
            return {
                btnClass: "btn btn-success disabled",
                btnText : "Article Added"
            }
        }
        return {
            btnClass: "btn btn-success",
            btnText : "Add Article"
        }
    }

    render() {
        let selected = [], publicArts = this.state.publicArts;
        const clickCb = {
            getBtnFormat: SetTags.getBtnFormat,
            clickHandler: this._tagArticle,
            callbackArg : this
        };

        _.forOwn(publicArts, function(v, artUuid) {
            clickCb.articleUuid = artUuid;
            selected.push(
                <div className="col-sm-6 col-md-6 col-lg-4"
                    key={_.uniqueId("pub-art-selected-")}>
                    {ArticleBox.article(artUuid, clickCb)}
                </div> 
            )
        }.bind(this));

        return (
            <div id="content">
                <section id="widget-grid" className="">
                    <div className="row">
                        {selected}
                    </div>
                </section>
                <ListTags tagKind={null}/>
                {ArticleTagBrief.renderModifyPublicTags()}
            </div>
        );
    }
}

export default SetTags;
