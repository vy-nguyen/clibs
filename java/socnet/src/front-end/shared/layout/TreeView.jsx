/*
 * Written by Vy Nguyen
 */
'use strict';

import _             from 'lodash';
import React         from 'react';
import classnames    from 'classnames';
import HtmlRender    from 'vntd-shared/utils/HtmlRender.jsx';
import ArticleRank   from 'vntd-root/components/ArticleRank.jsx';

class TreeViewItem extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            expanded: this.props.item.expanded != null ? this.props.item.expanded : false
        };
        this._handleExpand = this._handleExpand.bind(this);
        this._handleDrag = this._handleDrag.bind(this);
        this._handleDrop = this._handleDrop.bind(this);
        this._handleDragOver = this._handleDragOver.bind(this);
    }

    _handleExpand(e, data) {
        e.stopPropagation();
        let item = this.props.item

        if (item.children && item.children.length) {
            this.setState({
                expanded: !this.state.expanded
            });
        }
    }

    _handleDrag(entry, event) {
    }

    _handleDrop(entry, event) {
    }

    _handleDragOver(event) {
        event.preventDefault();
    }

    render() {
        let item = this.props.item, className, children = null;

        if (item.children && item.children.length) {
            let subClassName = classnames({
                'smart-treeview-group': true,
                hidden: !this.state.expanded
            });
            children =
                <TreeView className={subClassName} items={item.children} role="group"/>;
        }
        className = classnames({
            parent_li: item.children && item.children.length
        });

        return (
            <li className={className} onClick={this._handleExpand}>
                {TreeView.renderTreeItem(item, this.state.expanded, null)}
                {children}
            </li>
        )
    }

    static formatLabel(item, label, itemCnt, expanded) {
        let fontSize = item.fontSize || "14";
        let textStyle = item.textStyle || "label label-primary";
        return (
            <span className={textStyle} style={{fontSize: fontSize}}>
                { expanded ?
                    <i className={item.iconOpen}/> : <i className={item.iconClose}/> }
                {label}
                {itemCnt}
            </span>
        );
    }
}

class TreeView extends React.Component
{
    constructor(props) {
        super(props);
        this._handleDrag = this._handleDrag.bind(this);
        this._handleDrop = this._handleDrop.bind(this);
        this._handleDragOver = this._handleDragOver.bind(this);
    }

    _handleDrag(entry, event) {
    }

    _handleDrop(entry, event) {
    }

    _handleDragOver(event) {
        event.preventDefault();
    }

    render() {
        let items = this.props.items,
        views = items.map(function(it) {
            return (
                <TreeViewItem item={it} key={_.uniqueId('tree-item-')} parent={this}/>
            );
        }.bind(this));

        return (
            <ul role={this.props.role ? this.props.role : "tree"}
                className={this.props.className}>
                {views}
            </ul>
        )
    }

    static renderTreeItem(item, expanded, itemCntClass) {
        let itemCnt = null;
        if (itemCntClass == null) {
            itemCntClass = "badge alert-danger";
        }
        if (item.children && item.children.length &&
            (item.itemCount == null || item.itemCount === true)) {
            itemCnt = <span className={itemCntClass}>{item.children.length}</span>;
        }
        let output = null;
        let fmtLabel = null;

        if (item.renderFn == null) {
            if (item.defLabel == null) {
                output = <HtmlRender html={item.content}/>;
            } else {
                fmtLabel = item.content;
            }
        } else {
            output = item.renderFn(item.renderArg, "content", expanded);
            if (item.defLabel != null) {
                fmtLabel = output;
            }
        }
        if (fmtLabel != null) {
            if (item.formatLabel == null) {
                item.formatLabel = TreeViewItem.formatLabel;
            }
            output = item.formatLabel(item, fmtLabel, itemCnt, expanded);
        }
        return output;
    }
}

export default TreeView;
