/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import React           from 'react-mod';
import Mesg            from 'vntd-root/components/Mesg.jsx';
import { AdsStore }    from 'vntd-root/stores/ArticleStore.jsx';

class AdsBase extends React.Component
{
    constructor(props) {
        super(props);
        this._updateAds = this._updateAds.bind(this);
    }

    componentDidMount() {
        this.unsub = AdsStore.listen(this._updateAds);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateAds(data) {
    }
}

export default AdsBase;
