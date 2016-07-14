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
        transform  : 'translate(-50%, -50%)',
        overflowX  : 'auto',
        overflowY  : 'scroll',
        zIndex     : 9999
    }
};

let ModalButton = React.createClass({

    getInitialState: function() {
        return { modalIsOpen: false };
    },

    openModal: function() {
        this.setState({modalIsOpen: true});
        $("body").css("overflow", "hidden");
        if (this.props.openCb != null) {
            this.props.openCb();
        }
    },

    afterOpenModal: function() {
        // references are now sync'd and can be accessed.
        // this.refs.subtitle.style.color = '#f00';
    },

    closeModal: function() {
        this.setState({modalIsOpen: false});
        $("body").css("overflow", "auto");
        if (this.props.closeCb != null) {
            this.props.closeCb();
        }
    },

    render: function() {
        return (
            <div className={this.props.divClass || ""}>
                <a className={this.props.className} onClick={this.openModal}>{this.props.buttonText}</a>
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
                                    <h3 className="modal-title">{this.props.modalTitle}</h3>
                                }
                            </div>
                            <div className="modal-body">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
});

export default ModalButton;
