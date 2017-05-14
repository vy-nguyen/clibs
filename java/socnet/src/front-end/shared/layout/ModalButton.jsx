/**
 * Vy Nguyen (2016)
 */
'use strict';

import React      from 'react-mod';
import Modal      from 'react-modal';
import Mesg       from 'vntd-root/components/Mesg.jsx';
import InputStore from 'vntd-shared/stores/NestableStore.jsx';
import { ModalChoice } from 'vntd-shared/forms/commons/ModalConfirm.jsx';
import { noOpRetNull } from 'vntd-shared/utils/Enum.jsx';

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
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this._okModalClose = this._okModalClose.bind(this);
        this._afterOpenModal = this._afterOpenModal.bind(this);
    }

    _onBlur() {
        let val, entry = this.props.entry;
        if (entry != null) {
            val = this.refs[entry.inpName].value;
            InputStore.storeItemIndex(entry.inpName, val, true);
        }
    }

    openModal() {
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

    _okModalClose() {
        this.setState({
            modalIsOpen: false
        });
        $("body").css("overflow", "auto");
    }

    closeModal(force) {
        if (force !== true && this.props.closeWarning != null) {
            this.refs.choice.openModal();
            return;
        }
        if (this.props.closeCb != null) {
            if (this.props.closeCb() == false && force !== true) {
                return;
            }
        }
        this._okModalClose();
    }

    render() {
        let entry, input, choice = null,
        title = this.props.html ?
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
                        <button type="button" className={this.props.buttonFmt}
                            onClick={this.openModal}>
                            <Mesg text={this.props.buttonText}/>
                        </button>
                    </span>
                </div>
            );
        } else {
            input = (
                <button type="button"
                    className={this.props.buttonFmt} onClick={this.openModal}>
                    <Mesg text={this.props.buttonText}/>
                </button>
            );
        }
        if (this.props.closeWarning != null) {
            choice = (
                <ModalChoice ref="choice" okFn={this._okModalClose}
                    cancelFn={noOpRetNull} closeWarning={this.props.closeWarning}/>
            );
        }
        return (
            <div className={this.props.divClass || ""}>
                {input}
                <Modal style={modalStyle}
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this._afterOpenModal}
                    onRequestClose={this.closeModal}>
                    <div className="container">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" aria-label="close"
                                    className="close" onClick={this.closeModal}>
                                    <i className="fa fa-times"/>
                                </button>
                                {title}
                            </div>
                            <div className="modal-body">
                                {choice}
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
