/**
 * Vy Nguyen (2016)
 */
'use strict';

import _              from 'lodash';
import React          from 'react-mod';

import WidgetGrid     from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget   from 'vntd-shared/widgets/JarvisWidget.jsx';
import Datatable      from 'vntd-shared/tables/Datatable.jsx';
import ModalButton    from 'vntd-shared/layout/ModalButton.jsx';

class DynamicTable extends React.Component
{
    constructor(props) {
        super(props);
        this._renderInputModal = this._renderInputModal.bind(this);
    }

    _renderInputModal() {
        return <h2>Hello Modal</h2>
    }

    render() {
        let table, columns = [], tableFmt = [];

        _.forEach(this.props.tableFormat, function(value, key) {
            columns.push({data: value.key});
            tableFmt.push(<th key={_.uniqueId("dym-table-")}><i className={value.format}/>{value.header}</th>);
        });

        table = (
            <Datatable tableData={this.props.tableData}
                options={{
                    data: this.props.tableData,
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
                                <span className="widget-icon"><i className="fa fa-table"/></span>
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
