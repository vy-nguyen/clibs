/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _             from 'lodash';
import Reflux        from 'reflux';
import Actions       from 'vntd-root/actions/Actions.jsx';

class ButtonState {
    /*
     * Mandatory formats:
     * kval = {
     *    "success": { "text": "...", "disabled": true|false, "nextState": "xx" },
     *    "failure": { "text": "...", "disabled": true|false, "nextState": "xx" }
     * }
     */
    constructor(kval, btnId, startState) {
        _.forEach(kval, function(v, k) {
            this[k] = v;
        }.bind(this));

        this._id       = _.uniqueId('button-state-');
        this.btnId     = btnId;
        this.currState = startState == null ? "success" : startState;
        this.prevState = null;
    }

    getState() {
        return this[this.currState];
    }

    getText() {
        let state = this.getState();
        return state.text;
    }

    getStateValue(key) {
        let state = this.getState();
        return state[key];
    }

    getValue(key) {
        return this[key];
    }

    getStateCode() {
        return this.currState;
    }

    getClassFmt() {
        let state = this.getState();
        let className = state.className != null ? state.className : "btn btn-default";

        if (state.disabled != null && state.disabled == true) {
            return className + " disabled";
        }
        return className;
    }

    isDisabled() {
        let state = this.getState();
        if (state != null) {
            return state.disabled == null ? false : state.disabled;
        }
        return false;
    }

    isInState(state) {
        return state === this.currState;
    }

    setState(state) {
        this.prevState = this.currState;
        this.currState = state;

        let btnState = this[this.currState];
        if (btnState != null && btnState.triggerFn != null) {
            btnState.triggerFn(this.btnId, this.prevState, state);
        }
    }

    setNextState() {
        let state = this[this.currState];
        if (state.nextState != null) {
            this.setState(state.nextState);
        }
    }
}

let StateButtonStore = Reflux.createStore({
    button: {},
    listenables: [
        Actions
    ],

    init: function() {
        this.button = {};
    },

    getButtonState: function(id) {
        return this.button[id];
    },

    getButtonStateKey: function(id, key) {
        let btnState = this.button[id];
        if (btnState != null) {
            return btnState.getValue(key);
        }
        return null;
    },

    setButtonState: function(id, state) {
        let btnState = this.button[id];
        if (state != null && btnState != null) {
            btnState.setState(state);
            this.trigger(this.button);
        }
        return btnState;
    },

    setNextButtonState: function(btnState) {
        btnState.setNextState();
        this.trigger(this.button);
    },

    goNextState: function(id, input) {
        let btnState = this.button[id];
        if (btnState != null) {
            btnState.setNextState();
            this.trigger(this.button);
        }
    },

    isButtonInState: function(id, state) {
        let btnState = this.button[id];
        if (btnState != null) {
            return btnState.isInState(state);
        }
        return false;
    },

    createButton: function(id, createFn, start) {
        if (this.button[id] == null) {
            this.button[id] = new ButtonState(createFn(), id, start);
        }
        return this.button[id];
    },

    onButtonChangeCompleted: function(id) {
        return this.setButtonState(id, "success");
    },

    onButtonChangeFailed: function(id, disable, text) {
        return this.setButtonState(id, "failure");
    },

    dumpData: function() {
        console.log(this.button);
    }
});

export default StateButtonStore;
