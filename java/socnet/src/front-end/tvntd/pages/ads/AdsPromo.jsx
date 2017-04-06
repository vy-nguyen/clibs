/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';

import WidgetGrid      from 'vntd-shared/widgets/WidgetGrid.jsx'
import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import AuthorStore     from 'vntd-root/stores/AuthorStore.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import {AdsStore}      from 'vntd-root/stores/ArticleStore.jsx';
import Mesg            from 'vntd-root/components/Mesg.jsx';

class AdsPromo extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let adsRec = this.props.adsRec,
            ads = adsRec.artObj,
            userUuid = this.props.userUuid;

        return (
            <WidgetGrid className={this.props.className} style={{ height: 'auto' }}>
                <div className="row">
                    <h1>Promotion for {ads.busName}</h1>
                    <h2>Business uuid {userUuid}</h2>
                </div>
            </WidgetGrid>
        );
    }
}

export default AdsPromo;
