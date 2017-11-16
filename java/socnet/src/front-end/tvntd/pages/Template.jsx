/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';

class PostAds extends React.Component
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
            null
        );
    }
}

PostAds.propTypes = {
};

export default PostAds;
