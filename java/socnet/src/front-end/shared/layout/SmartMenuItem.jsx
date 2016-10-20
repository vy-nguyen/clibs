/**
 * Modified by Vy Nguyen (2016)
 */
'use strict';

import React             from 'react-mod';
import ReactDOM          from 'react-dom';
import {Link}            from 'react-router';
import classnames        from 'classnames';
import {findDOMNode}     from 'react-dom';

import NavigationActions from 'vntd-shared/actions/NavigationActions.jsx';
import NavigationStore   from 'vntd-shared/stores/NavigationStore.jsx';
import SmartMenuList     from './SmartMenuList.jsx';

class SmartMenuItem extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            menuSpeed : window.GlobalConfigs.menu_speed || 200,
            activeItem: props.item
        }
        this._open = this._open.bind(this);
        this._updateState = this._updateState.bind(this);
        this._handleClick = this._handleClick.bind(this);
        this._getChildrenListNode = this._getChildrenListNode.bind(this);
    }

    componentWillMount() {
        this.props.item.updateState();
    }

    componentDidMount() {
        this.unsub = NavigationStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(data) {
        if (this.state.activeItem != data.item) {
            this.setState({
                activeItem: data.item
            });
        }
    }

    _handleClick(e) {
        e.preventDefault();
        NavigationActions.activate(this.props.item);
    }

    _open() {
        this._getChildrenListNode().slideDown(this.state.menuSpeed);
    }

    _close() {
        this._getChildrenListNode().slideUp(this.state.menuSpeed);
    }

    _getChildrenListNode() {
        return $(findDOMNode(this)).find('>ul')
    }

    render() {
        let item = this.props.item;
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
}

export default SmartMenuItem
