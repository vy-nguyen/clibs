/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React            from 'react-mod';
import _                from 'lodash';
import classnames       from 'classnames';

let TabPanel = React.createClass({
    render: function() {
        let tab = this.props.context;
        if (tab === null || tab === undefined) {
            return null;
        }
        let tabHeader = tab.tabItems.map(function(item, idx) {
            return (
                <li key={_.uniqueId('tab-panel-')} className={idx == 0 ? "active" : ""}>
                    <a data-toggle="tab" href={'#' + item.domId + '-' + item.tabIdx}>{item.tabText}</a>
                </li>
            )
        });

        let tabList = this.props.children;
        let tabClsn = this.props.className;
        let tabContent = tab.tabItems.map(function(item, idx) {
            let tabRef = tabList[item.tabIdx];
            let clasname = classnames("tab-pane", {active: idx == 0 });
            return (
                <div key={_.uniqueId('tab-panel-')}
                    id={item.domId + '-' + item.tabIdx} className={classnames("tab-pane", {active: idx == 0})}>
                    <div className={classnames("panel-body", tabClsn)}>
                        {tabRef}
                    </div>
                </div>
            )
        });

        return (
            <div className="tab-container">
                <ul className="nav nav-tabs">
                    {tabHeader}
                </ul>
            <div className="tab-content">
                {tabContent}
            </div>
            </div>
        );
    }
});

export default TabPanel;
