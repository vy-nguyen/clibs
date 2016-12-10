/**
 * Written by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React            from 'react-mod';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';

class StateButton extends React.Component
{
    constructor(props) {
        super(props);
        this.mount = 0;
        this._btnClick = this._btnClick.bind(this);
        this._updateState = this._updateState.bind(this);
        this.state = {
            stateCode: "success",
            btnState : StateButtonStore.getButtonState(props.btnId)
        };
    }

    componentDidMount() {
        this.unsub = StateButtonStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(btnState) {
        if (btnState === this.state.btnState) {
            let curState = btnState.getStateCode();
            if (curState !== this.state.stateCode) {
                this.setState({
                    stateCode: curState
                });
            }
        }
    }

    _btnClick(event) {
        event.preventDefault();
        this.props.onClick();
    }

    render() {
        let btnState = this.state.btnState;
        let className = btnState.getClassFmt();
        return (
            <button className={className} onClick={this._btnClick} disabled={btnState.isDisabled()}>
                {btnState.getText()}
            </button>
        );
    }

    static saveButtonFsm(success, needSave, done, fail) {
        return {
            success: {
                text     : success,
                disabled : true,
                nextState: "saving",
                className: "btn btn-primary"
            },
            failure: {
                text     : fail != null ? fail : "Saved Failed",
                disabled : false,
                nextState: "success",
                className: "btn btn-danger"
            },
            needSave: {
                text     : needSave,
                disabled : false,
                nextState: "needSave",
                className: "btn btn-danger"
            },
            saving: {
                text     : "Saving...",
                disabled : true,
                nextState: "saved",
                className: "btn btn-info"
            },
            saved: {
                text     : done,
                disabled : true,
                nextState: "success",
                className: "btn btn-success"
            }
        };
    }
};

export default StateButton;
