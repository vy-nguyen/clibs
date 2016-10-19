/**
 * Written by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React            from 'react-mod';
import Reflux           from 'reflux';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';

class StateButton extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            stateCode: "success"
        };
        this.mount = 0;
        this._btnClick = this._btnClick.bind(this);
        this._updateState = this._updateState.bind(this);
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

    _updateState(data) {
        let btnState = StateButtonStore.getButtonState(this.props.btnId);
        let curState = btnState.getStateCode();
        if (curState !== this.state.stateCode) {
            this.setState({
                stateCode: curState
            });
        }
    }

    _btnClick(event) {
        event.preventDefault();
        this.props.onClick();
    }

    render() {
        let btnState = StateButtonStore.getButtonState(this.props.btnId);
        let className = btnState.getClassFmt();
        return (
            <button className={className} onClick={this._btnClick} disabled={btnState.isDisabled()}>
                {btnState.getText()}
            </button>
        );
    }
};

export default StateButton;
