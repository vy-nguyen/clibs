/**
 * Vy Nguyen (2016)
 */
'use strict';

import _             from 'lodash';
import React         from 'react-mod';
import ReactDOM      from 'react-dom';
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

    moveUnder(turtle) {
        this.detachParent(turtle);
        this.attachParent(turtle);
    }

    hasAncestor(ancestor) {
        for (let curr = this.parent; curr != null; curr = curr.parent) {
            if (curr === ancestor) {
                return true;
            }
        }
        return false;
    }

    attachParent(parent) {
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
        this.oldParent = this.parent;
        this.parent = parent;
    }

    detachParent(parent) {
        if (this.parent != null && this.parent.children != null) {
            let idx = NestItem.findItem(this.parent.children, this.itemId);
            if (idx != -1) {
                this.parent.children.splice(idx, 1);
            }
        }
        this.oldParent = this.parent;
        this.parent = parent;
    }
}

class NestableItem extends React.Component
{
    static propTypes() {
        item : React.PropTypes.object
    }

    constructor(props) {
        super(props);
        this._addItem  = this._addItem.bind(this);
        this._rmItem   = this._rmItem.bind(this);

        let input = props.item.itemRef;
        if (input.itemInput == true) {
            this.state = {
                inpValue: input.itemValue
            };
        }
    }

    _onChange(input, event) {
        input.itemValue = event.currentTarget.value;
        this.setState({
            inpValue: event.currentTarget.value
        });
    }

    _addItem(item) {
        let input = _.cloneDeep(item.itemRef);
        input.itemId = _.uniqueId('nest-item-');
        input.itemInput = true;
        input.itemValue = '';
        input.itemContent = null;

        let newItem = new NestItem(input, item);
        newItem.attachParent(item);
        this.props.onAdd(newItem);
    }

    _rmItem(item) {
        item.detachParent(null);
        this.props.onRm(item);
    }

    componentDidMount() {
        let itemId = this.props.item.itemId;
        if (this.refs[itemId] != null) {
            ReactDOM.findDOMNode(this.refs[itemId]).focus();
        }
    }

    render() {
        let output = [];
        let content = null;
        let buttons = null;
        let childrenItem = null;
        let elm = this.props.item;
        let item = elm.itemRef;
        let children = elm.children;

        if (children != null) {
            childrenItem = children.map(function(item) {
                return <NestableItem key={_.uniqueId('nest-item-')} item={item} onAdd={this.props.onAdd} onRm={this.props.onRm}/>
            }.bind(this));
        }
        buttons = (
            <span className='pull-right'>
                <button className='btn btn-primary btn-xs' onClick={this._addItem.bind(this, elm)}>Add +</button>
                <button className='btn btn-danger btn-xs' onClick={this._rmItem.bind(this, elm)}>Remove x</button>
            </span>
        );
        let itemContent = item.itemContent;
        if (item.itemInput == true) {
            itemContent = (
                <input type='text' placeholder='Enter new tag' key={item.itemId} ref={item.itemId}
                    value={this.state.inpValue} onChange={this._onChange.bind(this, item)} />
            );
        }
        output.push(
            <li key={_.uniqueId('nest-item-')} className={"dd-item " + item.itemFmt} data-id={item.itemId}>
                <div className='dd-handle dd3-handle'></div>
                <div className={item.contentFmt}>
                    {itemContent}
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
        this._initState        = this._initState.bind(this);
        this._rmTag            = this._rmTag.bind(this);
        this._addTag           = this._addTag.bind(this);
        this._undoRmTag        = this._undoRmTag.bind(this);
        this._cancelItems      = this._cancelItems.bind(this);
        this._saveItems        = this._saveItems.bind(this);
        this._indexTree        = this._indexTree.bind(this);
        this._toRenderTab      = this._toRenderTab.bind(this);
        this._onChangeItem     = this._onChangeItem.bind(this);
        this._applyChangedItem = this._applyChangedItem.bind(this);

        this.state = this._initState(props, false);
    }

    _initState(props, store) {
        let indexTab  = {};
        let renderTab = [];
        _.forEach(props.items, function(it) {
            this._indexTree(it, null, indexTab, renderTab);
        }.bind(this));

        NestableStore.storeItemIndex(props.id, indexTab, store);
        return {
            delTags  : null,
            renderTab: renderTab
        };
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

    _undoRmTag(item) {
        let indexTab = NestableStore.getItemIndex(this.props.id);
        let delTags  = this.state.delTags;

        delete delTags[item.itemId];
        item.attachParent(item.oldParent);

        this.setState({
            delTags  : delTags,
            renderTab: this._toRenderTab(indexTab)
        });
    }

    _addTag(item) {
        let indexTab = NestableStore.getItemIndex(this.props.id);
        if (item.itemRef.itemInput === true) {
            indexTab[item.itemId] = item;
        }
        this.setState({
            renderTab: this._toRenderTab(indexTab)
        });
    }

    _rmTag(item) {
        let indexTab = NestableStore.getItemIndex(this.props.id);
        if (item.itemRef.itemInput === true) {
            delete indexTab[item.itemId];
            this.setState({
                renderTab: this._toRenderTab(indexTab)
            });
            return;
        }
        let delTags = this.state.delTags;
        if (delTags == null) {
            delTags = {};
        }
        item.parent = delTags;
        delTags[item.itemId] = item;

        this.setState({
            delTags  : delTags,
            renderTab: this._toRenderTab(indexTab)
        });
    }

    _saveItems() {
        let delTags = this.state.delTags;
        let indexTab = NestableStore.getItemIndex(this.props.id);
        let result = [];

        _.forOwn(indexTab, function(it) {
            if (it.hasAncestor(delTags) === true) {
                return;
            }
            let item = it.itemRef;
            let parent = it.parent == null ? null : it.parent.itemId;
            if (item.itemInput == true) {
                result.push({
                    itemId     : item.itemId,
                    parentId   : parent,
                    itemContent: item.itemValue
                });
            } else {
                result.push({
                    itemId     : item.itemId,
                    parentId   : parent,
                    itemContent: item.itemContent
                });
            }
        }.bind(this));
        console.log(result);
    }

    _cancelItems() {
        this.setState(this._initState(this.props, true));
    }

    render() {
        let items = this.state.renderTab;
        if (items == null) {
            return;
        }
        let deletedTags = null;
        if (this.state.delTags != null) {
            let delTags = [];
            _.forOwn(this.state.delTags, function(it) {
                delTags.push(
                    <li key={_.uniqueId('nest-del-tag-')}>
                        <a onClick={this._undoRmTag.bind(this, it)}>
                            <span className='label label-info'> x {it.itemRef.itemContent}</span>
                        </a>
                    </li>
                );
            }.bind(this));

            deletedTags = (
                <ul className='list-inline padding-10'>
                    {delTags}
                </ul>
            );
        }
        let renderItems = items.map(function(it) {
            return <NestableItem item={it} key={_.uniqueId('nest-item-')} onAdd={this._addTag} onRm={this._rmTag}/>
        }.bind(this));

        return (
            <div>
                <div className='row'>
                    <div className='btn-group' role='group'>
                        <button type='button' className='btn btn-danger' onClick={this._cancelItems}>Cancel</button>
                        <button type='button' className='btn btn-info' onClick={this._saveItems}>Save Order</button>
                    </div>
                </div>
                <div className='row'>
                    {deletedTags}
                </div>
                <div className='row'>
                    <Nestable onChange={this._onChangeItem}>
                        <div className="dd">
                            {renderItems}
                        </div>
                    </Nestable>
                </div>
            </div>
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
