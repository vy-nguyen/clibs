/**
 * Written by Vy Nguyen (2016)
 */
'use strict;'

import _         from 'lodash';
import Reflux    from 'reflux';
import UserStore from 'vntd-shared/stores/UserStore.jsx';
import Actions   from 'vntd-root/actions/Actions.jsx';

let LanguageStore = Reflux.createStore({
    data: {},
    listenables: Actions,

    init: function() {
        this.data = {
            langInUse: {
                key  : "us",
                alt  : "USA",
                title: "English"
            },
            languages: [],
            langIndex: {},
            retry    : {},
            translate: {
                "us" : {}
            }
        };
        this.data.phrases = this.data.translate;
    },

    getData: function() {
        return this.data
    },

    tooltip: function(mesg, alt) {
        if (UserStore.isLogin()) {
            return this.translate(mesg);
        }
        if (alt == null) {
            return this.translate("Please login first");
        }
        return this.translate(alt);
    },

    tip: function(mesg) {
        return this.data.phrases[mesg] || mesg;
    },

    translate: function(text) {
        return this.data.phrases[text] || text;
    },

    onGetLangJsonCompleted: function(json) {
        this._setLangTranslation(json.cbContext, json);
    },

    onSelectCompleted: function(key, json) {
        this._setLangTranslation(key, json);
    },

    onSelectFailed: function(key, json) {
        console.log("lang sel failed");
    },

    onInitCompleted: function(key, phrase) {
        this.data.translate[key] = phrase;
        this.data.phrases = phrase;
        this.trigger(this.data)
    },

    mainStartup: function(json) {
        if (json.languages != null) {
            _.forEach(json.languages, function(lang) {
                this.data.langIndex[lang.key] = lang;
            }.bind(this));

            this.data.languages = json.languages;
            if (this.data.langIndex['vi'] != null) {
                this.setLanguage('vi');
                return;
            }
            this.trigger(this.data)
        }
    },

    setLanguage: function(key) {
        if (this.data.translate[key] != null) {
            this.data.retry[key] = 0;
            this.data.langInUse = this.data.langIndex[key];
            this.data.phrases = this.data.translate[key];

            // Notify all listeners to trigger the translation.
            Actions.translate();
            this.trigger(this.data);
        } else {
            if (this.data.retry[key] == null) {
                this.data.retry[key] = 0;
            }
            this.data.retry[key]++;
            if (this.data.retry[key] < 4) {
                Actions.getLangJson(key);
            }
        }
    },

    _setLangTranslation: function(key, json) {
        let data = this.data;
        if (data.langIndex[key] != null) {
            data.translate[key] = json;
            data.phrases = json;
            data.langInUse = data.langIndex[key];

            // Notify all listeners to trigger the translation.
            Actions.translate();
            this.trigger(data);
        }
    },

    dumpData: function(text) {
        console.log(text);
        console.log(this.data);
    }
});

export default LanguageStore;

