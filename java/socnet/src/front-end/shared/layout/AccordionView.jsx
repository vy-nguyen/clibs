/*
 * Written by Vy Nguyen (2016)
 */
'use strict';

import React       from 'react';
import _           from 'lodash';

import 'style!css!rc-collapse/assets/index.css';
import Collapse, { Panel } from 'rc-collapse';

import TreeView    from 'vntd-shared/layout/TreeView.jsx';

class AccordionView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeKey: null
        };
        this._onChange = this._onChange.bind(this);
    }

    _onChange(activeKey) {
        this.setState({
            activeKey: activeKey
        });
    }

    render() {
        let activeKey = this.state.activeKey;
        let elmView = [];

        _.forOwn(this.props.items, function(item) {
            if (!item.children || !item.children.length) {
                return;
            }
            if (activeKey == null) {
                activeKey = [ item.keyId ];
            }
            let header = TreeView.renderTreeItem(item, true, null);
            let content = item.children.map(function(it) {
                return <div key={_.uniqueId('acc-content-')}>{TreeView.renderTreeItem(it, false, null)}</div>;
            });
            elmView.push(
                <Panel header={header} key={item.keyId}>
                    {content}
                </Panel>
            );
        }.bind(this));

        return (
            <Collapse accordion={true} onChange={this._onChange} activeKey={activeKey}>
                {elmView}
            </Collapse>
        );
    }
}

export default AccordionView;
