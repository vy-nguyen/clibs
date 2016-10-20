/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

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
        return <span>{this.state.phrases[this.props.text] || this.props.text}</span>
    }
}

export default Mesg;
