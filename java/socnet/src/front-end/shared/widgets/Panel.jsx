/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _                from 'lodash';
import React            from 'react-mod';
import DropdownMenu     from 'vntd-shared/layout/DropdownMenu.jsx';
import JarvisWidget     from 'vntd-shared/widgets/JarvisWidget.jsx';

class Panel extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let panel = this.props.context;
        if (panel == null) {
            return null;
        }
        let dropdownMenu = panel.headerMenus.map(function(item, idx) {
            return <DropdownMenu key={_.uniqueId('panel-menu-')} context={item}/>;
        });

        let panelLabel = "";
        if (panel.panelLabel) {
            panelLabel = panel.panelLabel.map(function(item, idx) {
                return (
                    <div className="widget-toolbar" key={_.uniqueId('panel-label-')}>
                        <div className={item.labelIcon}>{item.labelText}</div>
                    </div>
                )
            });
        }

        return (
            <JarvisWidget colorbutton={false} editbutton={false} togglebutton={false}
                deletebutton={false} fullscreenbutton={false} color="purple">
                <header>
                    <span className="widget-icon"><i className={panel.icon}/></span>
                    <h2>{this.props.context.header}</h2>
                    <div className="widget-toolbar">
                        {dropdownMenu}
                    </div>
                    {panelLabel}
                </header>
                <div className="panel panel-default" style={{overflow: 'auto'}}>
                    {this.props.children}
                </div>
            </JarvisWidget>
        );
    }
}

export default Panel;
