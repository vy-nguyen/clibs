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
import Mesg           from 'vntd-root/components/Mesg.jsx';

import { renderHtmlInput } from 'vntd-shared/forms/commons/GenericForm.jsx';

class RenderRow extends React.Component
{
    constructor(props) {
        super(props);
        this._cloneRow = this._cloneRow.bind(this);
        this.state = this._cloneRow(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this._cloneRow(nextProps));
    }

    componentDidMount() {
        let tabRows = this.state.tableData;

        DynamicTable.iterTableCell(tabRows, function(cell, row, key) {
            RenderRow.bindCellEvent(cell, row, this.props.inputCb, this.props.bind);
        }.bind(this));
    }

    _cloneRow(props) {
        let tableData;

        tableData = props.tableData;
        console.log("--------");
        console.log(tableData);
        if (props.cloneRow == null || tableData == null || _.isEmpty(tableData[0])) {
            return;
        }
        return {
            tableData: props.cloneRow(tableData[0])
        };
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

    render() {
        let table, columns, renderData, tableData, tableFmt = [];

        console.log(this.state);
        tableData = this.state.tableData;
        if (tableData == null || this.props.cloneRow == null) {
            return <p>Don't know how to clone row</p>
        }
        // tableData  = this.props.cloneRow(tableData[0]);
        renderData = RenderRow.toTableEdit(tableData, null);
        columns    = RenderRow.renderHeader(this.props.tableFormat, tableFmt);
        table      = RenderRow.renderTable(renderData, tableFmt, columns);

        return (
            <div className="row">
                <div className="widget-body no-padding">
                    {table}
                </div>
            </div>
        );
    }
}

class DynamicTable extends React.Component
{
    constructor(props) {
        let val;

        super(props);
        this._renderInputModal = this._renderInputModal.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        this.state = {
            newRows: {}
        }
    }

    componentDidMount() {
        let elm, changeFn, tabRows = this.props.tableData;

        DynamicTable.iterTableCell(tabRows, function(cell, row, key) {
            RenderRow.bindCellEvent(cell, row, this._selectChange, this);
        }.bind(this));
    }

    static iterTableCell(tableData, iterFn) {
        _.forOwn(tableData, function(inpRow) {
            _.forOwn(inpRow, function(cell, inpRow, key) {
                iterFn(cell, key);
            });
        });
    }

    _selectChange(entry, row, elm) {
        let newRows = this.state.newRows;
        let val = InputStore.storeItemIndex(entry.inpName, elm.val(), true);

        entry.inpHolder = val;
        entry.inpDefVal = val;

        if (row.clone === true) {
            if (entry.ownerRow == null) {
                entry.ownerRow = row;
            }
            newRows[entry.inpName] = entry;
            this.setState({
                newRows: newRows
            });
        }
        console.log("selected " + val);
        console.log(entry);
        console.log(newRows);
        console.log(row);
    }

    _renderInputModal() {
        return (
            <RenderRow inputCb={this._selectChange} bind={this}
                tableFormat={this.props.tableFormat}
                cloneRow={this.props.cloneRow} tableData={this.props.tableData}/>
        );
    }

    _footerClick(footer) {
        let val, changes = {};

        console.log("Invoke footer click");
        DynamicTable.iterTableCell(this.props.tableData, function(cell, row, key) {
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

    render() {
        let table, tableData, columns, tableFmt = [];

        if (this.props.edit === true) {
            tableData = RenderRow.toTableEdit(this.props.tableData, this.state.newRows);
        } else {
            tableData = this.props.tableData;
        }
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
                                <ModalButton divClass="widget-toolbar"
                                    className="btn btn-sm btn-primary" buttonText="Add Row">
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
