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

import Msg               from '../i18n/Msg.jsx';
import SmartMenuList     from './SmartMenuList.jsx';
import NavigationActions from 'vntd-shared/actions/NavigationActions.jsx';
import NavigationStore   from 'vntd-shared/stores/NavigationStore.jsx';

let config = window.GlobalConfigs;

let SmartMenuItem = React.createClass({

    getDefaultProps: function() {
        return {
            menuSpeed: 200 // config.menu_speed || 200
        }
    },
    mixins: [Reflux.listenTo(NavigationStore, '_handleNav')],
    shouldComponentUpdate: function() {
        return false
    },

    _handleNav: function(data) {
        let item = this.props.item;
        item.updateActive();
        if (data.item._id == item._id) {
            if (item.isOpen) {
                this._close()
            } else {
                this._open()
            }
        } else if (!item.isParentOf(data.item) || item.isSibling(data.item)) {
            this._close()
        }
    },

    _handleClick: function (e) {
        e.preventDefault();
        let item = this.props.item;
        NavigationActions.activate(item);
    },

    _open: function() {
        this.props.item.isOpen = true;
        this._getChildrenListNode().slideDown(this.props.menuSpeed);
        setTimeout(function() {
            this.forceUpdate()
        }.bind(this), this.props.menuSpeed)
    },

    _close: function() {
        this.props.item.isOpen = false;
        this._getChildrenListNode().slideUp(this.props.menuSpeed);
        setTimeout(function() {
            this.forceUpdate()
        }.bind(this), this.props.menuSpeed)
    },

    _getChildrenListNode: function() {
        return $(findDOMNode(this)).find('>ul')
    },

    render: function() {
        var item = this.props.item;

        var title = !item.parent ?
            (<span className="menu-item-parent"><Msg phrase={item.title} /></span>) :
                <Msg phrase={item.title} />;

        var badge = item.badge ?
            <span className={item.badge.class}>{item.badge.label || ''}</span> : null;

        var childItems = item.items ?
            (<SmartMenuList style={{ display: (item.isOpen ? 'block' : 'none') }} isTop={false} items={item.items}/>) : null;

        var icon = item.icon ?
            (item.counter ? <i className={item.icon}><em>{item.counter}</em></i> : <i className={item.icon}/>) : null;

        var collapseSign = item.items ?
            (item.isOpen ?
                 (<b className="collapse-sign"><em className="fa fa-minus-square-o"/></b>) :
                 (<b className="collapse-sign"><em className="fa fa-plus-square-o"/></b>)) : null;

        var link = item.route ?
            (<Link to={item.route} title={item.title} onClick={this._handleClick}>{icon} {title} {badge}</Link>) :
            (<a href={item.href || '#'} onClick={this._handleClick} title={item.title}>
                {icon} {title} {badge}{collapseSign}
            </a>);

        let itemClasses = classnames({
            open: item.isOpen,
            active: item.isActive
        });

        return <li className={itemClasses}>{link}{childItems}</li>
    }
});

export default SmartMenuItem
