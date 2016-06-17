/**
 * Vy Nguyen (2016)
 */
'use strict';

import React    from 'react-mod';
import ReactDOM from 'react-dom';
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
        this.refs.subtitle.style.color = '#f00';
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
                    <div className="form-group alert ">
                        <a className="close" aria-label="close" onClick={this.closeModal}>x</a>
                    </div>
                    <h2 ref="subtitle">Hello</h2>
                    <div>I am a modal</div>
                    <form>
                        <input />
                        <button>tab navigation</button>
                        <button>stays</button>
                        <button>inside</button>
                        <button>the modal</button>
                    </form>
                </Modal>
            </div>
        );
    }
});

export default ModalButton;
