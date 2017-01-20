/**
 * Vy Nguyen (2016)
 */
'use strict';

import _             from 'lodash';
import React         from 'react-mod';
import ReactDOM      from 'react-dom';
// import {findDOMNode} from 'react-dom';

import NestableStore    from 'vntd-shared/stores/NestableStore.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';
import ModalConfirm     from 'vntd-shared/forms/commons/ModalConfirm.jsx';

class NestItem
{
    constructor(data, parent, order) {
        this.parent   = parent;
        this.itemId   = data.itemId;
        this.itemRef  = data;
        this.order    = order;
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

class EnterTag extends React.Component
{
    constructor(props) {
        super(props);
        this.openModal = this.openModal.bind(this);
        this._submitInput = this._submitInput.bind(this);
    }

    _submitInput(e) {
        e.preventDefault();
        let value = this.refs.input.value;
        this.props.onInputValue(value);
        this.refs.modal.closeModal();
    }

    openModal() {
        this.refs.modal.openModal();
    }

    render() {
        return (
            <ModalConfirm ref={"modal"} modalTitle={"Enter New Tag"}>
                <form className='smart-form' onSubmit={this._submitInput}>
                    <label className='input'>
                        <input type='text' placeholder='Tag Category' ref='input'/>
                    </label>
                </form>
            </ModalConfirm>
        );
    }
}

class NestableItem extends React.Component
{
    static propTypes() {
        item : React.PropTypes.object
    }

    constructor(props) {
        super(props);
        this._addItem   = this._addItem.bind(this);
        this._rmItem    = this._rmItem.bind(this);
        this._onAddItem = this._onAddItem.bind(this);
    }

    _onAddItem(item, value) {
        let input = {
            itemId     : _.uniqueId('nest-item-'),
            itemInput  : true,
            itemValue  : value,
            itemContent: value,
            itemSub    : false,
            itemFmt    : item.itemRef.itemFmt,
            contentFmt : item.itemRef.contentFmt,
            canRemove  : true,
            itemSub    : true,
            itemSave   : {
                pubTag : false,
                tagName: value,
                article: false
            }
        };
        let newItem = new NestItem(input, item, 100000);
        newItem.attachParent(item);
        this.props.onAdd(newItem);
    }

    _addItem() {
        this.refs.modal.openModal();
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
                return <NestableItem key={_.uniqueId('nest-item-')} item={item}
                            onAdd={this.props.onAdd} onRm={this.props.onRm}/>
            }.bind(this));
        }
        let removeBtn = null;
        if (item.canRemove === true) {
            removeBtn = (
                <button className='btn btn-danger btn-xs' onClick={this._rmItem.bind(this, elm)}>Remove x</button>
            );
        }
        let addSubBtn = null;
        if (item.itemSub === true) {
            addSubBtn = (
                <button className='btn btn-primary btn-xs' onClick={this._addItem}>Add +</button>
            );
        }
        buttons = (
            <span className='pull-right'>
                {addSubBtn}
                {removeBtn}
                <EnterTag ref={"modal"} onInputValue={this._onAddItem.bind(this, elm)}/>
            </span>
        );
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
        this._initState        = this._initState.bind(this);
        this._rmTag            = this._rmTag.bind(this);
        this._addTag           = this._addTag.bind(this);
        this._undoRmTag        = this._undoRmTag.bind(this);
        this._cancelItems      = this._cancelItems.bind(this);
        this._saveItems        = this._saveItems.bind(this);
        this._toRenderTab      = this._toRenderTab.bind(this);
        this._onChangeItem     = this._onChangeItem.bind(this);
        this._createSaveBtn    = this._createSaveBtn.bind(this);
        this._applyChangedItem = this._applyChangedItem.bind(this);

