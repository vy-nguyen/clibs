/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _              from 'lodash';
import {insertSorted} from 'vntd-shared/utils/Enum.jsx';

class BaseStore
{
    constructor() {
    }

    static compareByArt(t1, t2) {
        let l1 = t1.sortedArts != null ? t1.sortedArts.length : 0,
            l2 = t2.sortedArts != null ? t2.sortedArts.length : 0;
        return l2 - l1;
    }

    static sortTagByArticles(tagList) {
        let out = [];
        _.forEach(tagList, (tag) => {
            insertSorted(tag, out, BaseStore.compareByArt);
        });
        console.log(out);
        return out;
    }
}

export default BaseStore
