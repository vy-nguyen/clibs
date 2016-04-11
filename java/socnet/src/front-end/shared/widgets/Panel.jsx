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
        return PanelStore.getPanel(this.props.reactId);
    },

    render: function() {
        let panel = PanelStore.getPanel(this.props.reactId);
        if (panel == null || panel == undefined) {
            return null;
        }
        let dropdown_menu = panel.headerMenus.map(function(item, idx) {
            return <DropdownMenu reactId={item.reactId}/>;
        }.bind(this));

        return (
           <JarvisWidget color={"blue"} collapse={true}>
               <header>
                   <span className="widget-icon"><i className={panel.icon}/></span>
                   <h2>{this.state.header}</h2>
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
