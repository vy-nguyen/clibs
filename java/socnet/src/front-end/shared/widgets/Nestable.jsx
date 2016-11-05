/**
 * Vy Nguyen (2016)
 */
'use strict';

import _             from 'lodash';
import React         from 'react-mod';
import {findDOMNode} from 'react-dom';
import NestableStore from 'vntd-shared/stores/NestableStore.jsx';

class NestItem
{
    constructor(data, parent) {
        this.parent   = parent;
        this.itemId   = data.itemId;
        this.itemRef  = data;
    }

    static findItem(items, id) {
        let result = -1;
        _.forEach(items, function(it, index) {
            if (it.itemId === id) {
                result = index;
                return false;
            }
        });
        return result;
    }

    setChildren(children) {
        this.children = _.isEmpty(children) ? null : children;
    }

    moveUnder(parent) {
        if (this.parent != null && this.parent.children != null) {
            let idx = NestItem.findItem(this.parent.children, this.itemId);
            if (idx != -1) {
                this.parent.children.splice(idx, 1);
            }
        }
        this.parent = parent;
        if (parent != null) {
            if (parent.children == null) {
                parent.children = [];
            } else {
                let idx = NestItem.findItem(parent.children, this.itemId);
                if (idx != -1) {
                    return;
                }
            }
            parent.children.push(this);
        }
    }
}

class NestableItem extends React.Component
{
    static propTypes() {
        item : React.PropTypes.object
    }

    constructor(props) {
        super(props);
    }

    render() {
        let output = [];
        let content = null;
        let buttons = null;
        let childrenItem = null;
        let item = this.props.item.itemRef;
        let children = this.props.item.children;

        if (children != null) {
            childrenItem = children.map(function(item) {
                return <NestableItem key={_.uniqueId('nest-item-')} item={item}/>
            });
            buttons = (
                <span className='pull-right'>
                    <button className='btn btn-primary btn-xs'>Add +</button>
                    <button className='btn btn-danger btn-xs'>Remove x</button>
                </span>
            );
        }
        output.push(
            <li key={_.uniqueId('nest-item-')} className={"dd-item " + item.itemFmt} data-id={item.itemId}>
                <div className='dd-handle dd3-handle'></div>
                <div className={item.contentFmt}>
                    {item.itemContent}
                    {buttons}
                </div>
                {childrenItem}
            </li>
        );
        return (
            <ol className="dd-list">
                {output}
            </ol>
        );
    }
}

class NestableSelect extends React.Component
{
    constructor(props) {
        super(props);
        this._indexTree        = this._indexTree.bind(this);
        this._toRenderTab      = this._toRenderTab.bind(this);
        this._onChangeItem     = this._onChangeItem.bind(this);
        this._applyChangedItem = this._applyChangedItem.bind(this);

        let indexTab  = {};
        let renderTab = [];
        _.forEach(props.items, function(it) {
            this._indexTree(it, null, indexTab, renderTab);
        }.bind(this));

        this.state = {
            renderTab: renderTab
        }
        NestableStore.storeItemIndex(props.id, indexTab);
    }

    _indexTree(item, parent, indexTree, renderTree) {
        let nestItem = new NestItem(item, parent);
        indexTree[item.itemId] = nestItem;

        if (item.children != null) {
            let subItems = [];
            _.forEach(item.children, function(child) {
                this._indexTree(child, nestItem, indexTree, subItems);
            }.bind(this));

            nestItem.setChildren(subItems);
        }
        renderTree.push(nestItem);
        return indexTree;
    }
    
    _applyChangedItem(data, parent, indexTab) {
        _.forEach(data, function(elm) {
            let ref = indexTab[elm.id];
            if (ref == null) {
                return;
            }
            ref.moveUnder(parent);
            if (elm.children != null) {
                this._applyChangedItem(elm.children, ref, indexTab);
            }
        }.bind(this));
    }

    _toRenderTab(indexTab) {
        let renderTab = [];
        _.forEach(indexTab, function(elm) {
            if (elm.parent == null) {
                renderTab.push(elm);
            }
        });
        return renderTab;
    }

    _onChangeItem(data) {
        let indexTab = NestableStore.getItemIndex(this.props.id);
        if (Array.isArray(data)) {
            this._applyChangedItem(data, null, indexTab);
        } else {
            this._applyChangedItem([data], null, indexTab);
        }
        this.setState({
            renderTab: this._toRenderTab(indexTab)
        });
    }

    render() {
        let items = this.state.renderTab;
        if (items == null) {
            return;
        }
        let renderItems = items.map(function(it) {
            return <NestableItem item={it} key={_.uniqueId('nest-item-')}/>
        });
        return (
            <Nestable onChange={this._onChangeItem}>
                <div className="dd">
                    {renderItems}
                </div>
            </Nestable>
        );
    }
}

class Nestable extends React.Component
{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let element = $(findDOMNode(this));
        let options = {};

        if (this.props.group){
            options.group = this.props.group;
        }
        element.nestable(options);

        if (this.props.onChange) {
            element.on('change', function() {
                this.props.onChange(element.nestable('serialize'))
            }.bind(this));
            this.props.onChange(element.nestable('serialize'))
        }
    }

    render() {
        return this.props.children;
    }
}

export { Nestable, NestableSelect, NestableItem }
