/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import _       from 'lodash';
import React   from 'react-mod';

import LanguageStore from 'vntd-root/stores/LanguageStore.jsx';

class Mesg extends React.Component
{
    constructor(props) {
        super(props);
        this.state = LanguageStore.getData();
        this._onLangChange = this._onLangChange.bind(this);
    }

    componentDidMount() {
        this.unsub = LanguageStore.listen(this._onLangChange);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _onLangChange(data) {
        if (this.state.langInUse.key != data.key) {
            this.setState(LanguageStore.getData());
        }
    }

    render() {
        let out, text = this.props.text, trans = this.state.phrases;

        if (text == null) {
            return null;
        }
        if (text.constructor !== Array) {
            return <span>{trans[text] || text}</span>;
        }
        out = [];
        _.forEach(text, function(t) {
            out.push(<span key={_.uniqueId('mesg-')}>{trans[t] || t}</span>);
            out.push(<br/>);
        });
        return <div>{out}</div>
    }
}

export default Mesg;
