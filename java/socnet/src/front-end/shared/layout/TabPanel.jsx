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
        let tab_header = tab.tabItems.map(function(item, idx) {
            return (
                <li key={_.uniqueId('tab-panel-')} className={idx == 0 ? "active" : ""}>
                    <a data-toggle="tab" href={'#' + item.domId + '-' + item.tabIdx}>{item.tabText}</a>
                </li>
            )
        });

        let tab_list = this.props.children;
        let tab_content = tab.tabItems.map(function(item, idx) {
            let tabRef = tab_list[item.tabIdx];
            let clasname = classnames("tab-pane", {active: idx == 0 });
            return (
                <div key={_.uniqueId('tab-panel-')}
                    id={item.domId + '-' + item.tabIdx} className={classnames("tab-pane", {active: idx == 0})}>
                    <div className="panel-body">
                        {tabRef}
                    </div>
                </div>
            )
        });

        return (
            <div className="tab-container">
                <ul className="nav nav-tabs">
                    {tab_header}
                </ul>
            <div className="tab-content">
                {tab_content}
            </div>
            </div>
        );
    }
});

export default TabPanel;
