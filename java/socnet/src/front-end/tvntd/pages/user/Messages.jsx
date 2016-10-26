/**
 * Copyright by Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import Panel          from 'vntd-shared/widgets/Panel.jsx';

const FilterMenu = {
    reactId  : 'filter-mesg',
    iconFmt  : 'btn-xs btn-warning',
    titleText: 'Filter',
    itemFmt  : 'pull-right js-status-update',
    menuItems: [ {
        itemFmt : 'fa fa-circle txt-color-green',
        itemText: 'Most recent',
        itemHandler: function() {
        }
    }, {
        itemFmt : 'fa fa-circle txt-color-green',
        itemText: 'With tasks',
        itemHandler: function() {
        }
    } ]
};

const QueryMenu = {
    reactId  : 'query-mesg',
    iconFmt  : 'btn-xs btn-success',
    titleText: 'Search by',
    itemFmt  : 'pull-right js-status-update',
    menuItems: [ {
        itemFmt : 'fa fa-circle txt-color-green',
        itemText: 'User name',
        itemHandler: function() {
        }
    }, {
        itemFmt : 'fa fa-circle txt-color-green',
        itemText: 'Keyword',
        itemHandler: function() {
        }
    } ]
};

class Messages extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            init   : false,
            reactId: 'mesg-info',
            icon   : 'fa fa-user',
            header : 'My Messages',
            headerMenus: []
        };
    }

    render() {
        return (
            <Panel reactId={this.state.reactId}>
                <h1>You don't have any messages yet!</h1>
            </Panel>
        )
    }
}

export default Messages;
