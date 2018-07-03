/**
 * Written by Vy Nguyen (2018)
 */
'use strict';

import _             from 'lodash';
import React         from 'react-mod';

class BaseLinks extends React.Component
{
    constructor(props) {
        super(props);
    }

    _onClick(where) {
        if (this.props.onClick != null) {
            this.props.onClick(where);
        }
    }

    render() {
        let left, right, center, props = this.props, btnFmt = props.btnFmt;

        if (btnFmt == null) {
            btnFmt = "btn btn-default btn-sm";
        }
        if (props.leftTitle != null) {
            left = (
                <button type="button" className={btnFmt + " pull-left"}
                    onClick={this._onClick.bind(this, "l")}>
                    <i className="fa fa-lg fa-angle-double-left"/> {props.leftTitle}
                </button>
            );
        } else {
            left = null;
        }
        if (props.rightTitle != null) {
            right = (
                <button type="button" className={btnFmt + " pull-right"}
                    onClick={this._onClick.bind(this, "r")}>
                    {props.rightTitle} <i className="fa fa-lg fa-angle-double-right"/>
                </button>
            );
        } else {
            right = null;
        }
        if (props.centerTitle != null) {
            center = (
                <button className={btnFmt} onClick={this._onClick.bind(this, "c")}>
                    {props.centerTitle}
                </button>
            );
        } else {
            center = null;
        }
        return (
            <div className="row">
                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    {left}
                </div>
                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    {center}
                </div>
                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    {right}
                </div>
            </div>
        );
    }
}

export default BaseLinks;
