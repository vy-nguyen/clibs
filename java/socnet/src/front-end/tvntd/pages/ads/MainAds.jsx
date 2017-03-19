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
import YellowPage      from './YellowPage.jsx';
import PostAds         from './PostAds.jsx';
import FeatureAds      from './FeatureAds.jsx';

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
        return <FeatureAds/>
    }

    _renderYellowPage() {
        return <YellowPage/>
    }

    _renderPostAds() {
        return <PostAds/>
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
