/**
 * Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import Reflux         from 'reflux';
import _              from 'lodash';
import {renderToString} from 'react-dom-server' ;

import UserStore      from 'vntd-shared/stores/UserStore.jsx';
import Actions        from 'vntd-root/actions/Actions.jsx';
import UserIcon       from 'vntd-root/components/UserIcon.jsx';
import UserTable      from 'vntd-root/components/UserTable.jsx';

let UserFriends = React.createClass({
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
        let data = {
            me      : "<button>Self</button>",
            follow  : "<button>Follow</button>",
            follower: "<button>Follower</button>",
            noSelect: "<button>N/A</button",
            connect : "<button>Connected</button>",
            reqSent : "<button>Pending</button",

            hasInput  : false,
            tabdata   : [],
            followFmt : null,
            connectFmt: null,
            unFollFmt : null,
            unConnFmt : null
        };
        let dispatch = {
            connectFn : function(user, key, arg) {
                if (user.isUserMe()) {
                    arg.followFmt  = arg.me;
                    arg.connectFmt = arg.me;
                    arg.unFollFmt  = arg.noSelect;
                    arg.unConnFmt  = arg.noSelect;
                } else {
                    arg.hasInput   = true;
                    arg.followFmt  = arg.follow;
                    arg.connectFmt = arg.connect;

                    let unFoll     = 'unFollow-' + key;
                    let unConn     = 'unConnect-' + key;
                    arg.unFollFmt  = "<input type='checkbox' id='" + unFoll + "' name='" + unFoll + "'/>";
                    arg.unConnFmt  = "<input type='checkbox' id='" + unConn + "' name='" + unConn + "'/>";
                }
            },
            followComm: function(user, key, arg, follow) {
                let unFoll = 'unFollow-' + key;
                let unConn = 'unConnect-' + key;

                arg.hasInput = true;
                if (follow === true) {
                    arg.followFmt  = arg.follow;
                    arg.unFollFmt  = "<input type='checkbox' id='" + unFoll + "' name='" + unFoll + "'/>";
                } else {
                    arg.followFmt  = arg.follower;
                    arg.unFollFmt  = arg.noSelect;
                }
                if (user.isUserMe) {
                    let connect = 'connect-' + key;
                    arg.connectFmt = "<input type='checkbox' id='" + connect + "' name='" + connect + "'/>";
                    arg.unConnFmt  = arg.noSelect;
                } else {
                    arg.connectFmt = arg.reqSent;
                    arg.unConnFmt  = "<input type='checkbox' id='" + unConn + "' name='" + unConn + "'/>";
                }
            },
            followFn: function(user, key, arg) {
                dispatch.followComm(user, key, arg, true);
            },
            followerFn: function(user, key, arg) {
                dispatch.followComm(user, key, arg, false);
            },
            meFn: function(user, key, arg) {
                let connect = 'connect-' + key;
                let follow  = 'follow-' + key;

                arg.hasInput   = true;
                arg.connectFmt = "<input type='checkbox' id='" + connect + "' name='" + connect + "'/>";
                arg.followFmt  = "<input type='checkbox' id='" + follow + "' name='" + follow + "'/>";
                arg.unFollFmt  = arg.noSelect;
                arg.unConnFmt  = arg.noSelect;
            },
            strangerFn: function(user, key, arg) {
                arg.connectFmt = arg.noSelect;
                arg.followFmt  = arg.noSelect;
            },
            iterFn: function(user, key, arg) {
                let imgLink = renderToString(<UserIcon userUuid={user.userUuid}/>);
                arg.tabdata.push({
                    image    : imgLink,
                    firstName: user.firstName,
                    lastName : user.lastName,
                    follow   : arg.followFmt,
                    connect  : arg.connectFmt,
                    unFollow : arg.unFollFmt,
                    unConnect: arg.unConnFmt
                });
            }
        };
        UserStore.iterUserRelationship(this.props.userList, dispatch, data);
        return { tabdata: data.tabdata, hasInput: data.hasInput };
    },

    render: function() {
        const format = [ {
            key   : "image",
            format: "",
            header: "Image"
        }, {
            key   : "firstName",
            format: "fa fa-fw fa-user text-muted",
            header: "First Name"
        }, {
            key   : "lastName",
            format: "fa fa-fw fa-user text-muted",
            header: "Last Name"
        }, {
            key   : "follow",
            format: "text-color-blue",
            header: "Follow"
        }, {
            key   : "connect",
            format: "text-color-blue",
            header: "Connect"
        }, {
            key   : "unFollow",
            format: "text-color-blue",
            header: "Unfollow"
        }, {
            key   : "unConnect",
            format: "text-color-blue",
            header: "Unconnect"
        } ];
        let footer = null;
        let data = this._getUserTable();

        if (data.hasInput === true) {
            footer = (
                <footer>
                    <button className="btn btn-primary pull-right" onClick={this._submitChanges}>Save Changes</button>
                </footer>
            );
        }
        return (
            <UserTable tableFormat={format}
                tableData={data.tabdata}
                tableTitle={this.props.tableTitle} tableFooter={footer}/>
        );
    }
});

export default UserFriends
