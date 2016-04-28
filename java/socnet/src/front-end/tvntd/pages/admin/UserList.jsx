/**
 * Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import Reflux         from 'reflux';
import _              from 'lodash';

import WidgetGrid     from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget   from 'vntd-shared/widgets/JarvisWidget.jsx';
import Datatable      from 'vntd-shared/tables/Datatable.jsx';
import BigBreadcrumbs from 'vntd-shared/layout/BigBreadcrumbs.jsx';
import UserStore      from 'vntd-shared/stores/UserStore.jsx';
import Actions        from 'vntd-root/actions/Actions.jsx';
import SubHeader      from '../layout/SubHeader.jsx';

let UserList = React.createClass({
    mixins: [Reflux.listenTo(UserStore, "onConnectionChange")],

    _submitChanges: function(event) {
        event.preventDefault();
        let data = {
            connect: [],
            follow: []
        };
        let users = UserStore.getUserList();

        _.forOwn(users, function(item, key) {
            if ($('#connect-' + key).prop('checked') == true) {
                data.connect.push(key);
            }
            if ($('#follow-' + key).prop('checked') == true) {
                data.follow.push(key);
            }
        });
        Actions.changeUsers(data);
    },

    _getTableData: function() {
        let tabdata = [];
        let users = UserStore.getUserList();
        let followFmt = "<button>Followed</button>";
        let connectFmt = "<button>Connected</button>";
        let connectingFmt = "<button>Connecting</button>";

        _.forOwn(users, function(item, key) {
            let connect = "connect-" + key;
            let follow  = "follow-" + key;
            let connFmt, follFmt;

            if (item.isInConnection()) {
                connFmt = connectFmt;
                follFmt = followFmt;
            } else if (item.isInFollowed()) {
                connFmt = "<input type='checkbox' id='" + connect + "' name='" + connect + "'/>";
                follFmt = followFmt;
            } else if (item.isFollower()) {
                connFmt = "<input type='checkbox' id='" + connect + "' name='" + connect + "'/>";
                follFmt = "";
            } else if (item.isConnecting()) {
                connFmt = connectingFmt;
                follFmt = followFmt;
            } else {
                connFmt = "<input type='checkbox' id='" + connect + "' name='" + connect + "'/>";
                follFmt = "<input type='checkbox' id='" + follow + "' name='" + follow + "'/>";
            }
            console.log(item);
            console.log(connFmt);
            tabdata.push({
                image    : "<img width='40' height='40' src='" + item.userImgUrl + "'/>",
                firstName: item.firstName,
                lastName : item.lastName,
                eMail    : item.userName,
                uuid     : item.userUuid,
                follow   : follFmt,
                connect  : connFmt
            });
        });
        return { tabData: tabdata };
    },

    onConnectionChange: function() {
        this.setState(this._getTableData());
    },

    getInitialState: function() {
        return this._getTableData();
    },

    render: function() {
        let table = (
            <Datatable tableData={this.state.tabData} options={{
                data: this.state.tabData,
                columns: [
                    {data: "image"},
                    {data: "firstName"},
                    {data: "lastName"},
                    {data: "eMail"},
                    {data: "uuid"},
                    {data: "follow"},
                    {data: "connect"}
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
                        <th><i className="text-color-blue fa fa-fw fa-trash"/>Follow</th>
                        <th><i className="text-color-blue fa fa-fw fa-bug"/>Connect</th>
                    </tr>
                </thead>
            </Datatable>
        );
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
                                    <div className="widget-body no-padding">{table}</div>
                                </div>
                                <footer>
                                    <button className="btn btn-primary pull-right" onClick={this._submitChanges}>Save Changes</button>
                                </footer>
                            </JarvisWidget>
                        </article>
                    </div>
                </WidgetGrid>
            </div>
        )
    }
});

export default UserList
