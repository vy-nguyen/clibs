/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';

import WidgetGrid      from 'vntd-shared/widgets/WidgetGrid.jsx'
import Mesg            from 'vntd-root/components/Mesg.jsx';
import PostComment     from 'vntd-root/components/PostComment.jsx';

class AdsReview extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let adsRec = this.props.adsRec,
            ads    = adsRec.artObj,
            userUuid = this.props.userUuid;

        return (
            <WidgetGrid className={this.props.className} style={{ height: 'auto' }}>
                <div className="row">
                    <h1>Review for {ads.busName}</h1>
                    <PostComment articleUuid={ads.articleUuid}/>
                </div>
            </WidgetGrid>
        )
    }
}

export default AdsReview;