        this.state = this._initState(props, false);
        this.saveBtn = StateButtonStore.createButton('save-tag-' + props.id, this._createSaveBtn);
    }

    _createSaveBtn() {
        return {
            success: {
                text     : 'Saved Tags',
                disabled : true,
                nextState: 'needSave',
                className: 'btn btn-default'
            },
            failure: {
                text     : 'Save Failed',
                disabled : false,
                nextState: 'needSave',
                className: 'btn btn-default'
            },
            saving: {
                text     : 'Saving...',
                disabled : true,
                nextState: 'success',
                className: 'btn btn-danger'
            },
            needSave: {
                text     : 'Save Order',
                disabled : false,
                nextState: 'saving',
                className: 'btn btn-success'
            }
        };
    }

    _initState(props, store) {
        let indexTab = NestableStore.getItemIndex(props.id);

        if (indexTab == null) {
            let renderTab = NestableSelect.buildIndex(props.id, store, props.items);
            return {
                delTags  : null,
                renderTab: renderTab
            };
        }
        let renderTab = this._toRenderTab(indexTab);
        return {
            delTags  : null,
            renderTab: renderTab
        };
    }

    static buildIndex(storeId, store, items) {
        let order = 0;
        let indexTab = {};
        let renderTab = [];

        _.forEach(items, function(it) {
            NestableSelect._indexTree(it, null, indexTab, renderTab, ++order);
        });
        NestableStore.storeItemIndex(storeId, indexTab, store);
        return renderTab;
    }

    static _indexTree(item, parent, indexTree, renderTree, order) {
        let nestItem = new NestItem(item, parent, order);
        indexTree[item.itemId] = nestItem;

        if (item.children != null) {
            let subOrder = 0;
            let subItems = [];

            _.forEach(item.children, function(child) {
                NestableSelect._indexTree(child, nestItem, indexTree, subItems, ++subOrder);
            });
            nestItem.setChildren(subItems);
        }
        renderTree.push(nestItem);
        return indexTree;
    }
    
    _applyChangedItem(data, parent, indexTab, order, visited) {
        _.forEach(data, function(elm) {
            let ref = indexTab[elm.id];
            if (ref == null) {
                return;
            }
            ref.order = ++order;
            ref.moveUnder(parent);
            if (elm.children != null) {
                this._applyChangedItem(elm.children, ref, indexTab, 0, visited);
            }
            visited[ref.itemId] = ref;
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
        let visited = {};
        let indexTab = NestableStore.getItemIndex(this.props.id);
        if (Array.isArray(data)) {
            this._applyChangedItem(data, null, indexTab, 0, visited);
        } else {
            this._applyChangedItem([data], null, indexTab, 0, visited);
        }
        _.forEach(indexTab, function(elm) {
            if (visited[elm.itemId] != null) {
                return;
            }
            if (elm.parent != null && elm.parent.children != null) {
                let order = 0;
                _.forEach(elm.parent.children, function(child) {
                    order++;
                    if (visited[child.itemId] == null) {
                        child.order = order;
                        visited[child.itemId] = child;
                    }
                });
            }
        });
        this.setState({
            renderTab: this._toRenderTab(indexTab)
        });
        StateButtonStore.setButtonStateObj(this.saveBtn, "needSave");
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
        StateButtonStore.setButtonStateObj(this.saveBtn, "needSave");
    }

    _addTag(item) {
        let indexTab = NestableStore.getItemIndex(this.props.id);
        if (item.itemRef.itemInput === true) {
            indexTab[item.itemId] = item;
        }
        this.setState({
            renderTab: this._toRenderTab(indexTab)
        });
        StateButtonStore.setButtonStateObj(this.saveBtn, "needSave");
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

    _saveItems(btnId) {
        let delTags = this.state.delTags;
        let indexTab = NestableStore.getItemIndex(this.props.id);
        let result = [];

        _.forOwn(indexTab, function(it) {
            if (it.hasAncestor(delTags) === true) {
                return;
            }
            let item = it.itemRef;
            let parent = it.parent == null ? null : it.parent.itemId;
            if (item.itemInput === true) {
                result.push({
                    itemId  : item.itemId,
                    parentId: parent,
                    pubTag  : false,
                    tagName : item.itemValue,
                    article : false,
                    order   : it.order
                });
            } else {
                result.push({
                    itemId  : item.itemId,
                    parentId: parent,
                    pubTag  : item.itemSave.pubTag,
                    tagName : item.itemSave.tagName,
                    article : item.itemSave.article,
                    order   : it.order
                });
            }
        }.bind(this));

        this.props.onSave(result, btnId);
        NestableStore.clearItemIndex(this.props.id);
        StateButtonStore.goNextState(btnId);
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
        let saveBtnId = this.saveBtn.getBtnId();
        let renderItems = items.map(function(it) {
            return <NestableItem item={it} key={_.uniqueId('nest-item-')} onAdd={this._addTag} onRm={this._rmTag}/>
        }.bind(this));

        return (
            <div>
                <div className='row'>
                    <div className='btn-group' role='group'>
                        <button type='button' className='btn btn-danger' onClick={this._cancelItems}>Cancel</button>
                        <StateButton btnId={saveBtnId} onClick={this._saveItems.bind(this, saveBtnId)}/>
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
        let element = $(ReactDOM.findDOMNode(this));
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
