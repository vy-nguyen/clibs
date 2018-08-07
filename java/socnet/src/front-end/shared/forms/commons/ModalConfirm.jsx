/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import $           from 'jquery';
import React       from 'react-mod';
import PropTypes   from 'prop-types';
import Modal       from 'react-modal';
import NavStore    from 'vntd-shared/stores/NavigationStore.jsx';
import Mesg        from 'vntd-root/components/Mesg.jsx';

let modalStyle = {
    content: {
        top        : '50%',
        left       : '50%',
        right      : 'auto',
        bottom     : 'auto',
        height     : '500px',
        marginRight: '-50%',
        transform  : 'translate(-50%, -50%)',
        overflowX  : 'auto',
        overflowY  : 'auto',
        overflow   : 'scroll',
        zIndex     : 9999
    }
};

let dialogStyle = {
    content: {
        top        : '50%',
        left       : '50%',
        right      : 'auto',
        bottom     : 'auto',
        height     : '200px',
        marginRight: '-50%',
        transform  : 'translate(-50%, -50%)',
        overflowX  : 'auto',
        overflowY  : 'scroll',
        overflow   : 'scroll',
        zIndex     : 9999
    }
};

class ModalChoice extends React.Component
{
    constructor(props) {
        super(props);
        this._cancelClick = this._cancelClick.bind(this);
        this._okClick     = this._okClick.bind(this);
        this.openModal    = this.openModal.bind(this);
        this.closeModal   = this.closeModal.bind(this);
        this.state = {
            modalIsOpen: false
        };
    }

    _cancelClick() {
        if (this.props.cancelFn != null) {
            this.props.cancelFn();
        }
        this.setState({
            modalIsOpen: false
        });
        $('body').css("overflow", "auto");
    }

    _okClick() {
        this.props.okFn();
        this.setState({
            modalIsOpen: false
        });
        $('body').css("overflow", "auto");
    }

    openModal() {
        this.setState({
            modalIsOpen: true
        });
        $('body').css("overflow", "hidden");
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
        $('body').css("overflow", "auto");
    }

    render() {
        const fmt = "btn btn-primary pull-right";
        let mesg = this.props.closeWarning != null ?
            this.props.closeWarning :
            "You may lose unsaved data, ok to close?",

        cancelBtn = this.props.cancelFn == null ? null :
            <button className={fmt} onClick={this._cancelClick}>
                <Mesg text="Cancel"/>
            </button>;

        return (
            <Modal ref="modal" style={dialogStyle} isOpen={this.state.modalIsOpen}
                onRequestClose={this._cancelClick}>
                <div className="modal-dialog" role="dialog">
                    <div className="modal-content">
                        <h3 className="modal-title">
                            <Mesg text={mesg}/>
                        </h3>
                    </div>
                    <div className="modal-footer">
                        <button className={fmt} onClick={this._okClick}>
                            <Mesg text="OK"/> 
                        </button>
                        {cancelBtn}
                    </div>
                </div>
            </Modal>
        );
    }
}

class ModalConfirm extends React.Component
{
    static propTypes() {
        return {
            openCb    : PropTypes.func,
            closeCb   : PropTypes.func,
            modalTitle: PropTypes.string.isRequired,
            any       : PropTypes.any
        }
    }

    constructor() {
        super();
        this.state = {
            modalIsOpen: false
        };
        this.openModal     = this.openModal.bind(this);
        this.closeModal    = this.closeModal.bind(this);
        this._okModalClose = this._okModalClose.bind(this);
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
        if (this.props.confirmClose != null) {
            this.refs.choice.openModal();
            return;
        }
        if (this.props.closeCb != null) {
            if (this.props.closeCb() === false) {
                return;
            }
        }
        this._okModalClose();
    }

    _okModalClose() {
        this.setState({
            modalIsOpen: false,
        });
        $('body').css("overflow", "auto");
    }

    render() {
        let choice = null, style = modalStyle;
        modalStyle.content.height =
            this.props.height == null ? NavStore.getMaxHeight() : this.props.height;

        if (this.props.modalStyle != null) {
            style = this.props.modalStyle;
        }
        if (this.props.closeWarning != null) {
            choice = (
                <ModalChoice ref="choice" okFn={this._okModalClose}
                    closeWarning={this.props.closeWarning}/>
            );
        }
        return (
            <Modal style={style} isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}>
                <div className="modal-dialog" role="dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" aria-label="close"
                                className="close" onClick={this.closeModal}>
                                <i className="fa fa-times"/>
                            </button>
                            <h2 className="modal-title">
                                <Mesg text={this.props.modalTitle}/>
                            </h2>
                        </div>
                        {choice}
                        {this.props.children}
                    </div>
                </div>
            </Modal>
        );
    }
}

export { ModalConfirm, ModalChoice, modalStyle, dialogStyle }
export default ModalConfirm;
