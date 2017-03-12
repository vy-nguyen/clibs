/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod'
import Actions         from 'vntd-root/actions/Actions.jsx';
import TabPanel        from 'vntd-shared/layout/TabPanel.jsx';
import DynamicTable    from 'vntd-root/components/DynamicTable.jsx';
import Lang            from 'vntd-root/stores/LanguageStore.jsx';
import AdminStore      from 'vntd-root/stores/AdminStore.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import Mesg            from 'vntd-root/components/Mesg.jsx';
import ArticleTagBrief from 'vntd-root/components/ArticleTagBrief.jsx';

class TagListing extends React.Component
{
    constructor(props) {
        super(props);

        this._submitChanges = this._submitChanges.bind(this);
        this._getTagHeader  = this._getTagHeader.bind(this);
        this._getTagFooter  = this._getTagFooter.bind(this);
        this._cloneTabRow   = this._cloneTabRow.bind(this);
    }

    _submitChanges(changes) {
        console.log("Submit change");
        console.log(changes);
        Actions.setTags({
            publicTags : changes,
            deletedTags: []
        });
    }

    _getEditForm() {
    }

    _getTagHeader() {
        const tagTab = [ {
            key   : "tagName",
            format: "fa fa-tags",
            header: Lang.translate("Tag Name")
        }, {
            key   : "parentTag",
            format: "fa fa-tags",
            header: Lang.translate("Parent Tag")
        }, {
            key   : "tagKind",
            format: "",
            header: Lang.translate("Tag Kind")
        }, {
            key   : "rankScore",
            format: "fa fa-tags",
            header: Lang.translate("Tag Rank")
        }, {
            key   : "ownerUuid",
            format: "fa fa-user",
            header: Lang.translate("Owner")
        } ];
        return tagTab;
    }

    _cloneTabRow(row, count) {
        return ArticleTagStore.cloneTagTableRow(row, count);
    }

    _getTagFooter() {
        return (
            <footer>
                <button className="btn btn-primary pull-right"
                    onClick={this._submitChanges}>
                    <Mesg text="Save Changes"/>
                </button>
            </footer>
        );
    }

    render() {
        let tab = ArticleTagStore.getTagTableData(true, this.props.tagKind);
        // let tab = ArticleTagStore.getTagTableData(true, null);
        const footer = [ {
            format : "btn btn-primary pull-right",
            title  : "Save Changes",
            onClick: this._submitChanges
        } ];
        return (
            <DynamicTable tableFormat={this._getTagHeader()} tableData={tab}
                tableTitle={Lang.translate("Tag Listing")} edit={true}
                tableFooter={footer} cloneRow={this._cloneTabRow}
                tableId={_.uniqueId('tag-list-')}
            />
        );
    }
}

class MainAds extends React.Component
{
    constructor(props) {
        let mode = props.params.blog;
        super(props);
        this.state = {
            tabIdx : 0,
            pubMode: mode,
            pubTags: ArticleTagStore.getAllPublicTags(true, mode)
        };
        this._getAdsTab     = this._getAdsTab.bind(this);
        this._updateState   = this._updateState.bind(this);
        this._getActivePane = this._getActivePane.bind(this);
        this._setActivePane = this._setActivePane.bind(this);

        this._renderPostAds    = this._renderPostAds.bind(this);
        this._renderFeatureAds = this._renderFeatureAds.bind(this);
        this._renderYellowPage = this._renderYellowPage.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let mode = nextProps.params.blog;
        this.state = {
            pubMode: mode,
            pubTags: ArticleTagStore.getAllPublicTags(true, mode)
        };
    }

    componentDidMount() {
        this.unsub = ArticleTagStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(data) {
        let mode = this.props.params.blog;
        this.setState({
            pubMode: mode,
            pubTags: ArticleTagStore.getAllPublicTags(true, mode)
        });
    }

    _getActivePane() {
        return this.state.tabIdx;
    }

    _setActivePane(index) {
        this.setState({
            tabIdx: index
        });
    }

    _getAdsTab(mode) {
        return {
            getActivePane: this._getActivePane,
            setActivePane: this._setActivePane,

            tabItems: [ {
                domId  : 'ad-feature',
                tabText: Lang.translate('Feature Ads'),
                tabIdx : 0
            }, {
                domId  : 'ad-list',
                tabText: Lang.translate('Yellow Page'),
                tabIdx : 1
            }, {
                domId  : 'post-ads',
                tabText: Lang.translate('Post Your Ads'),
                tabIdx : 2
            } ]
        };
    }

    _renderFeatureAds() {
        return <h1>Feature Ads</h1>
    }

    _renderYellowPage() {
        return <TagListing tagKind="ads"/>
    }

    _renderPostAds() {
        return <h1>Post Ads</h1>
    }

    render() {
        let tabData = this._getAdsTab(this.props.mode);
        return (
            <div id="content">
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <TabPanel className="padding-top-10" context={tabData}>
                            {this._renderFeatureAds()}
                            {this._renderYellowPage()}
                            {this._renderPostAds()}
                        </TabPanel>
                    </div>
                </div>
            </div>
        )
    }
}

export default MainAds;
