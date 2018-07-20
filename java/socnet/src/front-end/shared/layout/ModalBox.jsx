/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _              from 'lodash';
import React          from 'react-mod';
import ModalConfirm   from 'vntd-shared/forms/commons/ModalConfirm.jsx';

class ModalBox extends React.Component
{
    constructor(props) {
        super(props);
        this.state = null;
    }

    openModal(arg) {
        this.setState(arg);
        this.refs.modal.openModal();
    }

    _renderMain() {
        if (this.state == null) {
            return null;
        }
        return <h1>Main</h1>;
    }

    render() {
        if (this.props.modal === true) {
            let title = this.state == null ? "Modal" : this.state.title;
            return (
                <ModalConfirm ref="modal" height="auto" modalTitle={title}>
                    {this._renderMain()}
                </ModalConfirm>
            );
        }
        return this._renderMain();
    }
}

export default ModalBox;
