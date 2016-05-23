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

let UserConnect = React.createClass({
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
            key   : "eMail",
            format: "fa fa-fw fa-phone text-muted",
            header: "E-mail"
        }, {
            key   : "uuid",
            format: "text-color-blue",
            header: "UUID"
        }, {
            key   : "follow",
            format: "text-color-blue",
            header: "Follow"
        }, {
            key   : "connect",
            format: "text-color-blue",
            header: "Connect"
        } ];
        const footer = (
            <footer>
                <button className="btn btn-primary pull-right" onClick={this._submitChanges}>Save Changes</button>
            </footer>
        );
        return (
            <UserTable tableFormat={format} tableData={this._getUserTable()} tableFooter={footer}/>
        );
    }
});

export default UserConnect
