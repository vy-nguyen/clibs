/**
 * Written by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React            from 'react-mod';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import Mesg             from 'vntd-root/components/Mesg.jsx';

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
        let btnState = this.state.btnState, className = btnState.getClassFmt();

        return (
            <button className={className} id={this.props.btnId}
                onClick={this._btnClick} disabled={btnState.isDisabled()}>
                <Mesg text={btnState.getText()}/>
            </button>
        );
    }

    static saveButtonFsm(success, needSave, done, fail, saving) {
        return StateButton.saveButtonFsmFull(
            { text: success,    format: "btn btn-primary" },
            { text: needSave,   format: "btn btn-danger"  },
            { text: done,       format: "btn btn-success" },
            { text: fail,       format: "btn btn-danger"  },
            { text: saving,     format: "btn btn-info"    }
        );
    }

    static saveButtonFsmFull(success, needSave, done, fail, saving) {
        return {
            success: {
                text     : success.text,
                disabled : true,
                nextState: "saving",
                className: success.format
            },
            failure: {
                text     : fail.text || "Saved Failed",
                disabled : false,
                nextState: "success",
                className: fail.format
            },
            needSave: {
                text     : needSave.text,
                disabled : false,
                nextState: "needSave",
                className: needSave.format
            },
            saving: {
                text     : saving.text || "Saving...",
                disabled : true,
                nextState: "saved",
                className: saving.format
            },
            saved: {
                text     : done.text,
                disabled : true,
                nextState: "success",
                className: done.format
            }
        };
    }

    static basicButton(success, failure) {
        return StateButton.basicButtonFsmFull(
            { text: success }, { text: failure }
        );
    }

    static basicButtonFsmFull(success, failure) {
        return {
            success: {
                text     : success.text || 'Success',
                disabled : false,
                nextState: 'success',
                className: success.format || 'btn btn-success'
            },
            failure: {
                text     : failure.text || 'Failure',
                disabled : false,
                nextState: 'failure',
                className: failure.format || 'btn btn-danger'
            }
        };
    }
}

export default StateButton;
