/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import React             from 'react-mod';
import KeyValueTable     from 'vntd-shared/layout/KeyValueTable.jsx';

class BaseMedia extends React.Component
{
    constructor(props) {
        super(props);
        this._onClick = this._onClick.bind(this);
    }

    _onClick() {
        if (this.props.onClick != null) {
            this.props.onClick(this.getArg());
        }
    }

    getArg() {
        return null;
    }

    getDetailKV(arg) {
        return null;
    }

    renderMediaBox(arg) {
        return null;
    }

    renderMediaBody(arg) {
        return null;
    }

    renderDetail(arg) {
        let kv = this.getDetailKV(arg);

        if (kv != null) {
            return (
                <KeyValueTable keyValueList={kv} oddRowKeyFmt=" " evenRowKeyFmt=" "/>
            );
        }
        return null;
    }

    renderBrief(arg) {
        return (
            <div className="media">
                <div className="media-left">
                    {this.renderMediaBox(arg)}
                </div>
                <div className="media-body">
                    {this.renderMediaBody(arg)}
                </div>
            </div>
        );
    }

    render() {
        let out, arg = this.getArg();
       
        if (arg == null) {
            return null;
        }
        out = this.props.detail === true ? this.renderDetail(arg) : this.renderBrief(arg);
        return (
            <div onClick={this._onClick}>
                {out}
            </div>
        );
    }
}

export default BaseMedia;
