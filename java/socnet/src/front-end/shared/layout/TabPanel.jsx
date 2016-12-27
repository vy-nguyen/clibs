/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                from 'lodash';
import React            from 'react-mod';
import classnames       from 'classnames';

class TabPanel extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            activePane: 0
        };
        this._selectTab = this._selectTab.bind(this);
        this._getActivePane = this._getActivePane.bind(this);
        this._setActivePane = this._setActivePane.bind(this);
    }

    _selectTab(index) {
        this.props.context.setActivePane(index);
    }

    _getActivePane() {
        return this.state.activePane;
    }

    _setActivePane(index) {
        this.setState({
            activePane: index
        });
    }

    render() {
        let tab = this.props.context;
        if (tab == null) {
            return null;
        }
        if (tab.getActivePane == null) {
            tab.getActivePane = this._getActivePane;
            tab.setActivePane = this._setActivePane;
        }
        let activeIdx = tab.getActivePane();
        let containerFmt = tab.containerFmt != null ? tab.containerFmt : "tab-container no-padding";
        let headerFmt = tab.headerFmt != null ? tab.headerFmt : "nav nav-tabs";
        let contentFmt = tab.contentFmt != null ? tab.contentFmt : "tab-content no-padding";

        let tabHeader = tab.tabItems.map(function(item, idx) {
            return (
                <li key={_.uniqueId('tab-panel-')} className={idx == activeIdx ? "active" : ""}>
                    <a data-toggle="tab" href={'#' + item.domId}
                        id={'tab-panel-' + item.domId} onClick={this._selectTab.bind(this, idx)}>
                        {item.tabText}
                    </a>
                </li>
            )
        }.bind(this));

        let tabList = this.props.children;
        let tabClsn = this.props.className;
        let tabContent = tab.tabItems.map(function(item, idx) {
            let tabRef = tabList[item.tabIdx];
            let paneFmt = item.paneFmt != null ? item.paneFmt : "";
            let clasname = classnames("tab-pane " + paneFmt, {active: idx == activeIdx});
            return (
                <div key={_.uniqueId('tab-panel-')}
                    id={item.domId} className={classnames("tab-pane", {active: idx == activeIdx})}>
                    <div className={classnames("panel-body no-padding", tabClsn)}>
                        {tabRef}
                    </div>
                </div>
            )
        }.bind(this));

        return (
            <div className={containerFmt}>
                <ul className={headerFmt}>
                    {tabHeader}
                </ul>
                <div className={contentFmt}>
                    {tabContent}
                </div>
            </div>
        );
    }
}

export default TabPanel;
