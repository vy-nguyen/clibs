/*
 * Written by Vy Nguyen (2016)
 */
'use strict';

import React         from 'react-mod';
import Reflux        from 'reflux';
import ErrorStore    from 'vntd-shared/stores/ErrorStore.jsx';

class ErrorView extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            error: ErrorStore.hasError(props.errorId)
        };
        this._changeState = this._changeState.bind(this);
        this._onCloseError = this._onCloseError.bind(this);
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

    _changeState(data) {
        let error = ErrorStore.hasError(this.props.errorId);
        if (this.state.error != error) {
            this.setState({
                error: error
            });
        }
    }

    render() {
        let error = this.state.error;
        if (error == null) {
            return null;
        }
        let codeText = error.getErrorCodeText();
        if (codeText != null) {
            codeText = (
                <div>
                    <span>Status {error.getErrorCode()}: {codeText}</span>
                    <hr/>
                </div>
            );
        }
        let userText = error.getUserText();
        if (userText != null) {
            userText = <p>Reason: {userText}</p>;
        }
        let userHelp = error.getUserHelp();
        if (userHelp != null) {
            userHelp = <p>Action: {userHelp}</p>;
        }
        return (
            <div className={this.props.className}>
                <div className="row">
                    <div className="col-sm-1 col-md-1 col-lg-1">
                        <a className="close pull-left" onClick={this._onCloseError}><i className="fa fa-times"/></a>
                    </div>
                    <div className="col-sm-11 col-md-11 col-lg-11">
                        {codeText}
                        {userText}
                        {userHelp}
                    </div>
                </div>
                {this.props.children}
            </div>
        );
    }
}

export default ErrorView;
