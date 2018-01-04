/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import _                   from 'lodash';
import React               from 'react-mod';

class ComponentBase extends React.Component
{
    constructor(props, id, stores) {
        super(props);

        this.id = id || props.id || _.uniqueId();
        this._listStores = stores;
    }

    componentDidMount() {
        let stores = this._listStores;

        this.unsub = [];
        if (!Array.isArray(stores)) {
            stores = [this._listStores];
        }
        _.forEach(stores, function(st) {
            this.unsub.push(st.listen(this._updateState.bind(this, st))); 
        }.bind(this));
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            _.forEach(this.unsub, function(unsub) {
                unsub();
            });
            this.unsub = null;
        }
    }

    _updateState(store, data, item, code) {
    }
}

export default ComponentBase;
