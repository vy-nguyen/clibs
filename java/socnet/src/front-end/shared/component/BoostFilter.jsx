/**
 * Written by Vy Nguyen
 * BSD License
 */
'use strict';

import _               from 'lodash';
import React           from 'react-mod';
import ComponentBase   from 'vntd-shared/layout/ComponentBase.jsx';
import InputStore      from 'vntd-shared/stores/NestableStore.jsx';
import AccordionView   from 'vntd-shared/layout/AccordionView.jsx';

class BoostFilter extends ComponentBase
{
    constructor(props) {
        super(props, null, [InputStore]);

        this.evenRow        = true;
        this._renderItem    = this._renderItem.bind(this);
        this._renderLink    = this._renderLink.bind(this);
        this._renderElement = this._renderElement.bind(this);
    }

    _getState(store) {
    }

    // Override this method to get children of the item.
    //
    _getChildren(item) {
        return null;
    }

    _filterOut(item) {
        return false;
    }

    _getItemAttr(item) {
        return {
            keyId : _.uniqueId(),
            viewId: _.uniqueId(),
            text  : 'title'
        };
    }

    _renderItem(item) {
        return <span>{item}</span>;
    }

    _selectItem(item) {
        console.log("Select item");
        console.log(item);
    }

    _renderLink(item) {
        let parent = item.parent, attr = this._getItemAttr(item);

        item.keyId   = attr.keyId;
        item.viewId  = attr.viewId;
        this.evenRow = !this.evenRow;
        return (
            <p onClick={this._selectItem.bind(this, item)}>{attr.text}</p>
        );
    }

    _renderElement(parent, children, output) {
        let style, sub = [];

        _.forOwn(children, function(it) {
            if (this._filterOut(it) === true) {
                return;
            }
            it.parent = parent;
            sub.push({
                renderFn : this._renderLink,
                renderArg: it
            });
        }.bind(this));

        style = this.evenRow ? "label label-info" : "label label-primary";
        this.evenRow = !this.evenRow;
        output.push({
            renderFn : this._renderItem,
            renderArg: parent,
            textStyle: style,
            fontSize : '12',
            defLabel : true,
            itemCount: false,
            children : sub,
            iconOpen : 'fa fa-plus',
            iconClose: 'fa fa-minus'
        });
    }

    _getTreeViewJson(output) {
        let items = this.props.items;

        _.forEach(items, function(it) {
            this._renderElement(it, this._getChildren(it), output);
        }.bind(this));
    }

    render() {
        let output = [];
        this._getTreeViewJson(output);
        return (
            <div className={this.props.className}>
                <AccordionView items={output}/>
            </div>
        );
    }
}

export default BoostFilter;
