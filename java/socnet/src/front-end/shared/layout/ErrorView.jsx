/*
 * Written by Vy Nguyen (2016)
 */
'use strict';

import React         from 'react-mod';
import Reflux        from 'reflux';
import ErrorStore    from 'vntd-shared/stores/ErrorStore.jsx';

let ErrorView = React.createClass({

    mixins: [Reflux.connect(ErrorStore)],

    closeError: function(event) {
        event.stopPropagation();
        ErrorStore.clearError(this.props.errorId);
    },

    render: function() {
        let error = ErrorStore.hasError(this.props.errorId);
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
                        <a className="close pull-left" onClick={this.closeError}><i className="fa fa-times"/></a>
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
});

export default ErrorView;
