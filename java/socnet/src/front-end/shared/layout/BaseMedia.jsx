/*
 * Written by Vy Nguyen (2018)
 */
'use strict';

import React             from 'react-mod';
import KeyValueTable     from 'vntd-shared/layout/KeyValueTable.jsx';
import ComponentBase     from 'vntd-shared/layout/ComponentBase.jsx';

class BaseMedia extends ComponentBase
{
    constructor(props, id, stores) {
        super(props, id, stores);
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
        if (this.props.full === true) {
            return (
                <div onClick={this._onClick}>
                    {this.renderBrief(arg)}
                    {this.renderDetail(arg)}
                </div>
            );
        }
        out = this.props.detail === true ?
            this.renderDetail(arg) : this.renderBrief(arg);
        return (
            <div onClick={this._onClick}>
                {out}
            </div>
        );
    }
}

export default BaseMedia;
