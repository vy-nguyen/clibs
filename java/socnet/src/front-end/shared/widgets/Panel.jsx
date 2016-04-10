/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React            from 'react-mod';
import PanelStore       from 'vntd-shared/stores/PanelStore.jsx';
import DropdownMenu     from 'vntd-shared/layout/DropdownMenu.jsx';
import JarvisWidget     from 'vntd-shared/widgets/JarvisWidget.jsx';

let Panel = React.createClass({
    getInitialState: function() {
        return PanelStore.getPanel(this.props.data.panelId);
    },

    render: function() {
        let panel = PanelStore.getPanel(this.props.data.panelId);
        if (panel == null || panel == undefined) {
            return null;
        }
        let dropdown_menu = this.props.data.headerMenus.map(function(item, idx) {
            return <DropdownMenu menuId={item.menuId}/>;
        }.bind(this));

        return (
           <JarvisWidget color={"blue"} collapse={true}>
               <header>
                   <span className="widget-icon"><i className={this.props.data.icon}/></span>
                   <h2>{this.props.data.header}</h2>
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
