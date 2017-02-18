/**
 * Copyright by Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import Panel          from 'vntd-shared/widgets/Panel.jsx';
import Lang           from 'vntd-root/stores/LanguageStore.jsx';
import Mesg           from 'vntd-root/components/Mesg.jsx';

class TaskTimeline extends React.Component
{
    constructor(props) {
        super(props);
        this._filterMenu = {
            reactId  : 'filter-friend',
            iconFmt  : 'btn-xs btn-warning',
            titleText: Lang.translate('Filter'),
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: Lang.translate('Most promissing'),
                itemHandler: function() {
                }
            }, {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: Lang.translate('Give me most credit'),
                itemHandler: function() {
                }
            } ]
        };
        this._panelDef = {
            init   : false,
            reactId: 'task-info',
            icon   : 'fa fa-user',
            header : Lang.translate('My Task Timeline'),
            headerMenus: [ this._filterMenu ]
        };

    }

    render() {
        return (
            <Panel context={this._panelDef}>
                <h1><Mesg text="You don't have any pending tasks yet!"/></h1>
            </Panel>
        )
    }
}

export default TaskTimeline;
