'use strict';

import React         from 'react-mod';
import classnames    from 'classnames';
import SmartMenuItem from './SmartMenuItem.jsx';

let SmartMenuList = React.createClass({

    render: function() {
        let {items, ...props} = this.props;
        let menuItem = items.map(function(item) {
            return <SmartMenuItem item={item} key={item._id}/>
        });

        return (
            <ul {...props}>
                {menuItem}
            </ul>
        )
    }
});

export default SmartMenuList
