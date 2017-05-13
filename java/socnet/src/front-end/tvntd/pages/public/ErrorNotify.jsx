/*
 * Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React, {PropTypes} from 'react-mod';

import ErrorStore         from 'vntd-shared/stores/ErrorStore.jsx';
import ModalConfirm       from 'vntd-shared/forms/commons/ModalConfirm.jsx';
import Mesg               from 'vntd-root/components/Mesg.jsx';

class ErrorNotify extends React.Component
{
    constructor(props) {
        super(props);
        this._okClose     = this._okClose.bind(this);
        this._resetState  = this._resetState.bind(this);
        this._updateState = this._updateState.bind(this);
        this.openModal    = this.openModal.bind(this);

        this.state = this._resetState();
    }

    openModal() {
        this.refs.mesg.openModal();
    }

    componentDidMount() {
        this.unsub = ErrorStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _resetState() {
        return {
            notif : null,
            text  : null,
            header: null
        };
    }

    _updateState(data, notif) {
        if (notif != null && this.props.errorId === notif.getErrorId()) {
            this.setState({
                notif : notif,
                text  : notif.getUserText(),
                header: notif.getErrorHeader()
            });
            this.refs.mesg.openModal();
        }
    }

    _okClose() {
        this.refs.mesg.closeModal();
        this.setState(this._resetState());
    }

    render() {
        let { notif, text, header } = this.state;

        if (notif == null) {
            return null;
        }
        return (
            <ModalConfirm ref="mesg" height={300} modalTitle={header}>
                <div className="modal-body">
                    <h5>{text}</h5>
                </div>
                <div className="modal-footer">
                    <button className={notif.getFormatStyle()} onClick={this._okClose}>
                        <Mesg text="OK"/>
                    </button>
                </div>
            </ModalConfirm>
        );
    }
}

ErrorNotify.propTypes = {
};

export default ErrorNotify;
