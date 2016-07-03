/**
 * Created by griga on 11/24/15.
 * Modified Vy Nguyen (2016)
 */
'use strict';

import React       from 'react-mod';
import Reflux      from 'reflux';

import LoginInfo   from 'vntd-shared/layout/LoginInfo.jsx';
import SmartMenu   from 'vntd-shared/layout/SmartMenu.jsx';
import MinifyMenu  from 'vntd-shared/layout/MinifyMenu.jsx';
import RenderStore from 'vntd-root/stores/RenderStore.jsx';

// import AsideChat from '../../components/chat/components/AsideChat.jsx'

let Navigation = React.createClass({

    mixins: [
        Reflux.connect(RenderStore)
    ],

    getInitialState: function() {
        return {
            menuItems: {
                items: []
            }
        };
    },

    componentDidMount: function() {
        this.listenTo(RenderStore, this._updateMenu);
    },

    _updateMenu: function(json) {
        this.setState({
            menuItems: json
        });
    },

    render: function() {
        return (
            <aside id="left-panel">
                <LoginInfo />
                <nav>
                    <SmartMenu rawItems={this.state.menuItems} />
                </nav>
                <MinifyMenu />
            </aside>
        )
    }
});

export default Navigation
