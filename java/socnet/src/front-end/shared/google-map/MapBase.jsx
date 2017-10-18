/**
 * Refactor code from https://github.com/fullstackreact/google-maps-react
 */
'use strict';

import React     from 'react-mod';
import {Util}    from 'vntd-shared/utils/Enum.jsx';

export const wrappedPromise = function() {
    /* eslint-disable */
    let wPromise = {},
        promise = new Promise(function(resolve, reject) {
            wPromise.resolve = resolve;
            wPromise.reject = reject;
        });
    /* eslint-enable */

    wPromise.then    = promise.then.bind(promise);
    wPromise.catch   = promise.catch.bind(promise);
    wPromise.promise = promise;
    return wPromise;
}

export class MapBase extends React.Component
{
    constructor(props) {
        super(props);
        this._evtListeners = {};
    }

    _handleEvent(evt) {
        let timeout;
        const evtName = `on${Util.camelize(evt)}`

        return (e) => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            timeout = setTimeout(() => {
                if (this.props[evtName]) {
                    this.props[evtName](this.props, this.mapObj, e);
                }
            }, 0);
        }
    }

    _listenEvents(evtNames) {
        evtNames.forEach(e => {
            this._evtListeners[e] = this.mapObj.addListener(e, this._handleEvent(e));
        });
    }

    _unListenEvents(mapObj) {
        if (mapObj != null) {
            Object.keys(this._evtListeners).forEach(e => {
                mapObj.event.removeListener(this._evtListeners[e]);
            });
        }
    }

    render() {
        return null;
    }
}

export default MapBase;
