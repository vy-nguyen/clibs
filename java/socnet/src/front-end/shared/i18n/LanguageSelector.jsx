import React           from 'react-mod'
import Reflux          from 'reflux'
import classnames      from 'classnames'
import LanguageActions from './LanguageActions'
import LanguageStore   from './LanguageStore'

let LanguageSelector = React.createClass({
    getInitialState: function(){
        return LanguageStore.getData()
    },
    mixins: [Reflux.connect(LanguageStore)],

    componentWillMount: function() {
        LanguageActions.init();
    },

    render: function () {
        let languages = this.state.languages;
        let language = this.state.language;
        let selector = languages.map(function(lang, idx) {
            return (
                <li key={idx} className={classNames({ active: lang.key == language.key })}>
                    <a href="#" onClick={tihs._selectLanguage.bind(this, lang)}>
                        <img src="/rs/styles/blank.gif"
                            className={classnames(['flag', 'flag-' + lang.key])} alt={lang.alt}/>
                        <span>&nbsp;{lang.title}</span>
                    </a>
                </li>
            ).bind(this);
        });
        return (
            <ul className="header-dropdown-list hidden-xs ng-cloak">
                <li className="dropdown">
                    <a className="dropdown-toggle" href="#"  data-toggle="dropdown">
                        <img src="styles/img/blank.gif"
                             className={classnames(['flag', 'flag-'+language.key])} alt={language.alt} />
                        <span>&nbsp;{language.title}&nbsp;</span>
                        <i className="fa fa-angle-down" /></a>
                    <ul className="dropdown-menu pull-right">
                        {selector}
                    </ul>
                </li>
            </ul>
        )
    },

    _selectLanguage: function(language) {
        LanguageStore.setLanguage(language)
        LanguageActions.select(language)
    }
});

export default LanguageSelector
