import React         from 'react-mod'
import classnames    from 'classnames'
import SmartMenuItem from './SmartMenuItem.jsx'

let SmartMenuList = React.createClass({
    render: function() {
        let {items, ...props} = this.props;
        let menu_item = items.map(function(item) {
            return <SmartMenuItem item={item} key={item._id}/>
        }.bind(this));

        return (
            <ul {...props}>
                {menu_item}
            </ul>
        )
    }
});

export default SmartMenuList
