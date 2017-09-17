/*
 * Written by Vy Nguyen (2016)
 */
'use strict';

import React       from 'react';
import _           from 'lodash';

import 'style-loader!css-loader!rc-collapse/assets/index.css';
import Collapse, { Panel } from 'rc-collapse';

import TreeView    from 'vntd-shared/layout/TreeView.jsx';
import InputStore  from 'vntd-shared/stores/NestableStore.jsx';

class AccordionView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeKey: props.activeKey
        };
        this._onChange    = this._onChange.bind(this);
        this._updateState = this._updateState.bind(this);
    }

    componentDidMount() {
        this.unsub = InputStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(item) {
        if (item.keyId == null ||
            item.viewId == null || item.viewId !== this.props.viewId) {
            return;
        }
        this.setState({
            activeKey: item.keyId
        });
    }

    _onChange(activeKey) {
        this.setState({
            activeKey: activeKey
        });
    }

    render() {
        let activeKey = this.state.activeKey || "0", elmView = [], header, content;

        _.forOwn(this.props.items, function(item) {
            if (!item.children || !item.children.length) {
                return;
            }
            header = TreeView.renderTreeItem(item, true, null);
            content = item.children.map(function(it) {
                return (
                    <div key={_.uniqueId('acc-content-')}>
                        {TreeView.renderTreeItem(it, false, null)}
                    </div>
                );
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
