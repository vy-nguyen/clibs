/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import { SectionWall }    from 'vntd-shared/layout/UserBase.jsx';
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
import DomainWall         from 'vntd-root/pages/personal/Domain.jsx';


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
            <DomainWall/>
        );
    }
}

MainWall.propTypes = {
};

export default MainWall;
