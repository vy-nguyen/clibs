/**
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import React            from 'react-mod';

import SelectChoices    from 'vntd-shared/component/SelectChoices.jsx';
import EditorPost       from 'vntd-shared/forms/commons/EditorPost.jsx';
import QuestionStore    from 'vntd-root/stores/QuestionStore.jsx';
import Mesg             from 'vntd-root/components/Mesg.jsx';
import EStorePost       from 'vntd-root/pages/e-store/EStorePost.jsx';
import PostAds          from 'vntd-root/pages/ads/PostAds.jsx';
import AdsRoomRenting   from 'vntd-root/pages/ads/AdsRoomRenting.jsx';
import PostQuestionare  from './PostQuestionare.jsx';

class SubmitPost extends React.Component
{
    constructor(props) {
        super(props);
        this.selection = [ {
            label: <Mesg text="Post Article"/>,
            value: "article",
            component: <EditorPost/>
        }, {
            label: <Mesg text="Post Product"/>,
            value: "product",
            component: <EStorePost/>
        }, {
            label: <Mesg text="Post Education Lesson"/>,
            value: "education",
            component: <PostQuestionare listStore={QuestionStore}/>
        }, {
            label: <Mesg text="Post Business Ads"/>,
            value: "busads",
            component: <PostAds/>
        }, {
            label: <Mesg text="Post Rommsharing Ads"/>,
            value: "roomads",
            component: <AdsRoomRenting/>
        } ];
    }

    render() {
        return (
            <SelectChoices id="post-article" selectOpt={this.selection} noSort={true}/>
        );
    }
}

export default SubmitPost;
