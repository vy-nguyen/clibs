/**
 * Written by Vy Nguyen (2017)
 */
'use strict';

import _                 from 'lodash';
import React             from 'react-mod';
import PropTypes         from 'prop-types';

import InputBase         from 'vntd-shared/layout/InputBase.jsx';
import QuestionStore     from 'vntd-root/stores/QuestionStore.jsx';

class Questionare extends InputBase
{
    constructor(props) {
        super(props);
    }

    _updateState(data, item, code, id) {
        console.log("update state ");
        console.log(item);
        console.log(code);
    }

    _renderForm() {
        console.log("====== Questionare ==== ");
        console.log(this.props);
        return <h1>Questionare</h1>
    }
}

export default Questionare;
