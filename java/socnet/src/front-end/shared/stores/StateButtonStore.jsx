/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _             from 'lodash';
import Reflux        from 'reflux';
import Actions       from 'vntd-root/actions/Actions.jsx';

let StateButtonStore = Reflux.createStore({
    button: {},
    listenables: [
        Actions
    ],

    init: function() {
        this.button = {};
    },

    getButtonState: function(id, key) {
        let state = this.button[id];
        if (key != null && state != null) {
            return state[key];
        }
        return state;
    },

    changeButton: function(id, disable, text, kval) {
        let state = this.button[id];
        if (state != null) {
            state.disabled = disable;
            state.buttonText = text;
            if (kval != null) {
                _.merge(state, kval);
            }
            this.trigger(this.button);
        }
    },

    toggleButton: function(id) {
        let state = this.button[id];
        if (state != null) {
            state.disabled = !state.disabled;
        }
    },

    saveButtonState: function(id, stateFn) {
        if (this.button[id] == null) {
            this.button[id] = stateFn();
        }
        return this.button[id];
    },

    onButtonChangeCompleted: function(id, state) {
        this.saveButtonState(id, state);
        state.success = true;
        this.trigger(this.button);
    },

    onButtonChangeFailed: function(id, disable, text) {
        let state = this.button[id];
        if (state != null) {
            state.success = false;
            state.disabled = disable;
            state.buttonText = text;
        }
    },

    makeSimpleBtn: function(text, disable, kval) {
        let ret = {
            success   : true,
            disabled  : disable,
            buttonText: text
        };
        if (kval != null) {
            _.merge(ret, kval);
        }
        return ret;
    },

    dumpData: function() {
        console.log(this.button);
    }
});

export default StateButtonStore;
