/*
 * Written by Vy Nguyen (2016)
 */
'use strict';

import React       from 'react';
import _           from 'lodash';
import TreeView    from 'vntd-shared/layout/TreeView.jsx';
import UiAccordion from 'vntd-shared/layout/UiAccordion.jsx';

let AccordionView = React.createClass({

    render: function() {
        let elmView = [];
        _.forOwn(this.props.items, function(item) {
            if (!item.children || !item.children.length) {
                return;
            }
            let header = TreeView.renderTreeItem(item, true, null);
            let content = item.children.map(function(it) {
                return <span key={_.uniqueId('accordion-item-')}>{TreeView.renderTreeItem(it, false, null)}</span>;
            });
            elmView.push(
                <div key={_.uniqueId('accordion-')}>
                    <h4>{header}</h4>
                    <div>{content}</div>
                </div>
            );
        }.bind(this));

        return (
            <UiAccordion>
                <div>
                    {elmView}
                </div>
            </UiAccordion>
        );
    }
});

export default AccordionView;
