/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React            from 'react-mod';
import classnames       from 'classnames';
import TabStore         from 'vntd-shared/stores/TabPanelStore.jsx';

let TabPanel = React.createClass({
    getInitialState: function() {
        return TabStore.getTabPanel(this.props.tabId);
    },

    render: function() {
        let tab = TabStore.getTabPanel(this.props.tabId);
        if (tab == null || tab == undefined) {
            return null;
        }
        let tab_header = tab.tabItems.map(function(item, idx) {
            return (
                <li key={idx} className={idx == 0 ? "active" : ""}>
                    <a data-toggle="tab" href={'#' + item.tabDomId + '-' + idx}>{item.tabText}</a>
                </li>
            )
        }.bind(this));

        let tab_content = tab.tabItems.map(function(item, idx) {
            let clasname = classnames("tab-pane", {active: idx == 0 });
            return (
                <div key={idx} id={item.tabDomId + '-' + idx} className={classnames("tab-pane", {active: idx == 0})}>
                    <div className="panel-body">
                        {item.panelContent}
                    </div>
                </div>
            )
        }.bind(this));

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
