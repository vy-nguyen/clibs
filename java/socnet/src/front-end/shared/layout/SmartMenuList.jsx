/**
 * Vy Nguyen (2016)
 */
'use strict';

import React         from 'react-mod';
import SmartMenuItem from './SmartMenuItem.jsx';

class SmartMenuList extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
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
}

export default SmartMenuList;
