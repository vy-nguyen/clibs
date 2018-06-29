/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod'

import Actions          from 'vntd-root/actions/Actions.jsx';
import TabPanel         from 'vntd-shared/layout/TabPanel.jsx';
import GoogleApi        from 'vntd-shared/lib/GoogleApi.js';
import SelectComp       from 'vntd-shared/component/SelectComp.jsx';

import Mesg             from 'vntd-root/components/Mesg.jsx';
import EtherCrumbs      from 'vntd-root/pages/wall/EtherCrumbs.jsx';
import YellowPage       from './YellowPage.jsx';
import PostAds          from './PostAds.jsx';
import FeatureAds       from './FeatureAds.jsx';
import AdsRoomRenting   from './AdsRoomRenting.jsx';

class PostAdChoices extends React.Component
{
    constructor(props) {
        super(props);
        this.selection = {
            selOpt: [ {
                value: "bus",
                label: "Post Business Ads",
                selFn: this._postBusAds
            }, {
                value: "room",
                label: "Post Roomsharing",
                selFn: this._postRoomAds
            } ]
        };
    }

    _postBusAds() {
        return <PostAds/>;
    }

    _postRoomAds() {
        return <AdsRoomRenting/>;
    }

    render() {
        return <SelectComp id="post-ads" selectOpt={this.selection}/>;
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
        };
        this._getAdsTab     = this._getAdsTab.bind(this);
        this._updateState   = this._updateState.bind(this);
        this._getActivePane = this._getActivePane.bind(this);
        this._setActivePane = this._setActivePane.bind(this);

        this._renderFeatureAds = this._renderFeatureAds.bind(this);
        this._renderYellowPage = this._renderYellowPage.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let mode = nextProps.params.blog;
        this.state = {
            pubMode: mode,
        };
    }

    componentDidMount() {
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
                tabText: <Mesg text='Maps'/>,
                tabIdx : 0
            }, {
                domId  : 'ad-list',
                tabText: <Mesg text='Yellow Page'/>,
                tabIdx : 1
            }, {
                domId  : 'share-room',
                tabText: <Mesg text='Post Ads'/>,
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

    _renderRentAds() {
        return <PostAdChoices/>;
    }

    render() {
        let tabData = this._getAdsTab(this.props.mode);
        return (
            <div id="content">
                <EtherCrumbs id="route-map" crumb="Ads" route="/public/ads"/>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <TabPanel className="padding-top-10" context={tabData}>
                            {this._renderFeatureAds()}
                            {this._renderYellowPage()}
                            {this._renderRentAds()}
                        </TabPanel>
                    </div>
                </div>
            </div>
        )
    }
}

export default MainAds;
