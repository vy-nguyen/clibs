/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import _                   from 'lodash';
import Reflux              from 'reflux';
import React               from 'react-mod';

import BaseElement         from 'vntd-shared/stores/BaseElement.jsx';

class ComponentBase extends React.Component
{
    constructor(props, id, stores) {
        super(props);

        this.id = id || props.id || _.uniqueId();
        this._listStores  = stores;
        this._onClick     = this._onClick.bind(this);
        this._updateState = this._updateState.bind(this);
        this._updateStateBase = this._updateStateBase.bind(this);
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
                    this.unsub.push(st.listen(this._updateStateBase));
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

    _updateStateBase(store, data, item, code) {
        let arg;

        if (store instanceof BaseElement) {
            arg = store;

        } else if (store instanceof Reflux.Store) {
            arg = new BaseElement({
                store : store,
                data  : data,
                item  : item,
                where : code
            });
        } else {
            arg = new BaseElement({
                store : null,
                data  : store,
                item  : data,
                where : item
            });
        }
        arg.mesg  = data.mesg;
        arg.error = data.error;
        this._updateState(arg, data, item, code);
    }

    _updateState(store, data, item, code) {
        this.setState(this._getState(store, this.props || {}));
    }

    _getState(store, props) {
    }
}

export default ComponentBase;
