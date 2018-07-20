/**
 * Vy Nguyen (2016)
 */
'use strict';

import _                 from 'lodash';
import $                 from 'jquery';
import React             from 'react-mod';
import PropTypes         from 'prop-types';

import { Util }          from 'vntd-shared/utils/Enum.jsx';
import WidgetGrid        from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget      from 'vntd-shared/widgets/JarvisWidget.jsx';
import Datatable         from 'vntd-shared/tables/Datatable.jsx';
import ModalButton       from 'vntd-shared/layout/ModalButton.jsx';
import InputStore        from 'vntd-shared/stores/NestableStore.jsx';
import Lang              from 'vntd-root/stores/LanguageStore.jsx';
import Mesg              from 'vntd-root/components/Mesg.jsx';

import {
    InputWrap, GenericForm 
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
        if (this.props.onClose != null) {
            this.props.onClose();
        }
    }

    _cloneRow(props, count) {
        let newRows, orig, tableData;

        tableData = props.tableData;
        if (props.cloneRow == null || tableData == null || _.isEmpty(tableData[0])) {
            return {
                rowCount  : 0,
                tableData: null
            };
        }
        orig = this.state != null && this.state.newRows != null ?
            this.state.newRows.tableData[0] : tableData[0];
            
        newRows = {
            rowCount : count,
            tableData: props.cloneRow(orig, count)
        };
        if (this.state != null) {
            _.forEach(this.state.tableData, function(row) {
                newRows.rowCount = newRows.rowCount + 1;
                newRows.tableData.push(row);
            });
        }
        return newRows;
    }

    _inputChange(entry, row, event) {
        let cellVal, rowVal = InputStore.getItemIndex(row.rowId);

        cellVal = InputStore.storeItemIndex(entry.inpName, event.target.value, true);
        entry.inpHolder = cellVal;
        entry.inpDefVal = cellVal;

        if (entry.ownerRow == null) {
            entry.ownerRow = row;
        }
        if (rowVal == null) {
            rowVal = row;
            InputStore.storeItemIndex(row.rowId, row, true);
        }
    }

    _createRows() {
        let val = InputStore.getItemIndex(this.props.tableId);
        this.setState(this._cloneRow(this.props, val || 1));
    }

    _submitRows() {
        let data = RenderRow.fetchTableData(this.state.tableData, null, []);

        this.props.onSubmit(data.value, data.rowEdit);
    }

    _cleanupData() {
        _.forEach(this.state.tableData, function(row) {
            InputStore.freeItemIndex(row.rowId);
        });
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
            return <p>Do not know how to clone row</p>
        }
        renderData = RenderRow.toTableEdit(tableData, null, true);
        columns    = RenderRow.renderHeader(this.props.tableFormat, tableFmt, false);
        table      = RenderRow.renderTable(renderData, tableFmt, columns, null);

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

        if (cell != null && typeof cell === 'object') {
            elm  = '#' + cell.inpName;
            cbFn = callbackFn.bind(bind, cell, row);
            if (cell.select === true || cell.checked != null) {
                $(document).on('change', elm, cbFn);
            } else {
                $(document).on('blur', elm, cbFn);
            }
        }
    }

    static toTableEdit(tabRows, newRows, select, cellMap) {
        let r, c, val, checkbox, entry, row, data = [];

        _.forOwn(newRows, function(inpRow) {
            row = {};
            _.forOwn(inpRow, function(cell, key) {
                if (cell != null && typeof cell === 'object') {
                    row[key] = GenericForm.renderHtmlInput(cell);
                } else {
                    row[key] = cell;
                }
            });
            data.push(row);
        });
        r = 0
        _.forEach(tabRows, function(inpRow) {
            c = 0;
            row = {};
            if (cellMap != null) {
                cellMap[r] = [];
            }
            if (select === true) {
                inpRow.checkbox = {
                    inpName  : _.uniqueId('check-'),
                    inpHolder: 'checkedRow',
                    inpDefVal: false,
                    checked  : false
                };
            }
            _.forOwn(inpRow, function(cell, key) {
                if (cell != null && typeof cell === 'object') {
                    entry = cell;
                    if (cell.inpName != null) {
                        val = InputStore.getItemIndex(cell.inpName);
                        if (val != null) {
                            entry.inpHolder = val;
                            entry.inpDefVal = val;
                        }
                        row[key] = GenericForm.renderHtmlInput(entry);
                    } else {
                        row[key] = Util.makeAnchorTag(entry.cellData);
                        if (cellMap != null) {
                            cellMap[r][c] = entry.cellArg;
                        }
                    }
                } else {
                    row[key] = cell;
                }
                c++;
            });
            r++;
            data.push(row);
        });
        return data;
    }

    static renderTable(tableData, tableFmt, columns, cellClick) {
        return (
            <Datatable ref="dataTable" tableData={tableData}
                options={{
                    data: tableData,
                    columns: columns
                }}
                cellClick={cellClick}
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

    static renderHeader(headerFmt, tableFmt, select) {
        let columns = [];
        
        if (select === true) {
            columns = [ {data: 'checkbox'} ];
            tableFmt.push(
                <th key={_.uniqueId("dym-table-")}>
                    <i className=""/>{Lang.translate('Select')}
                </th>
            );
        }
        _.forEach(headerFmt, function(value, key) {
            columns.push({data: value.key});
            tableFmt.push(
                <th key={_.uniqueId("dym-table-")}>
                    <i className={value.format}/> {value.header}
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

    static fetchTableData(tableData, data, rowEdit) {
        let row, edit;

        _.forEach(tableData, function(inpRow) {
            edit = {};
            row = {
                invalid: false
            };
            _.forOwn(inpRow, function(cell, key) {
                if (rowEdit != null) {
                    edit[key] = cell;
                }
                if (cell != null && typeof cell === 'object') {
                    row[key] = InputStore.getItemIndex(cell.inpName);
                    if (row[key] == null) {
                        row[key] = cell.inpDefVal;
                    } else {
                        InputStore.freeItemIndex(cell.inpName);
                    }
                } else {
                    row[key] = cell;
                }
                if (row[key] == null && cell != null) {
                    row.invalid = true
                }
            });
            if (row.invalid === false) {
                delete row.clone;
                delete row.invalid;
                if (data != null) {
                    data.push(row);
                }
                if (rowEdit != null) {
                    rowEdit.push(edit);
                }
            }
            InputStore.freeItemIndex(row.rowId);
        });
        return {
            value  : data,
            rowEdit: rowEdit
        };
    }
}

class DynamicTable extends React.Component
{
    constructor(props) {
        let val;

        super(props);
        this._renderInputModal = this._renderInputModal.bind(this);
        this._renderFooter  = this._renderFooter.bind(this);
        this._getTableData  = this._getTableData.bind(this);
        this._addNewRows    = this._addNewRows.bind(this);
        this._closeRowInput = this._closeRowInput.bind(this);
        this._cellClick     = this._cellClick.bind(this);

        this.state = {
            newRows: {}
        }
    }

    componentDidUpdate() {
        this.componentDidMount();
        RenderRow.iterTableCell(this.state.newRows, function(cell, row, key) {
            RenderRow.bindCellEvent(cell, row, this._selectChange, this);
        }.bind(this));
    }

    componentDidMount() {
        RenderRow.iterTableCell(this.props.tableData, function(cell, row, key) {
            RenderRow.bindCellEvent(cell, row, this._selectChange, this);
        }.bind(this));
    }

    _selectChange(entry, row, event) {
        let change, elm = event.target,
            val = entry.checked == null ? elm.value : $(elm).is(':checked');

        InputStore.storeItemIndex(entry.inpName, val, true);
        entry.inpDefVal = val;

        if (entry.ownerRow == null) {
            entry.ownerRow = row;
            if (entry.checked != null) {
                row.selected = val;
            }
        }
        if (this.state.newRows[row.rowId] == null) {
            change = InputStore.getItemIndex(this.props.tableId);
            if (change == null) {
                change = {};
                InputStore.storeItemIndex(this.props.tableId, change, true);
            }
            change[row.rowId] = row;
        }
        if (this.props.selectCallback != null) {
            this.props.selectCallback(entry, row);
        }
    }

    _addNewRows(data, rowEdit) {
        let newRows = this.state.newRows;
        this.refs.rowModal.closeModal(true);

        _.forEach(rowEdit, function(row) {
            newRows[row.rowId] = row;
        });
        this.setState({
            newRows: newRows
        });
    }

    _closeRowInput() {
        // Work-around datatable pagation, use this mechanism to get all entries
        // in datatable to the DOM.
        //
        this.componentDidUpdate();
    }

    _renderInputModal() {
        return (
            <RenderRow inputCb={this._selectChange} bind={this}
                onSubmit={this._addNewRows} onClose={this._closeRowInput}
                tableFormat={this.props.tableFormat} tableId={_.uniqueId('new-row-')}
                cloneRow={this.props.cloneRow} tableData={this.props.tableData}/>
        );
    }

    _footerSubmit(footer) {
        let changedRows, changes = [];

        changedRows = InputStore.getItemIndex(this.props.tableId);

        if (changedRows != null) {
            RenderRow.fetchTableData(changedRows, changes, null);
        }
        if (this.state.newRows != null) {
            RenderRow.fetchTableData(this.state.newRows, changes, null);
        }
        if (footer.onSubmit(changes) === true) {
            InputStore.freeItemIndex(this.props.tableId);
        }
        this.setState({
            newRows: {}
        });
    }

    _footerSelect(footer) {
        let data = [], changes = [];

        _.forEach(this.props.tableData, function(row) {
            if (row.selected != null && row.selected === true) {
                data.push(row);
                row.selected = false;
            }
        });
        _.forOwn(this.state.newRows, function(row) {
            if (row.selected != null && row.selected === true) {
                data.push(row);
                row.selected = false;
            }
        });
        RenderRow.fetchTableData(data, changes, null);
        footer.onSelect(changes);
    }

    _renderFooter() {
        let onClick, btn = [], footer = this.props.tableFooter;

        if (footer == null) {
            return null;
        }
        _.forEach(footer, function(entry) {
            onClick = (entry.onSubmit != null) ?
                this._footerSubmit.bind(this, entry) :
                this._footerSelect.bind(this, entry);

            btn.push(
                <button key={_.uniqueId('dym-tab-')}
                    className={entry.format} onClick={onClick}>
                    <Mesg text={entry.title}/>
                </button>
            );
        }.bind(this));
        return <footer>{btn}</footer>
    }

    _getTableData() {
        if (this.props.cellClick != null) {
            this.cellMap = [];
        }
        if (this.props.select === true) {
            return RenderRow.toTableEdit(this.props.tableData,
                    this.state.newRows, this.props.select, this.cellMap);
        }
        return RenderRow.toTableEdit(this.props.tableData,
                this.state.newRows, this.props.select, this.cellMap);
    }

    _cellClick(index) {
        this.props.cellClick(this.cellMap[index.row][index.column]);
    }

    render() {
        const entry = {
            inpName  : _.uniqueId('tab-row-'),
            inpDefVal: 1,
            inpHolder: "Enter new rows"
        };
        let table, tableData, columns, tableFmt = [], addRow = null,
            cellClick = this._cellClick,
            tableFormat = this.props.tableFormat, select = this.props.select;

        tableData = this._getTableData();
        columns = RenderRow.renderHeader(tableFormat, tableFmt, select);
        table = RenderRow.renderTable(tableData, tableFmt, columns, cellClick);

        if (this.props.edit === true) {
            addRow = (
                <ModalButton ref="rowModal" divClass="widget-toolbar"
                    buttonFmt="btn btn-sm btn-primary"
                    closeWarning="Ok to discard unsaved data?" buttonText="Add Row">
                    {this._renderInputModal()}
                </ModalButton>
            );
        }
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
                                {addRow}
                            </header>
                            <div>
                                <div className="widget-body no-padding">{table}</div>
                            </div>
                            {this._renderFooter()}
                            {this.props.children}
                        </JarvisWidget>
                    </article>
                </div>
            </WidgetGrid>
        )
    }
}

DynamicTable.propTypes = {
    tableFormat: PropTypes.array.isRequired,
    tableData  : PropTypes.array.isRequired,
    select     : PropTypes.bool,
    edit       : PropTypes.bool,
    tableTitle : PropTypes.string,
    tableFooter: PropTypes.array,
    tableId    : PropTypes.string.isRequired
};

export default DynamicTable;
