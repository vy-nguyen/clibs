/**
 * Written by Vy Nguyen (2016)
 */
'use strict;'

import _       from 'lodash';
import Reflux  from 'reflux';
import Actions from 'vntd-root/actions/Actions.jsx';

let LanguageStore = Reflux.createStore({
    data: {
        langInUse: {
            key  : "us",
            alt  : "USA",
            title: "English"
        },
        languages: [],
        langIndex: {},
        translate: {},
        phrases: {}
    },

    listenables: Actions,

    getData: function() {
        return this.data
    },

    translate: function(text) {
        return this.data.phrases[text] || text;
    },

    onGetLangJsonCompleted: function(key, json) {
        this._setLangTranslation(key, json);
        Actions.translate();
    },

    onSelectCompleted: function(key, json) {
        this._setLangTranslation(key, json);
    },

    onSelectFailed: function(key, json) {
        console.log("lang sel failed");
        console.log(this);
        console.log(key);
        console.log(json);
    },

    onInitCompleted: function(key, phrase) {
        this.data.translate[key] = phrase;
        this.data.phrases = phrase;
        this.trigger(this.data)
    },

    onStartupCompleted: function(json) {
        if (json.languages != null) {
            _.forEach(json.languages, function(lang) {
                this.data.langIndex[lang.key] = lang;
            }.bind(this));

            this.data.languages = json.languages;
            this.trigger(this.data)
        }
    },

    setLanguage: function(key) {
        if (this.data.translate[key] != null) {
            this.data.langInUse = this.data.langIndex[key];
            this.data.phrases = this.data.translate[key];
            this.trigger(this.data);
        } else {
            Actions.getLangJson(key);
        }
    },

    _setLangTranslation: function(key, json) {
        let data = this.data;
        if (data.langIndex[key] != null) {
            data.translate[key] = json;
            data.phrases = json;
            data.langInUse = data.langIndex[key];
            this.trigger(data);
        }
    }
});

export default LanguageStore;

