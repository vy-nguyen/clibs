/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
import _            from 'lodash';
import React        from 'react-mod';
import Mesg         from 'vntd-root/components/Mesg.jsx';
import { VntdGlob } from 'vntd-root/config/constants.js';

export class Answer {
    constructor(data) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this.hasError = false;
        this.evalFn = {
            choice: {
                evalAnswer  : this._evalMultChoice.bind(this),
                renderResult: this._renderMultChoiceRes.bind(this)
            }
        };
        this.retVal = {
            correct: false,
            resText: ''
        };
    }

    setupEntry(entry) {
        if (this.correctChoice === true) {
            entry.errorColor = 'blue';
            entry.errorFlag  = true;

        } else if (this.hasError === true) {
            entry.errorColor = 'red';
            entry.errorFlag  = true;
        }
        return this.hasError;
    }

    evalAnswer() {
        let fn = this.evalFn[this.ansType];

        if (fn != null) {
            return fn.evalAnswer();
        }
        return this.retVal;
    }

    renderResult() {
        let fn = this.evalFn[this.ansType];
        if (fn != null) {
            return fn.renderResult();
        }
        return null;
    }

    _evalMultChoice() {
        let userSelect = this.userSelect || false,
            correct = (this.correctChoice || !userSelect) &&
                        (!this.correctChoice || userSelect);

        this.hasError = !correct;
        this.retVal.correct = correct;
        return this.retVal;
    }

    _renderMultChoiceRes() {
        let ans = (this.correctChoice === true) ?
                "fa fa-lg fa-check-square-o" : "fa fa-lg fa-square-o",
            mark = (this.hasError === false) ?
                ((this.userSelect === true) ?
                    "fa fa-lg fa-check" : "fa fa-lg square-o") : "fa fa-lg fa-times";

        return (
            <span key={_.uniqueId()}>
                <i className={mark}/> | <Mesg text="Correct Answer"/>
                <i className={ans}/> 
                <div style={VntdGlob.styleContent}
                    dangerouslySetInnerHTML={{ __html: this.ansChoice }}/>
            </span>
        );
    }
}

export default Answer;
