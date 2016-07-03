/**
 * Created by griga on 11/30/15.
 * Modified by Vy Nguyen
 */
'use strict';

import React      from 'react-mod';
import Reflux     from 'reflux';
import _          from 'lodash';
import {Link}     from 'react-router';
import classnames from 'classnames';

import SmartMenuList     from './SmartMenuList.jsx';
import NavigationStore   from 'vntd-shared/stores/NavigationStore.jsx';

let SmartMenu = React.createClass({

    mixins:[Reflux.connect(NavigationStore)],

    getInitialState: function() {
        if (this.props.rawItems) {
            NavigationStore.initRawItems(this.props.rawItems)
        }
        return NavigationStore.getData()
    },

    render: function() {
        return (
            <SmartMenuList items={this.state.items} />
        )
    }
});

export default SmartMenu
