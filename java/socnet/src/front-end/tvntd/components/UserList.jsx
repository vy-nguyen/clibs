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
import UserStore      from 'vntd-shared/stores/UserStore.jsx';
import Actions        from 'vntd-root/actions/Actions.jsx';

let UserList = React.createClass({
    mixins: [Reflux.connect(UserStore)],

    _submitChanges: function(event) {
        event.preventDefault();
        let data = {
            connect: [],
            follow: [],
            unConnect: [],
            unFollow: []
        };
        UserStore.iterUser(this.props.userList, function(user, key) {
            if ($('#connect-' + key).prop('checked') === true) {
                data.connect.push(key);
            }
            if ($('#follow-' + key).prop('checked') === true) {
                data.follow.push(key);
            }
            if ($('#unConnect-' + key).prop('checked') === true) {
                data.unConnect.push(key);
            }
            if ($('#unFollow-' + key).prop('checked') === true) {
                data.unFollow.push(key);
            }
        });
        Actions.changeUsers(data);
    },

    _getUserTable: function() {
        let tabdata = [];
        let connFmt, follFmt;
        let followFmt = "<button>Followed</button>";
        let followerFmt = "<button>Follower</button>";
        let connectFmt = "<button>Connected</button>";

        UserStore.iterUser(this.props.userList, function(item, key) {
            let connect = 'connect-' + key;
            let follow = 'follow-' + key;
            let unConnect = 'unConnect-' + key;
            let unFollow = 'unFollow-' + key;

            if (item.isInConnection()) {
                connFmt = connectFmt;
                follFmt = followFmt;
            } else if (item.isInFollowed()) {
                connFmt = "<input type='checkbox' id='" + connect + "' name='" + connect + "'/>";
                follFmt = followFmt;
            } else if (item.isFollower()) {
                connFmt = "<input type='checkbox' id='" + connect + "' name='" + connect + "'/>";
                follFmt = followerFmt;
            } else {
                connFmt = "<input type='checkbox' id='" + connect + "' name='" + connect + "'/>";
                follFmt = "<input type='checkbox' id='" + follow + "' name='" + follow + "'/>";
            }
            tabdata.push({
                image    : "<img width='40' height='40' src='" + item.userImgUrl + "'/>",
                firstName: item.firstName,
                lastName : item.lastName,
                eMail    : item.email,
                uuid     : item.userUuid,
                follow   : follFmt,
                connect  : connFmt
            });
        });
        return tabdata;
    },

    getInitialState: function() {
        return this._getUserTable();
    },

    render: function() {
        let tabData = this._getUserTable();
        let table = (
            <Datatable tableData={tabData} options={{
                data: tabData,
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
        let footer = "";
        if (_.isEmpty(this.props.noSaveBtn)) {
            footer = (
                <footer>
                    <button className="btn btn-primary pull-right" onClick={this._submitChanges}>Save Changes</button>
                </footer>
            );
        }
        return (
            <div id="content">
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget editbutton={false} color="darken">
                                <header>
                                    <span className="widget-icon"><i className="fa fa-table"/></span>
                                    <h2>{this.props.tableTitle}</h2>
                                </header>
                                <div>
                                    <div className="widget-body no-padding">{table}</div>
                                </div>
                                {footer}
                            </JarvisWidget>
                        </article>
                    </div>
                </WidgetGrid>
            </div>
        )
    }
});

export default UserList
