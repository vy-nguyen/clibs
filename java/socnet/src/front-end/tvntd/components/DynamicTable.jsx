/**
 * Vy Nguyen (2016)
 */
'use strict';

import _                 from 'lodash';
import React             from 'react-mod';

import WidgetGrid        from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget      from 'vntd-shared/widgets/JarvisWidget.jsx';
import Datatable         from 'vntd-shared/tables/Datatable.jsx';
import ModalButton       from 'vntd-shared/layout/ModalButton.jsx';
import InputStore        from 'vntd-shared/stores/NestableStore.jsx';
import Mesg              from 'vntd-root/components/Mesg.jsx';
import { ModalChoice }   from 'vntd-shared/forms/commons/ModalConfirm.jsx';

import {
    InputWrap, renderHtmlInput
} from 'vntd-shared/forms/commons/GenericForm.jsx';

class RenderRow extends React.Component
{
    constructor(props) {
        super(props);
        this._cloneRow    = this._cloneRow.bind(this);
        this._createRows  = this._createRows.bind(this);
        this._submitRows  = this._submitRows.bind(this);
        this._cleanupData = this._cleanupData.bind(this);

        this.state = this._cloneRow(props, props.rowCount || 1);
    }

    componentDidUpdate() {
        this.componentDidMount();
    }

    componentDidMount() {
        let tabRows = this.state.tableData;

        RenderRow.iterTableCell(tabRows, function(cell, row, key) {
            RenderRow.bindCellEvent(cell, row, this._inputChange, this);
        }.bind(this));
    }

    componentWillUnmount() {
        this._cleanupData();
    }

    _cloneRow(props, count) {
        let newRows, tableData;

        tableData = props.tableData;
        if (props.cloneRow == null || tableData == null || _.isEmpty(tableData[0])) {
            return {
                rowCount  : 0,
                tableData: null
            };
        }
        newRows = {
            rowCount : count,
            tableData: props.cloneRow(tableData[0], count)
        };
        if (this.state != null) {
            _.forEach(this.state.tableData, function(row) {
                newRows.rowCount = newRows.rowCount + 1;
                newRows.tableData.push(row);
            });
        }
        return newRows;
    }

    _inputChange(entry, row, elm) {
        let cellVal, rowVal = InputStore.getItemIndex(row.rowId);

        cellVal = InputStore.storeItemIndex(entry.inpName, elm.val(), true);
        entry.inpHolder = cellVal;
        entry.inpDefVal = cellVal;

        if (entry.ownerRow == null) {
            entry.ownerRow = row;
        }
        if (rowVal == null) {
            rowVal = row;
            InputStore.storeItemIndex(row.rowId, row, true);
        }
        console.log("Input change val " + cellVal);
    }

    _createRows() {
        let val = InputStore.getItemIndex(this.props.tableId);
        this.setState(this._cloneRow(this.props, val || 1));
    }

    _submitRows() {
        let row, data = [];
        _.forEach(this.state.tableData, function(inpRow) {
            row = {
                invalid: false
            };
            _.forOwn(inpRow, function(cell, key) {
                if (typeof cell === 'object') {
                    row[key] = InputStore.getItemIndex(cell.inpName);
                    if (row[key] == null) {
                        row[key] = cell.inpDefVal;
                    } else {
                        InputStore.freeItemIndex(cell.inpName);
                    }
                } else {
                    row[key] = cell;
                }
                if (row[key] == null) {
                    row.invalid = true
                }
            });
            if (row.invalid === false) {
                delete row.clone;
                delete row.invalid;
                data.push(row);
            }
            InputStore.freeItemIndex(row.rowId);
        });
        console.log(data);
        this.props.onSubmit(data);
    }

    _cleanupData() {
    }

    render() {
        const entry = {
            inpName  : this.props.tableId,
            inpDefVal: 1,
            inpHolder: "Enter number of rows",
            inpClass : "pull-right col-sx-6 col-sm-6 col-md-4 col-lg-4",
            button   : "Add rows",
            btnClick : this._createRows,
            inlineButtons: (
                <button className="btn btn-primary" onClick={this._submitRows}>
                    Submit
                </button>
            )
        };
        let table, columns, renderData, tableData, tableFmt = [];

        tableData = this.state.tableData;
        if (tableData == null || this.props.cloneRow == null) {
            return <p>Don't know how to clone row</p>
        }
        renderData = RenderRow.toTableEdit(tableData, null);
        columns    = RenderRow.renderHeader(this.props.tableFormat, tableFmt);
        table      = RenderRow.renderTable(renderData, tableFmt, columns);

        return (
            <div className="row">
                <div className="widget-header">
                    <InputWrap entry={entry}/>
                </div>
                <div className="widget-body no-padding">
                    {table}
                </div>
            </div>
        );
    }

