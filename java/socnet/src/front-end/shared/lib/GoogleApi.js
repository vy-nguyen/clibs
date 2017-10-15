// https://github.com/fullstackreact/google-maps-react
//
'use strict';

import invariant from 'invariant'

export const GoogleApi = function(opts) {
    opts = opts || {}
    invariant(opts.hasOwnProperty('apiKey'),
              'You must pass an apiKey to use GoogleApi');

    const url = function() {
        let url = 'https://maps.googleapis.com/maps/api/js';
        let params = {
            key      : opts.apiKey,
            callback : 'CALLBACK_NAME',
            libraries: (opts.libraries || ['places']).join(','),
            client   : opts.client,
            v        : opts.version || '3',
            channel  : null,
            language : opts.language,
            region   : null 
        }
        let paramStr = Object.keys(params)
            .filter(k => !!params[k])
            .map(k => `${k}=${params[k]}`)
            .join('&');

        return `${url}?${paramStr}`;
    }
    return url();
}

export default GoogleApi
