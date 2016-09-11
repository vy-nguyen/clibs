/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux        from 'reflux';
import _             from 'lodash';
import Actions       from 'vntd-root/actions/Actions.jsx';

let StateButtonStore = Reflux.createStore({
    data: {},
    listenables: [
        Actions
    ],

    init: function() {
        this.data = {
            button: {}
        }
    },

    getButtonState: function(id) {
        return this.data.button[id];
    },

    changeButton: function(id, disable, text) {
        let state = this.data.button[id];
        if (state != null) {
            state.disabled = disable;
            state.buttonText = text;
            this.trigger(state);
        }
    },

    toggleButton: function(id) {
        let state = this.data.button[id];
        if (state != null) {
            state.disabled = !state.disabled;
        }
    },

    saveButtonState: function(id, stateFn) {
        if (this.data.button[id] == null) {
            this.data.button[id] = stateFn();
        }
    },

    onButtonChangeCompleted: function(id, state) {
        this.saveButtonState(id, state);
        state.success = true;
        this.trigger(state);
    },

    onButtonChangeFailed: function(id, disable, text) {
        let state = this.data.button[id];
        if (state != null) {
            state.success = false;
            state.disabled = disable;
            state.buttonText = text;
        }
    },

    makeSimpleBtn: function(text, disable) {
        return {
            success   : true,
            disabled  : disable,
            buttonText: text
        }
    }
});

export default StateButtonStore;
