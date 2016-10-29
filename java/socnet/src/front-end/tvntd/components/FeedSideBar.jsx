/**
 * Written by Vy Nguyen (2016)
 */
'use strict';

import React     from 'react-mod';
import Sidebar   from 'react-sidebar';

class FeedSideBar extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen  : false,
            sidebarDocked: false
        };
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    }

    onSetSidebarOpen(open) {
        this.setState({
            sidebarOpen: open
        });
    }

    componentWillMount() {
        var mql = window.matchMedia(`(min-width: 800px)`);
        mql.addListener(this.mediaQueryChanged);
        this.setState({
            mql: mql,
            sidebarDocked: mql.matches
        });
    }

    componentWillUnmount() {
        this.state.mql.removeListener(this.mediaQueryChanged);
    }

    mediaQueryChanged() {
        this.setState({
            sidebarDocked: this.state.mql.matches
        });
    }

    render() {
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
}

export default FeedSideBar;
