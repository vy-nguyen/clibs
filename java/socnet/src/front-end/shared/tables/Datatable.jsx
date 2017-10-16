/**
 * Written by Vy Nguyen (2017)
 * BSD License.
 */
'use strict';

import _        from 'lodash';
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
        let node, dataTable, element;

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

/*
import _        from 'lodash';
import React    from 'react-mod';
import ScriptLoader  from 'vntd-shared/utils/mixins/ScriptLoader.jsx'
import ElementHolder from 'vntd-shared/utils/mixins/ElementHolder.jsx'
import AjaxActions   from 'vntd-shared/actions/AjaxActions.jsx'

let Datatable = React.createClass({
    dataTable: null,
    mixins: [ScriptLoader, ElementHolder],

    componentDidMount: function () {
        this.loadScript('/rs/client/vendor.datatables.js').then(function() {
            this._datatable()
        }.bind(this))
    },

    _datatable: function() {
        var element = $(this.getHold());
        var options = this.props.options || {}

        console.log("element.....");
        console.log(element);
        let toolbar = '';
        if (options.buttons) {
            toolbar += 'B';
        }
        if (this.props.paginationLength) {
            toolbar += 'l';
        }
        if (this.props.columnsHide) {
            toolbar += 'C';
        }
        if (typeof options.ajax === 'string') {
            let url = options.ajax;
            options.ajax = {
                url: url,
                complete: function(xhr) {
                    AjaxActions.contentLoaded(xhr)
                }
            }
        }
        options = _.extend(options, {
            "dom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs text-right'" + toolbar + ">r>" +
            "t" +
            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
            oLanguage: {
                "sSearch": "<span class='input-group-addon input-sm'><i class='glyphicon glyphicon-search'></i></span> ",
                "sLengthMenu": "_MENU_"
            },
            "autoWidth": false,
            retrieve: true,
            responsive: true
        });

        var _dataTable = element.DataTable(options);
        this.dataTable = _dataTable;
        console.log(this);

        if (this.props.filter) {
            // Apply the filter
            element.on('keyup change', 'thead th input[type=text]', function() {
                _dataTable
                    .column($(this).parent().index() + ':visible')
                    .search(this.value)
                    .draw();
            });
        }

        if (!toolbar) {
            element.parent()
            .find(".dt-toolbar")
            .append('<div class="text-right">' + '<img src="styles/img/logo.png" alt="tvntd" style="width: 111px; margin-top: 3px; margin-right: 10px;"></div>');
        }

        if (this.props.detailsFormat) {
            let format = this.props.detailsFormat;
            element.on('click', 'td.details-control', function() {
                var tr = $(this).closest('tr');
                var row = _dataTable.row(tr);

                if (row.child.isShown()) {
                    row.child.hide();
                    tr.removeClass('shown');
                } else {
                    row.child(format(row.data())).show();
                    tr.addClass('shown');
                }
            })
        }
    },

    render: function() {
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
});

export default Datatable
*/
