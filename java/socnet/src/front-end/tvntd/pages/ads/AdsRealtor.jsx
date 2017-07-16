/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

class AdsRealtor extends React.Component
{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    render() {
        return (
            null
        );
    }
}

AdsRealtor.propTypes = {
};

export default AdsRealtor;
