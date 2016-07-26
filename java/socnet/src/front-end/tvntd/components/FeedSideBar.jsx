/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import React     from 'react-mod';
import Sidebar   from 'react-sidebar';

let FeedSideBar = React.createClass({

    getInitialState() {
        return {
            sidebarOpen: false,
            sidebarDocked: false
        };
    },

    onSetSidebarOpen: function(open) {
        this.setState({
            sidebarOpen: open
        });
    },

    componentWillMount: function() {
        var mql = window.matchMedia(`(min-width: 800px)`);
        mql.addListener(this.mediaQueryChanged);
        this.setState({
            mql: mql,
            sidebarDocked: mql.matches
        });
    },

    componentWillUnmount: function() {
        this.state.mql.removeListener(this.mediaQueryChanged);
    },

    mediaQueryChanged: function() {
        this.setState({
            sidebarDocked: this.state.mql.matches
        });
    },

    render: function() {
        var sidebarContent = <b>Sidebar content</b>;

        return (
            <Sidebar sidebar={sidebarContent}
                open={this.state.sidebarOpen}
                docked={this.state.sidebarDocked}
                onSetOpen={this.onSetSidebarOpen}>
                <b>Main content</b>
            </Sidebar>
        );
    }
});

export default FeedSideBar;
