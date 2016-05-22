/**
 * Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import Reflux         from 'reflux';
import _              from 'lodash';
import {renderToString} from 'react-dom-server' ;

import WidgetGrid     from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget   from 'vntd-shared/widgets/JarvisWidget.jsx';
import Datatable      from 'vntd-shared/tables/Datatable.jsx';
import UserStore      from 'vntd-shared/stores/UserStore.jsx';
import Actions        from 'vntd-root/actions/Actions.jsx';
import UserIcon       from 'vntd-root/components/UserIcon.jsx';

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
        const itIsMeFmt = "<button>Myself</button>";
        const followFmt = "<button>Followed</button>";
        const followerFmt = "<button>Follower</button>";
        const noSelection = "<button>N/A</button>";
        const connectFmt  = "<button>Connected</button>";
        const connectSentFmt = "<button>Pending</button>";
        let tabdata = [];
        let connFmt, follFmt;
        let userList = this.props.userList;

        UserStore.iterUser(userList, function(item, key) {
            let connect = 'connect-' + key;
            let follow = 'follow-' + key;
            let unConnect = 'unConnect-' + key;
            let unFollow = 'unFollow-' + key;

            if (item.isInConnection()) {
                if (item.isUserMe()) {
                    connFmt = itIsMeFmt;
                    follFmt = itIsMeFmt;
                } else {
                    connFmt = connectFmt;
                    follFmt = followFmt;
                }
            } else if (item.isInFollowed()) {
                follFmt = followFmt;
                if (item.isUserMe()) {
                    connFmt = "<input type='checkbox' id='" + connect + "' name='" + connect + "'/>";
                } else {
                    connFmt = connectSentFmt;
                }
            } else if (item.isFollower()) {
                follFmt = followerFmt;
                if (!item.isUserMe()) {
                    connFmt = "<input type='checkbox' id='" + connect + "' name='" + connect + "'/>";
                } else {
                    connFmt = connectSentFmt;
                }
            } else if ((userList === null) || (userList === undefined) || item.isUserMe()) {
                connFmt = "<input type='checkbox' id='" + connect + "' name='" + connect + "'/>";
                follFmt = "<input type='checkbox' id='" + follow + "' name='" + follow + "'/>";
            } else {
                connFmt = noSelection;
                follFmt = noSelection;
            }
            let imgLink = renderToString(<UserIcon userUuid={item.userUuid}/>);
            tabdata.push({
                image    : imgLink,
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
                        <th><i className="text-color-blue fa fa-fw fa-check"/> Follow</th>
                        <th><i className="text-color-blue fa fa-fw fa-link"/> Connect</th>
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