    static bindCellEvent(cell, row, callbackFn, bind) {
        let elm, cbFn;

        if (typeof cell === 'object') {
            elm = $('#' + cell.inpName);
            if (elm != null) {
                cbFn = callbackFn.bind(bind, cell, row, elm);
                if (cell.select === true) {
                    elm.on('change', cbFn);
                } else {
                    elm.on('blur', cbFn);
                }
            }
        }
    }

    static toTableEdit(tabRows, newRows) {
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
                    row[key] = renderHtmlInput(entry);
                } else {
                    row[key] = cell;
                }
            });
            data.push(row);
        });
        _.forOwn(newRows, function(inpRow) {
            row = {};
            _.forOwn(inpRow, function(cell, key) {
                if (typeof cell === 'object') {
                    row[key] = renderHtmlInput(cell);
                } else {
                    row[key] = cell;
                }
            });
            data.push(row);
        });
        return data;
    }

    static renderTable(tableData, tableFmt, columns) {
        return (
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
    }

    static renderHeader(headerFmt, tableFmt) {
        let columns = [];

        _.forEach(headerFmt, function(value, key) {
            columns.push({data: value.key});
            tableFmt.push(
                <th key={_.uniqueId("dym-table-")}>
                    <i className={value.format}/>{value.header}
                </th>
            );
        });
        return columns;
    }

    static iterTableCell(tableData, iterFn) {
        _.forOwn(tableData, function(inpRow) {
            _.forOwn(inpRow, function(cell, key) {
                iterFn(cell, inpRow, key);
            });
        });
    }
}

class DynamicTable extends React.Component
{
    constructor(props) {
        let val;

        super(props);
        this._renderInputModal = this._renderInputModal.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        this._getTableData = this._getTableData.bind(this);
        this._addNewRows   = this._addNewRows.bind(this);

        this.state = {
            newRows: {}
        }
    }

    componentDidMount() {
        let elm, changeFn, tabRows = this._getTableData();

        RenderRow.iterTableCell(tabRows, function(cell, row, key) {
            RenderRow.bindCellEvent(cell, row, this._selectChange, this);
        }.bind(this));
    }

    _selectChange(entry, row, elm) {
        let newRows, val = InputStore.storeItemIndex(entry.inpName, elm.val(), true);

        entry.inpHolder = val;
        entry.inpDefVal = val;

        if (row.clone === true && row.rowId != null) {
            newRows = this.state.newRows;
            if (entry.ownerRow == null) {
                entry.ownerRow = row;
            }
            if (newRows[row.rowId] == null) {
                newRows[row.rowId] = row;
                this.setState({
                    newRows: newRows
                });
            } else {
                console.log("skip known row");
                console.log(row);
            }
        }
        console.log("selected " + val);
        console.log(newRows);
    }

    _addNewRows(data) {
        console.log("add new rows");
        console.log(data);
        this.refs.rowModal.closeModal(true);
    }

    _renderInputModal() {
        return (
            <RenderRow inputCb={this._selectChange} bind={this}
                onSubmit={this._addNewRows}
                tableFormat={this.props.tableFormat} tableId={_.uniqueId('new-row-')}
                cloneRow={this.props.cloneRow} tableData={this.props.tableData}/>
        );
    }

    _footerClick(footer) {
        let val, changes = {};

        console.log("Invoke footer click");
        RenderRow.iterTableCell(this.props.tableData, function(cell, row, key) {
            val = InputStore.getItemIndex(cell.inpName);
            if (val != null) {
                changes[cell.inpName] = val;
            }
        });
        footer.onClick(this.props.tableData, changes);
    }

    _renderFooter() {
        let btn = [], footer = this.props.tableFooter;

        if (footer == null) {
            return null;
        }
        _.forEach(footer, function(entry) {
            btn.push(
                <button key={_.uniqueId('dym-tab-')} className={entry.format}
                    onClick={this._footerClick.bind(this, entry)}>
                    <Mesg text={entry.title}/>
                </button>
            );
        }.bind(this));
        return <footer>{btn}</footer>
    }

    _getTableData() {
        if (this.props.edit === true) {
            return RenderRow.toTableEdit(this.props.tableData, this.state.newRows);
        }
        return this.props.tableData;
    }

    render() {
        const entry = {
            inpName  : _.uniqueId('tab-row-'),
            inpDefVal: 1,
            inpHolder: "Enter new rows"
        };
        let table, tableData, columns, tableFmt = [];

        tableData = this._getTableData();
        columns = RenderRow.renderHeader(this.props.tableFormat, tableFmt);
        table = RenderRow.renderTable(tableData, tableFmt, columns);

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

                                <ModalButton ref="rowModal" divClass="widget-toolbar"
                                    className="btn btn-sm btn-primary"
                                    closeWarning="You will loose unsaved data"
                                    buttonText="Add Row">
                                    {this._renderInputModal()}
                                </ModalButton>
                            </header>
                            <div>
                                <div className="widget-body no-padding">{table}</div>
                            </div>
                            {this._renderFooter()}
                        </JarvisWidget>
                    </article>
                </div>
            </WidgetGrid>
        )
    }
}

export default DynamicTable;
