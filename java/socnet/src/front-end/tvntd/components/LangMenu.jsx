/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import React         from 'react-mod';
import Reflux        from 'reflux';
import classnames    from 'classnames';
import Actions       from 'vntd-root/actions/Actions.jsx';
import LanguageStore from 'vntd-root/stores/LanguageStore.jsx';

let LangMenu = React.createClass({

    mixins: [Reflux.connect(LanguageStore)],

    getInitialState: function() {
        return LanguageStore.getData()
    },

    _selectLanguage: function(lang) {
        LanguageStore.setLanguage(lang.key);
        Actions.translate();
    },

    _getFlagIcon: function(lang) {
        return "/rs/img/flags/" + lang.key + ".gif";
    },

    render: function() {
        let langInUse = this.state.langInUse;
        let flagIcon  = "/rs/img/flags/" + langInUse.key + ".gif";
        let languages = this.state.languages;
        let langChoices = languages.map(function(lang, idx) {
            return (
                <li key={'lang-' + idx} className={classnames({active: lang.key == langInUse.key})}>
                    <a onClick={this._selectLanguage.bind(this, lang)}>
                        <img src={this._getFlagIcon(lang)} alt={langInUse.alt}/><span> {lang.title}</span>
                    </a>
                </li>
            );
        }.bind(this));

        return (
            <ul className="header-dropdown-list hidden-xs">
                <li/>
                <li className="dropdown">
                    <a className="dropdown-toggle" href="#"  data-toggle="dropdown">
                        <img src={this._getFlagIcon(langInUse)} alt={langInUse.alt}/>
                        <span> {langInUse.title}</span>
                        <i className="fa fa-angle-down"/>
                    </a>
                    <ul className="dropdown-menu pull-right">
                        {langChoices}
                    </ul>
                </li>
            </ul>
        );
    }
});

export default LangMenu;
