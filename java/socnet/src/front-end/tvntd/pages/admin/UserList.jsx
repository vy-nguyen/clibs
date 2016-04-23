/**
 * Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import WidgetGrid     from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget   from 'vntd-shared/widgets/JarvisWidget.jsx';
import Datatable      from 'vntd-shared/tables/Datatable.jsx';
import BigBreadcrumbs from 'vntd-shared/layout/BigBreadcrumbs.jsx';
import SubHeader      from '../layout/SubHeader.jsx';

let UserList = React.createClass({
    render: function() {
        return (
            <div id="content">
                <div className="row">
                    <BigBreadcrumbs items={['Users', 'User List']} icon="table" className="col-xs-12 col-sm-7 col-lg-4"/>
                </div>
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget editbutton={false} color="darken">
                                <header>
                                    <span className="widget-icon"><i className="fa fa-table"/></span>
                                    <h2>User List</h2>
                                </header>
                                <div>
                                    <div className="widget-body no-padding">
                                        <Datatable options={{
                                            ajax: 'api/list-users',
                                            columns: [
                                                {data: "image"},
                                                {data: "firstName"},
                                                {data: "lastName"},
                                                {data: "eMail"},
                                                {data: "uuid"},
                                                {data: "lastLogin"}
                                            ]
                                        }}
                                        paginationLength={true}
                                        className="table table-striped table-bordered table-hover" width="100%">
                                        <thead>
                                            <tr>
                                                <th data-hide="uuid">Image</th>
                                                <th>
                                                    <i className="fa fa-fw fa-user text-muted hidden-md hidden-sm hidden-xs"/>First Name
                                                </th>
                                                <th><i className="text-muted"/>Last Name</th>
                                                <th data-class="expand">
                                                    <i className="fa fa-fw fa-phone text-muted"/>E-mail
                                                </th>
                                                <th><i className="text-color-blue"/>Uuid</th>
                                                <th><i className="text-color-blue fa fa-fw fa-calendar"/>Last Login</th>
                                            </tr>
                                        </thead>
                                        </Datatable>
                                    </div>
                                </div>
                            </JarvisWidget>
                        </article>
                    </div>
                </WidgetGrid>
            </div>
        )
    }
});

export default UserList
