/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _              from 'lodash';
import React          from 'react-mod';
import ComponentBase  from 'vntd-shared/layout/ComponentBase.jsx';
import ModalConfirm   from 'vntd-shared/forms/commons/ModalConfirm.jsx';

class ModalBox extends ComponentBase
{
    constructor(props, id, stores) {
        super(props, id, stores);
        this.state = null;
    }

    openModal(arg) {
        this.refs.modal.openModal();
    }

    _renderMain() {
        if (this.state == null) {
            return null;
        }
        return <h1>Main</h1>;
    }

    render() {
        let out;

        if (this.props.modal === true) {
            let title = this.state == null ? "Modal" : this.state.title;
            out = (
                <ModalConfirm ref="modal" height="auto" modalTitle={title}>
                    {this._renderMain()}
                </ModalConfirm>
            );
        } else {
            out = this._renderMain();
        }
        return (
            <div onClick={this._onClick()}>
                {out}
            </div>
        );
    }
}

export default ModalBox;
