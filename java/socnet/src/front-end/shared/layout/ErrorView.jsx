
'use strict';

import React         from 'react-mod';
import Reflux        from 'reflux';
import _             from 'lodash';
import ErrorStore    from 'vntd-shared/stores/ErrorStore.jsx';

let ErrorView = React.createClass({

    mixins: [Reflux.connect(ErrorStore)],

    getInitialState: function() {
        return ErrorStore.getErrorData();
    },

    closeError: function(event) {
        event.stopPropagation();
        this.setState({
            errorCode: 0
        });
    },

    render: function() {
        if (this.state.errorCode === 0) {
            return null;
        }
        return (
            <div className={this.props.className + " alert"}>
                <a className="close" onClick={this.closeError}>
                    <i className="fa fa-times"/>
                </a>
                <span>Status {this.state.errorCode}: {this.state.serverText}</span>
                <p>{this.state.respText}</p>
                {this.props.children}
            </div>
        );
    }
});

export default ErrorView;
