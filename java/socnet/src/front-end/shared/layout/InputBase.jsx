/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

import React               from 'react-mod';
import Mesg                from 'vntd-root/components/Mesg.jsx';
import JarvisWidget        from 'vntd-shared/widgets/JarvisWidget.jsx';

class InputBase extends React.Component
{
    constructor(props, id) {
        super(props);
        this.id = id || props.id;
        this._listStore = props.listStore;
        this._updateState = this._updateState.bind(this);
        console.log("init input " + this.id + ", store");
        console.log(this._listStore);
    }

    componentDidMount() {
        console.log("Listen to store " + this._listStore);
        this.unsub = this._listStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState(data, item, code) {
        console.log("base update...");
    }

    _renderForm() {
        return null;
    }

    render() {
        console.log("render input base");
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
