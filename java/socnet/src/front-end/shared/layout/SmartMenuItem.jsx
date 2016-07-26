/**
 * Modified by Vy Nguyen (2016)
 */
'use strict';

import React             from 'react-mod';
import ReactDOM          from 'react-dom';
import Reflux            from 'reflux';
import {Link}            from 'react-router';
import classnames        from 'classnames';
import {findDOMNode}     from 'react-dom';

import NavigationActions from 'vntd-shared/actions/NavigationActions.jsx';
import NavigationStore   from 'vntd-shared/stores/NavigationStore.jsx';
import SmartMenuList     from './SmartMenuList.jsx';

let SmartMenuItem = React.createClass({

    getInitialState: function() {
        return {
            menuSpeed: window.GlobalConfigs.menu_speed || 200
        }
    },

    mixins: [Reflux.connect(NavigationStore)],

    _handleClick: function (e) {
        e.preventDefault();
        NavigationActions.activate(this.props.item);
    },

    _open: function() {
        this._getChildrenListNode().slideDown(this.state.menuSpeed);
    },

    _close: function() {
        this._getChildrenListNode().slideUp(this.state.menuSpeed);
    },

    _getChildrenListNode: function() {
        return $(findDOMNode(this)).find('>ul')
    },

    render: function() {
        let item = this.props.item;
        item.updateState();

        let isOpen = item.isOpen;
        let title = !item.parent ?
            (<span className="menu-item-parent">{item.title}</span>) : item.title;

        let badge = item.badge ?
            <span className={item.badge.class}>{item.badge.label || ''}</span> : null;

        let childItems = item.items ?
            (<SmartMenuList style={{ display: (isOpen ? 'block' : 'none') }} isTop={false} items={item.items}/>) : null;

        let icon = item.icon ?
            (item.counter ? <i className={item.icon}><em>{item.counter}</em></i> : <i className={item.icon}/>) : null;

        let collapseSign = item.items ?
            (isOpen ?
                 (<b className="collapse-sign"><em className="fa fa-minus-square-o"/></b>) :
                 (<b className="collapse-sign"><em className="fa fa-plus-square-o"/></b>)
            ) : null;

        let link = item.route ?
            (<Link to={item.route} title={item.title} onClick={this._handleClick}>{icon} {title} {badge}</Link>) :
            (<a href={item.href || '#'} onClick={this._handleClick} title={item.title}>
                {icon} {title} {badge}{collapseSign}
            </a>);

        let itemClasses = classnames({
            open: isOpen,
            active: item.isActive
        });
        return <li className={itemClasses}>{link}{childItems}</li>
    }
});

export default SmartMenuItem
