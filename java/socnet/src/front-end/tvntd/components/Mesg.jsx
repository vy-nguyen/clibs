/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import React   from 'react-mod';
import Reflux  from 'reflux';

import LanguageStore from 'vntd-root/stores/LanguageStore.jsx';

let Mesg = React.createClass({
    mixins: [Reflux.connect(LanguageStore)],

    getInitialState: function() {
        return LanguageStore.getData();
    },

    render: function() {
        return <span>{this.state.phrases[this.props.text] || this.props.text}</span>
    }
});

export default Mesg;
