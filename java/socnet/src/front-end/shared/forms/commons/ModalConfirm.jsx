/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React       from 'react-mod';
import Modal       from 'react-modal';

const modalStyle = {
    content: {
        top        : '50%',
        left       : '50%',
        right      : 'auto',
        bottom     : 'auto',
        marginRight: '-50%',
        transform  : 'translate(-50%, -50%)',
        overflowX  : 'auto',
        overflowY  : 'scroll',
        zIndex     : 9999
    }
};

class ModalConfirm extends React.Component
{
    constructor() {
        super();
        this.state = {
            modalIsOpen: false
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({
            modalIsOpen: true
        });
        $('body').css("overflow", "hidden");
        if (this.props.openCb != null) {
            this.props.openCb();
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
        $('body').css("overflow", "auto");
        if (this.props.closeCb != null) {
            this.props.closeCb();
        }
    }

    render() {
        return (
            <Modal style={modalStyle} isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>
                <div className="modal-dialog" role="dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" aria-label="close" className="close" onClick={this.closeModal}>
                                <i className="fa fa-times"/>
                            </button>
                            <h3 className="modal-title">{this.props.modalTitle}</h3>
                        </div>
                        {this.props.children}
                    </div>
                </div>
            </Modal>
        );
    }
};

export default ModalConfirm;
