/**
 * Written by Vy Nguyen (2017)
 * BSD License.
 */
'use strict';

import _        from 'lodash';
import $        from 'jquery';
import React    from 'react-mod';
import ReactDOM from 'react-dom';

import asyncLoader    from 'vntd-shared/lib/AsyncLoader.jsx';

class DataTable extends React.Component
{
    constructor(props) {
        super(props);
        this.dataTable = null;
        this.options   = this._getTableOpts(props);
    }

    componentDidMount() {
        let node, dataTable, element, sortCol = this.props.sortCol || 1,
            sortMode = this.props.sortMode || 'asc';

        if (this.dataTable != null) {
            return;
        }
        node      = ReactDOM.findDOMNode(this);
        element   = $(node);
        dataTable = element.DataTable(this.options);

        if (this.props.filter) {
            element.on('keyup change', 'thead th input[type=text]', function() {
                dataTable
                    .column($(this).parent().index() + ':visible')
                    .search(this.value)
                    .draw();
            });
        } else {
            dataTable.order([sortCol, sortMode]).draw();
        }
        if (this.props.cellClick) {
            let cellClick = this.props.cellClick;
            element.on('click', 'td', function() {
                let cell = dataTable.cell(this);
                cellClick(cell.index());
            });
        }
        if (!this.options.toolbar) {
            let div = '<div class="text-right">' + 
                '<img src="styles/img/logo.png" alt="tvntd" ' +
                'style="width: 111px; margin-top: 3px; margin-right: 10px;"></div>';

            element.parent().find(".dt-toolbar").append(div);
        }
        if (this.props.detailsFormat) {
            let format = this.props.detailsFormat;
            element.on('click', 'td.details-control', function() {
                let tr = $(this).closest('tr'),
                    row = dataTable.row(tr);

                if (row.child.isShown()) {
                    row.child.hide();
                    tr.removeClass('shown');
                } else {
                    row.child(format(row.data())).show();
                    tr.addClass('shown');
                }
            })
        }
        this.dataTable = dataTable;
    }

    _getTableOpts(props) {
        let dom, search, toolbar = '', options = props.options || {};

        if (options.buttons) {
            toolbar += 'B';
        }
        if (props.paginationLength) {
            toolbar += 'l';
        }
        if (props.columnsHide) {
            toolbar += 'C';
        }
        dom = "<'dt-toolbar'<'col-xs-12 col-sm-6'f>" + 
            "<'col-sm-6 col-xs-12 hidden-xs text-right'" + toolbar +
            ">r>t<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i>" +
            "<'col-xs-12 col-sm-6'p>>";

        search = "<span class='input-group-addon input-sm'>" +
            "<i class='glyphicon glyphicon-search'></i></span> ";

        return _.extend(options, {
            oLanguage: {
                sSearch: search,
                sLengthMenu: "_MENU_"
            },
            dom       : dom,
            toolbar   : toolbar,
            autoWidth : false,
            retrieve  : true,
            responsive: true
        });
     }

    render() {
        if (this.dataTable != null) {
            this.dataTable.clear().draw();
            this.dataTable.rows.add(this.props.tableData);
            this.dataTable.columns.adjust().draw();
        }
        let {children, ...props} = this.props;
        return (
            <table {...props}>
                {children}
            </table>
        )
    }
}

export default asyncLoader("tvntd", "/rs/client/vendor.datatables.js")(DataTable);
