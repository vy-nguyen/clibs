/**
 * Modified Vy Nguyen (2016)
 */
'use strict';

import React           from 'react-mod';
import SmartMenuList   from 'vntd-shared/layout/SmartMenuList.jsx';
import MinifyMenu      from 'vntd-shared/layout/MinifyMenu.jsx';
import NavigationStore from 'vntd-shared/stores/NavigationStore.jsx';

class Navigation extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            items: NavigationStore.getSideBarItems()
        };
        this._updateMenu = this._updateMenu.bind(this);
    }

    componentDidMount() {
        this.unsub = NavigationStore.listen(this._updateMenu);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateMenu(data, status) {
        if (status === 'update') {
            this.setState({
                items: NavigationStore.getSideBarItems()
            });
        }
    }

    render() {
        return (
            <aside id="left-panel">
                <nav>
                    <SmartMenuList items={this.state.items} />
                </nav>
                <MinifyMenu />
            </aside>
        )
    }
}

export default Navigation;
