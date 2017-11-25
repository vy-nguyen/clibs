/**
 * Written by Vy Nguyen (2017)
 */
'use strict';

import _                 from 'lodash';
import React             from 'react-mod';
import PropTypes         from 'prop-types';

class Questionare extends React.Component
{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        console.log("====== Questionare ==== ");
        console.log(this.props.data);
        return (
            <h1>Questionare</h1>
        );
    }
}

export default Questionare;
