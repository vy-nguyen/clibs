/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _      from 'lodash';
import React  from 'react-mod';

class KeyValueTable extends React.Component
{
    render() {
        let props         = this.props,
            oddRowFmt     = props.oddRowFmt || "success",
            oddRowKeyFmt  = props.oddRowKeyFmt || "label label-danger",
            oddRowValFmt  = props.oddRowValFmt || "",

            evenRowFmt    = props.evenRowFmt || "info",
            evenRowKeyFmt = props.evenRowKeyFmt || "label label-success",
            evenRowValFmt = props.evenRowValFmt || "",

            rowFmt = null,
            keyFmt = null,
            valFmt = null,
            row = [];

        _.forOwn(props.keyValueList, function(elm, idx) {
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
            <table className={"table " + props.className}>
                <tbody>
                    {row}
                </tbody>
            </table>
        );
    }
}

export default KeyValueTable;
