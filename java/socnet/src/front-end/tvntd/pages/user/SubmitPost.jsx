/**
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import React            from 'react-mod';

import SelectComp       from 'vntd-shared/component/SelectComp.jsx';
import EditorPost       from 'vntd-shared/forms/commons/EditorPost.jsx';
import Mesg             from 'vntd-root/components/Mesg.jsx';
import EStorePost       from 'vntd-root/pages/e-store/EStorePost.jsx';
import PostAds          from 'vntd-root/pages/ads/PostAds.jsx';
import AdsRoomRenting   from 'vntd-root/pages/ads/AdsRoomRenting.jsx';
import PostQuestionare  from './PostQuestionare.jsx';

class SubmitPost extends React.Component
{
    constructor(props) {
        super(props);
        this.selection = {
            selOpt: [ {
                label: <Mesg text="Post Article"/>,
                value: "article",
                selFn: this._postArticle
            }, {
                label: <Mesg text="Post Product"/>,
                value: "product",
                selFn: this._postProduct
            }, {
                label: <Mesg text="Post Education Lesson"/>,
                value: "education",
                selFn: this._postEdu
            }, {
                label: <Mesg text="Post Business Ads"/>,
                value: "busads",
                selFn: this._postBusAds
            }, {
                label: <Mesg text="Post Rommsharing Ads"/>,
                value: "roomads",
                selFn: this._postRoomAds
            } ]
        };
    }

    _postArticle() {
        return <EditorPost/>;
    }

    _postProduct() {
        return <EStorePost/>;
    }

    _postEdu() {
        return <PostQuestionare/>;
    }

    _postBusAds() {
        return <PostAds/>;
    }

    _postRoomAds() {
        return <AdsRoomRenting/>;
    }

    render() {
        return <SelectComp id="post-article" selectOpt={this.selection}/>;
    }
}

export default SubmitPost;
