/**
 * Copyright by Vy Nguyen (2018)
 * BSD License
 */
'use strict';

import _ from 'lodash';
import {createHashHistory} from 'history/lib';

export class RouteMap
{
    constructor(map) {
        let path;

        this.routeMap   = {};
        this.routeArray = map;

        _.forEach(map, function(entry) {
            path = this._getPathKey(entry.path);
            this.routeMap[path] = entry;
        }.bind(this));
    }

    _getPathKey(path) {
        let p = path.split('/');

        if (p.length > 1) {
            if (p[0] === "") {
                return p[1] || "";
            }
            return p[0];
        }
        return "";
    }

    getRouteKey(path) {
        let p = this._getPathKey(path), entry = this.routeMap[p];

        if (entry != null) {
            return entry.key;
        }
        return "Home";
    }
}

export default createHashHistory({queryKey: false});
