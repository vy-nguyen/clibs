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
        this._listStores  = stores;
        this._onClick     = this._onClick.bind(this);
        this._updateState = this._updateState.bind(this);
    }

    componentDidMount() {
        let stores = this._listStores;

        if (stores != null) {
            this.unsub = [];
            if (!Array.isArray(stores)) {
                stores = [this._listStores];
            }
            _.forEach(stores, function(st) {
                if (st != null) {
                    this.unsub.push(st.listen(this._updateState));
                }
            }.bind(this));
        }
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            _.forEach(this.unsub, function(unsub) {
                unsub();
            });
            this.unsub = null;
        }
    }

    getArg() {
        return null;
    }

    // Base onClick handler, used by many sub classes.
    //
    _onClick() {
        if (this.props.onClick != null) {
            this.props.onClick(this.getArg() || this.props);
        }
    }

    _updateState(store, data, item, code) {
        this.setState(this._getState(store, this.props || {}));
    }

    _getState(store, props) {
    }
}

export default ComponentBase;
