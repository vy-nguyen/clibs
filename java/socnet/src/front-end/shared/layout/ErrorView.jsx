/*
 * Written by Vy Nguyen (2016)
 */
'use strict';

import React         from 'react-mod';
import ErrorStore    from 'vntd-shared/stores/ErrorStore.jsx';
import Mesg          from 'vntd-root/components/Mesg.jsx';

class ErrorView extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            error: ErrorStore.hasError(props.errorId, props.mesg)
        };
        this._changeState  = this._changeState.bind(this);
        this._onCloseError = this._onCloseError.bind(this);
        this._errorMesg    = this._errorMesg.bind(this);
    }

    componentDidMount() {
        this.unsub = ErrorStore.listen(this._changeState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _onCloseError(event) {
        event.stopPropagation();
        ErrorStore.clearError(this.props.errorId);
    }

    _changeState(data, notif) {
        if (notif != null && this.props.errorId === notif.getErrorId()) {
            if (notif.hasError() == false) {
                notif = null;
            }
            this.setState({
                error: notif
            });
        }
    }

    _errorMesg(errorText) {
        return (
            <span className={this.props.className}>
                <a className="close pull-left" onClick={this._onCloseError}>
                    <i className="fa fa-times"/>
                </a>
                {errorText}
            </span>
        );
    }

    render() {
        let error = this.state.error,
            codeText, userText, userHelp;

        if (error == null) {
            return null;
        }
        userText = error.getUserText();
        if (userText != null) {
            if (this.props.mesg === true) {
                return this._errorMesg(userText);
            }
            userText = <p><Mesg text="Reason"/>: {userText}</p>;
        }
        userHelp = error.getUserHelp();
        if (userHelp != null) {
            userHelp = <p>{userHelp}</p>;
        }
        codeText = error.getErrorCodeText();
        if (codeText != null) {
            codeText = (
                <span>
                    <Mesg text="Status"/> {error.getErrorCode()}: {codeText}
                </span>
            );
        } else {
            codeText = <span>Error</span>
        }
        return (
            <div className={this.props.className}>
                <div className="page-header">
                    <button type="button" aria-label="close" className="close"
                        onClick={this._onCloseError}>
                        <i className="fa fa-times"/>
                    </button>
                    {codeText}
                </div>
                <div className="message-text">
                    <i>{userHelp}</i>
                    <strong>{userText}</strong>
                </div>
                <div className="row">
                    {this.props.children}
                </div>
            </div>
        );
    }

    static stackTrace() {
        let err = new Error();
        console.log(err.stack);
        return err.stack;
    }
}

export default ErrorView;
