/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _      from 'lodash';
import React  from 'react-mod';

let KeyValueTable = React.createClass({
    render: function() {
        let oddRowFmt     = this.props.oddRowFmt || "success";
        let oddRowKeyFmt  = this.props.oddRowKeyFmt || "label label-danger";
        let oddRowValFmt  = this.props.oddRowValFmt || "";

        let evenRowFmt    = this.props.evenRowFmt || "info";
        let evenRowKeyFmt = this.props.evenRowKeyFmt || "label label-success";
        let evenRowValFmt = this.props.evenRowValFmt || "";

        let rowFmt = null;
        let keyFmt = null;
        let valFmt = null;
        let row = [];

        _.forOwn(this.props.keyValueList, function(elm, idx) {
            if (idx % 2) {
                rowFmt = oddRowFmt;
                keyFmt = elm.keyFmt || oddRowKeyFmt;
                valFmt = elm.valFmt || oddRowValFmt;
            } else {
                rowFmt = evenRowFmt;
                keyFmt = elm.keyFmt || evenRowKeyFmt;
                valFmt = elm.valFmt || evenRowValFmt;
            }
            if (elm.valRows === true) {
                row.push(
                    <tr key={_.uniqueId("kv-elm-")} className={rowFmt}>
                        <td><span className={keyFmt}>{elm.key}</span></td>
                    </tr>
                );
                _.forOwn(elm.val, function(v, index) {
                    row.push(
                        <tr key={_.uniqueId("kv-elm-")} className={rowFmt}>
                            <td colSpan="2"><span className={valFmt}>{v}</span></td>
                        </tr>
                    )
                });
            } else {
                row.push(
                    <tr key={_.uniqueId("kv-elm-")} className={rowFmt}>
                        <td><span className={keyFmt}>{elm.key}</span></td>
                        <td><span className={valFmt}>{elm.val}</span></td>
                    </tr>
                );
            }
        });
        return (
            <table className={"table " + this.props.className}>
                <tbody>
                    {row}
                </tbody>
            </table>
        );
    }
});

export default KeyValueTable;
