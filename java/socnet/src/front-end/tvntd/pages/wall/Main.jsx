/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import UserStore          from 'vntd-shared/stores/UserStore.jsx';

class SectionWall extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
    }
}

class MainWall extends React.Component
{
    constructor(props) {
        super(props);

        this._updateState = this._updateState.bind(this);
    }

    componentDidMount() {
        this.unsub = UserStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState() {
    }

    render() {
        return (
            <h1>App Wall</h1>
        );
    }
}

MainWall.propTypes = {
};

export default MainWall;
