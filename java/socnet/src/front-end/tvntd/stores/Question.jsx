/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
import _          from 'lodash';

export class Question {
    constructor(data) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));
    }

    compareQuestion(anchor, elm) {
        return anchor.order - elm.order;
    }
}

export default Question;
