/*
 * Written by Vy Nguyen (2017)
 */
'use strict';

import React           from 'react-mod';
import Spinner         from 'react-spinjs';
import {VntdGlob}      from 'vntd-root/config/constants.js';

class WebUtils
{
    constructor() {
        this.curretTime = (new Date()).getTime();
    }

    static spinner() {
        return <Spinner config={VntdGlob.spinner}/>;
    }
}

class SeqContainer
{
    constructor() {
        this.curr = 0;
        this.dict = {}
    }

    push(data) {
        let curr = this.curr.toString();

        this.dict[curr] = data;
        this.curr = this.curr + 1;
        return curr;
    }

    getItem(pos) {
        return this.dict[pos];
    }

    getItems() {
        return this.dict;
    }

    getItemCount() {
        return this.curr;
    }
}

export default WebUtils;
export { WebUtils, SeqContainer }
