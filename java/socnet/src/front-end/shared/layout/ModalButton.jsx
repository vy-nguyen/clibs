/**
 * Vy Nguyen (2016)
 */
'use strict';

import React      from 'react-mod';
import Modal      from 'react-modal';
import Mesg       from 'vntd-root/components/Mesg.jsx';
import InputStore from 'vntd-shared/stores/NestableStore.jsx';

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
        this._onBlur = this._onBlur.bind(this);
        this._openModal = this._openModal.bind(this);
        this._closeModal = this._closeModal.bind(this);
        this._afterOpenModal = this._afterOpenModal.bind(this);
    }

    _onBlur() {
        let val, entry = this.props.entry;
        if (entry != null) {
            val = this.refs[entry.inpName].value;
            InputStore.storeItemIndex(entry.inpName, val, true);
        }
    }

    _openModal() {
        let val = 0, entry = this.props.entry;
        if (entry != null) {
            val = InputStore.getItemIndex(entry.inpName);
        }
        this.setState({
            modalIsOpen: true
        });
        $("body").css("overflow", "hidden");
        if (this.props.openCb != null) {
            this.props.openCb(val);
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
        let entry, input, title = this.props.html ?
            <div dangerouslySetInnerHTML={{__html: this.props.modalTitle}}/> :
            <h3 className="modal-title">{this.props.modalTitle}</h3>

        entry = this.props.entry;
        if (entry != null) {
            input = (
                <div className="input-group col-sx-6 col-sm-6 col-md-4 col-lg-4">
                    <input id={entry.inpName} type="text" className="form-control"
                        onBlur={this._onBlur} ref={entry.inpName}
                        defaultValue={entry.inpDefVal} placeholder={entry.inpHolder}
                    />
                    <span className="input-group-btn">
                        <a className={this.props.className} onClick={this._openModal}>
                            <Mesg text={this.props.buttonText}/>
                        </a>
                    </span>
                </div>
            );
        } else {
            input = (
                <a className={this.props.className} onClick={this._openModal}>
                    <Mesg text={this.props.buttonText}/>
                </a>
            );
        }
        return (
            <div className={this.props.divClass || ""}>
                {input}
                <Modal style={modalStyle}
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this._afterOpenModal}
                    onRequestClose={this._closeModal}>
                    <div className="container">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" aria-label="close"
                                    className="close" onClick={this._closeModal}>
                                    <i className="fa fa-times"/>
                                </button>
                                {title}
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
