/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import React    from 'react-mod';
import NavStore from 'vntd-shared/stores/NavigationStore.jsx';

class NavStoreBase extends React.Component
{
    constructor(props) {
        super(props);
        this._updateState = this._updateState.bind(this);
        this.state = {
            sideBar: NavStore.isSideBarOn()
        }
    }

    componentDidMount() {
        this.unsub = NavStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(data, status) {
        if (status !== 'sidebar') {
            return;
        }
        this.setState({
            sideBar: NavStore.isSideBarOn()
        });
    }
}

export default NavStoreBase;
