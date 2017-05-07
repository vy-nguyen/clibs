/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React              from 'react-mod';
import SparklineContainer from 'vntd-shared/graphs/SparklineContainer.jsx';

import TabPanel       from 'vntd-shared/layout/TabPanel.jsx';
import UserStore      from 'vntd-shared/stores/UserStore.jsx';
import AuthorStore    from 'vntd-root/stores/AuthorStore.jsx';
import EStore         from 'vntd-root/pages/e-store/EStore.jsx';
import AdsPromo       from './AdsPromo.jsx';
import AdsReview      from './AdsReview.jsx';
import BusinessMap    from './BusinessMap.jsx';
import BusinessMedia  from './BusinessMedia.jsx';

import { AdsBox, BusinessInfo }    from './AdsBox.jsx';
import { AdsStore, EProductStore } from 'vntd-root/stores/ArticleStore.jsx';

class StoreFeed extends React.Component
{
    constructor(props) {
        let author, tabIdx = 0;

        super(props);
        this._updateState   = this._updateState.bind(this);
        this._updateAuthor  = this._updateAuthor.bind(this);
        this._getAuthorTab  = this._getAuthorTab.bind(this);
        this._getActivePane = this._getActivePane.bind(this);
        this._setActivePane = this._setActivePane.bind(this);

        author = AuthorStore.getAuthorByUuid(props.authorUuid);
        if (author != null) {
            if (author.tabPanelIdx == null) {
                author.tabPanelIdx = 0;
            } else {
                tabIdx = author.tabPanelIdx;
            }
        }
        this.state = {
            author  : author,
            tabIdx  : tabIdx
        }
    }

    componentDidUpdate() {
        this.unsubAds = AdsStore.listen(this._updateState);
        this.unsubAuthor = AuthorStore.listen(this._updateAuthor);
    }

    componentWillUnmount() {
        if (this.unsubAds != null) {
            this.unsubAds();
            this.unsubAds = null;
        }
        if (this.unsubAuthor != null) {
            this.unsubAuthor();
            this.unsubAuthor = null;
        }
    }

    _updateState(data, post, status) {
        console.log(data);
    }

    _updateAuthor(data) {
    }

    _getAuthorTab(uuid) {
        return {
            getActivePane: this._getActivePane,
            setActivePane: this._setActivePane,

            tabItems: [ {
                domId  : 'ads-' + uuid,
                tabText: 'Info',
                tabIdx : 0
            }, {
                domId  : 'ads-map-' + uuid,
                tabText: 'Map',
                tabIdx : 1
            }, {
                domId  : 'ads-media-' + uuid,
                tabText: 'Media',
                tabIdx : 2
            }, {
                domId  : 'ads-promo-' + uuid,
                tabText: 'Promotion',
                tabIdx : 3
            }, {
                domId  : 'ads-review-' + uuid,
                tabText: 'Review',
                tabIdx : 4
            }, {
                domId  : 'bus-estore-' + uuid,
                tabText: 'E-Store',
                tabIdx : 5
            } ]
        };
    }

    _getActivePane() {
        return this.state.tabIdx;
    }

    _setActivePane(index) {
        let author = this.state.author;
        if (author != null) {
            author.tabPanelIdx = index;
        }
        this.setState({
            tabIdx: index
        });
    }

    render() {
        let adsRec = this.props.adsRec,
            ads    = adsRec.artObj,
            userUuid = ads.authorUuid,
            context  = this._getAuthorTab(userUuid);

        return (
            <SparklineContainer>
                <div className="well well-light well-sm">
                    <TabPanel className="padding-top-10" context={context}>
                        <BusinessInfo adsRec={adsRec}/>
                        <BusinessMap adsRec={adsRec} userUuid={userUuid}/>
                        <BusinessMedia adsRec={adsRec} userUuid={userUuid}/>
                        <AdsPromo adsRec={adsRec} userUuid={userUuid}/>
                        <AdsReview adsRec={adsRec} userUuid={userUuid}/>
                        <EStore userUuid={userUuid}/>
                    </TabPanel>
                </div>
            </SparklineContainer>
        )
    }
}

export default StoreFeed;
