/**
 * Modified Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import Reflux         from 'reflux';

import LoginInfo       from 'vntd-shared/layout/LoginInfo.jsx';
import SmartMenuList   from 'vntd-shared/layout/SmartMenuList.jsx';
import MinifyMenu      from 'vntd-shared/layout/MinifyMenu.jsx';
import NavigationStore from 'vntd-shared/stores/NavigationStore.jsx';

class Navigation extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
        this._updateMenu = this._updateMenu.bind(this);
    }

    componentDidMount() {
        this.unSub = NavigationStore.listen(this._updateMenu);
    }

    componentWillUnmount() {
        this.unSub();
    }

    _updateMenu(data) {
        this.setState({
            items: data.items
        });
    }

    render() {
        return (
            <aside id="left-panel">
                <LoginInfo />
                <nav>
                    <SmartMenuList items={this.state.items} />
                </nav>
                <MinifyMenu />
            </aside>
        )
    }
}

export default Navigation;
