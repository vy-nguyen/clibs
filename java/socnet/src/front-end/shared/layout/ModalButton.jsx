/**
 * Vy Nguyen (2016)
 */
'use strict';

import React    from 'react-mod';
import Modal    from 'react-modal';

const modalStyle = {
    content: {
        top        : '50%',
        left       : '50%',
        right      : 'auto',
        bottom     : 'auto',
        marginRight: '-50%',
        transform  : 'translate(-50%, -50%)'
    }
};

let ModalButton = React.createClass({

    getInitialState: function() {
        return { modalIsOpen: false };
    },

    openModal: function() {
        this.setState({modalIsOpen: true});
    },

    afterOpenModal: function() {
        // references are now sync'd and can be accessed.
        // this.refs.subtitle.style.color = '#f00';
    },

    closeModal: function() {
        this.setState({modalIsOpen: false});
    },

    render: function() {
        return (
            <div className={this.props.divClass || ""}>
                <a className={this.props.className} onClick={this.openModal}>{this.props.buttonText}</a>;
                <Modal style={modalStyle}
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}>
                    <div className="container">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" aria-label="close" className="close" onClick={this.closeModal}>
                                    <i className="fa fa-times"/>
                                </button>
                                {
                                    this.props.html ? 
                                    <div dangerouslySetInnerHTML={{__html: this.props.modalTitle}}/> :
                                    <h4 className="modal-title">{this.props.modalTitle}</h4>
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="well well-lg">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
});

/*
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title">Confirmation</h4>
        </div>
        <div class="modal-body">
            <p>Do you want to save changes you made to document before closing?</p>
            <p class="text-warning"><small>If you don't save, your changes will be lost.</small></p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
        </div>
        </div>
        </div>
*/
export default ModalButton;
