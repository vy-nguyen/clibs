/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _             from 'lodash';
import Reflux        from 'reflux';
import Actions       from 'vntd-root/actions/Actions.jsx';
import NavActions    from 'vntd-shared/actions/NavigationActions.jsx';

class ButtonState {
    /*
     * Mandatory formats:
     * kval = {
     *    "startState": "success", // optional to specify the start state.
     *    "success": { "text": "...", "disabled": true|false, "nextState": "xx" },
     *    "failure": { "text": "...", "disabled": true|false, "nextState": "xx" }
     * }
     */
    constructor(kval, btnId, startState) {
        _.forEach(kval, function(v, k) {
            if (k === "startState" && typeof v === "string") {
                startState = v;
            } else {
                this[k] = v;
            }
        }.bind(this));

        this.callTrigger = this.callTrigger.bind(this);

        this._id       = _.uniqueId('button-state-');
        this.btnId     = btnId;
        this.trigger   = false;
        this.currState = startState == null ? "success" : startState;
        this.prevState = null;
    }

    getBtnId() {
        return this.btnId;
    }

    getState() {
        return this[this.currState];
    }

    getText() {
        let state = this.getState();
        return state.text;
    }

    changeStateInfo(text, disabled) {
        let state;

        if (text != null) {
            state = this.getState();
            state.text = text;
            state.disabled = disabled === true ? true : false;
            console.log("Change state to " + text);
            console.log(state);
        }
    }

    getStateValue(key) {
        let state = this.getState();
        return state[key];
    }

    getValue(key) {
        return this[key];
    }

    setKeyValue(key, value) {
        if (this[key] != null) {
            _.merge(this[key], value);
        } else {
            this[key] = value;
        }
    }

    getStateCode() {
        return this.currState;
    }

    getClassFmt() {
        let state = this.getState();
        if (state == null) {
            console.log(this);
            console.log(this.currState);
        }
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
        if (state === this.currState) {
            return;
        }
        this.trigger   = false;
        this.prevState = this.currState;
        this.currState = state;

        if (this[state] != null && this[state].triggerFn != null) {
            this[state].triggerFn(this[state], this.btnId, this.prevState);
        }
    }

    callTrigger(callback) {
        let state;

        if (this.trigger === true) {
            this.trigger = false;
            state = this[this.currState];
            if (state != null && state.triggerFn != null) {
                state.triggerFn(callback, this.btnId, this.prevState, state);
            }
        }
    }

    setNextState() {
        let state = this[this.currState];
        if (state.nextState != null) {
            this.setState(state.nextState);
        }
        return this;
    }
}

let StateButtonStore = Reflux.createStore({
    button: {},
    listenables: [
        Actions,
        NavActions
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
        if (btnState != null) {
            return this.setButtonStateObj(btnState, state);
        }
        return null;
    },

    setButtonStateObj: function(btnState, state) {
        if (state != null) {
            btnState.setState(state);
            this.trigger(btnState);
        }
        return btnState;
    },

    setStateKeyVal: function(id, key, value) {
        let btnState = this.button[id];
        if (btnState != null) {
            btnState.setKeyValue(key, value);
        }
        return btnState;
    },

    setNextButtonState: function(btnState) {
        let state = btnState.setNextState();
        this.trigger(btnState);
        return state;
    },

    goNextState: function(id, input) {
        let btnState = this.button[id];
        if (btnState != null) {
            btnState.setNextState();
            this.trigger(btnState);
        }
        return btnState;
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
        let btnState = this.setButtonState(id, "success");
        this.trigger(btnState);
        return btnState;
    },

    onButtonChangeFailed: function(id, disable, text) {
        let btnState = this.setButtonState(id, "failure");
        this.trigger(btnState);
        return btnState;
    },

    dumpData: function() {
        console.log(this.button);
    }
});

export default StateButtonStore;
