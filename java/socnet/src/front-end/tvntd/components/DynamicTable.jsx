/**
 * Vy Nguyen (2016)
 */
'use strict';

import _                 from 'lodash';
import React             from 'react-mod';

import WidgetGrid     from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget   from 'vntd-shared/widgets/JarvisWidget.jsx';
import Datatable      from 'vntd-shared/tables/Datatable.jsx';
import ModalButton    from 'vntd-shared/layout/ModalButton.jsx';
import InputStore     from 'vntd-shared/stores/NestableStore.jsx';

import { renderHtmInputl } from 'vntd-shared/forms/commons/GenericForm.jsx';

class DynamicTable extends React.Component
{
    constructor(props) {
        let val;

        super(props);
        this._renderInputModal = this._renderInputModal.bind(this);
        this._toTableEdit = this._toTableEdit.bind(this);
    }

    componentDidMount() {
        let elm, tabRows = this.props.tableData;

        DynamicTable.iterTableCell(tabRows, function(cell, key) {
            if (typeof cell === 'object') {
                elm = $('#' + cell.inpName);
                if (elm != null) {
                    if (cell.select === true) {
                        elm.on("change", this._selectChange.bind(this, cell, elm));
                    } else {
                        elm.on("blur", this._inputBlur.bind(this, cell, elm));
                    }
                }
            }
        }.bind(this));
    }

    static iterTableCell(tableData, iterFn) {
        _.forEach(tableData, function(inpRow) {
            _.forOwn(inpRow, function(cell, key) {
                iterFn(cell, key);
            });
        });
    }

    _selectChange(entry, elm) {
        let val = InputStore.storeItemIndex(entry.inpName, elm.val(), true);
        entry.inpHolder = val;
        entry.inpDefVal = val;
        console.log("selected " + val);
    }

    _inputBlur(entry, elm) {
        let val = InputStore.storeItemIndex(entry.inpName, elm.val(), true);
        entry.inpHolder = val;
        entry.inpDefVal = val;
        console.log("input change " + val);
    }

    _renderInputModal() {
        return <h2>Hello Modal</h2>
    }

    _toTableEdit(tabRows) {
        let val, entry, row, data = [];

        _.forEach(tabRows, function(inpRow) {
            row = {};
            _.forOwn(inpRow, function(cell, key) {
                if (typeof cell === 'object') {
                    entry = cell;
                    val = InputStore.getItemIndex(cell.inpName);
                    if (val != null) {
                        entry.inpHolder = val;
                        entry.inpDefVal = val;
                    }
                    row[key] = renderHtmInputl(entry);
                } else {
                    row[key] = cell;
                }
            });
            data.push(row);
        });
        return data;
    }

    render() {
        let table, tableData, columns = [], tableFmt = [];

        if (this.props.edit === true) {
            tableData = this._toTableEdit(this.props.tableData);
        } else {
            tableData = this.props.tableData;
        }
        _.forEach(this.props.tableFormat, function(value, key) {
            columns.push({data: value.key});
            tableFmt.push(
                <th key={_.uniqueId("dym-table-")}>
                    <i className={value.format}/>{value.header}
                </th>
            );
        });

        table = (
            <Datatable tableData={tableData}
                options={{
                    data: tableData,
                    columns: columns
                }}
                paginationLength={true}
                className="table table-striped table-bordered table-hover" width="100%">
                <thead>
                    <tr>
                        {tableFmt}
                    </tr>
                </thead>
            </Datatable>
        );
        return (
            <WidgetGrid>
                <div className="row">
                    <article className="col-sm-12">
                        <JarvisWidget editbutton={false} color="darken">
                            <header>
                                <span className="widget-icon">
                                    <i className="fa fa-table"/>
                                </span>
                                <h2>{this.props.tableTitle}</h2>
                                <ModalButton divClass="widget-toolbar"
                                    className="btn btn-sm btn-primary" buttonText="Add Row">
                                    {this._renderInputModal()}
                                </ModalButton>
                            </header>
                            <div>
                                <div className="widget-body no-padding">{table}</div>
                            </div>
                            {this.props.tableFooter}
                        </JarvisWidget>
                    </article>
                </div>
            </WidgetGrid>
        )
    }
}

export default DynamicTable;
