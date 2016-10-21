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

class ModalButton extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false
        };
        this._openModal = this._openModal.bind(this);
        this._closeModal = this._closeModal.bind(this);
        this._afterOpenModal = this._afterOpenModal.bind(this);
    }

    _openModal() {
        this.setState({
            modalIsOpen: true
        });
        $("body").css("overflow", "hidden");
        if (this.props.openCb != null) {
            this.props.openCb();
        }
    }

    _afterOpenModal() {
        // references are now sync'd and can be accessed.
        // this.refs.subtitle.style.color = '#f00';
    }

    _closeModal() {
        this.setState({
            modalIsOpen: false
        });
        $("body").css("overflow", "auto");
        if (this.props.closeCb != null) {
            this.props.closeCb();
        }
    }

    render() {
        return (
            <div className={this.props.divClass || ""}>
                <a className={this.props.className} onClick={this._openModal}>{this.props.buttonText}</a>
                <Modal style={modalStyle}
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this._afterOpenModal}
                    onRequestClose={this._closeModal}>
                    <div className="container">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" aria-label="close" className="close" onClick={this._closeModal}>
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
}

export default ModalButton;
