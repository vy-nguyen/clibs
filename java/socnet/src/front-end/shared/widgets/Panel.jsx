/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React            from 'react-mod';
import _                from 'lodash';
import DropdownMenu     from 'vntd-shared/layout/DropdownMenu.jsx';
import JarvisWidget     from 'vntd-shared/widgets/JarvisWidget.jsx';

let Panel = React.createClass({

    render: function() {
        let panel = this.props.context;
        if (panel === null || panel === undefined) {
            return null;
        }
        let dropdown_menu = panel.headerMenus.map(function(item, idx) {
            return <DropdownMenu key={_.uniqueId('panel-menu-')} context={item}/>;
        }.bind(this));

        return (
           <JarvisWidget color={"purple"}>
               <header>
                   <span className="widget-icon"><i className={panel.icon}/></span>
                   <h2>{this.props.context.header}</h2>
                   <div className="widget-toolbar">
                       {dropdown_menu}
                   </div>
               </header>
               <div className="widget-body">
                   {this.props.children}
               </div>
           </JarvisWidget>
        );
    }
});

export default Panel;
