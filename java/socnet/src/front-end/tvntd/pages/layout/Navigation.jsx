/**
 * Created by griga on 11/24/15.
 * Modified Vy Nguyen (2016)
 */
'use strict';

import React from 'react-mod';

import LoginInfo   from 'vntd-shared/layout/LoginInfo.jsx';
import SmartMenu   from 'vntd-shared/layout/SmartMenu.jsx';
import MinifyMenu  from 'vntd-shared/layout/MinifyMenu.jsx';
import RenderStore from 'vntd-root/stores/RenderStore.jsx';

// import AsideChat from '../../components/chat/components/AsideChat.jsx'

let rawItems = require('json!../../config/menu-items.json').items;

// <AsideChat />
let Navigation = React.createClass({

    render: function() {
        return (
<aside id="left-panel">
    <LoginInfo />
        <nav>
            <SmartMenu rawItems={rawItems} />
        </nav>
    <MinifyMenu />
</aside>
        )
    }
});

export default Navigation
