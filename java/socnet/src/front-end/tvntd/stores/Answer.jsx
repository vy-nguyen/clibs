/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
import _          from 'lodash';

export class Answer {
    constructor(data) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));
    }
}

export default Answer;
