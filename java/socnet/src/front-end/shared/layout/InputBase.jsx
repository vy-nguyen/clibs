/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import React               from 'react-mod';
import Mesg                from 'vntd-root/components/Mesg.jsx';
import InputStore          from 'vntd-shared/stores/NestableStore.jsx';
import JarvisWidget        from 'vntd-shared/widgets/JarvisWidget.jsx';

class InputBase extends React.Component
{
    constructor(props, id) {
        super(props);
        this.id = id;
        this._updateState = this._updateState.bind(this);
    }

    componentDidMount() {
        this.unsub = InputStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(item, id, code) {
        if (this.id !== id) {
            return false;
        }
        return true;
    }

    _renderForm() {
        return null;
    }

    render() {
        return (
            <JarvisWidget id={this.id} color="purple">
                <header>
                    <span className="widget-icon"><i className="fa fa-pencil"/></span>
                    <h2>{this.title}</h2>
                </header>
                <div className="widget-body">
                    {this._renderForm()}
                </div>
            </JarvisWidget>
        );
    }
}

export default InputBase;
