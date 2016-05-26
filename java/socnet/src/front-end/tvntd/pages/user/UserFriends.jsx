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
import UserTable      from 'vntd-root/components/UserTable.jsx';
import UserSelect     from 'vntd-root/components/UserSelect.jsx';

let UserFriends = React.createClass({
    mixins: [Reflux.connect(UserStore)],

    _submitChanges: function(event) {
        event.preventDefault();
        UserSelect.submitChanges(this.props.userList);
    },

    _getUserTable: function() {
        let data = {
            tabOwner  : this.props.owned,
            tabHeader : this._getTabHeader(),
            hasInput  : false,
            tabdata   : [],
            followFmt : null,
            connectFmt: null,
            blockFmt  : null,
            unFollFmt : null,
            unConnFmt : null,
            unBlockFmt: null
        };
        UserStore.iterUserRelationship(this.props.userList, UserSelect.dispatch, data);
        return {
            tabdata  : data.tabdata,
            tabHeader: data.tabHeader,
            hasInput : data.hasInput
        };
    },

    _getTabHeader: function() {
        const connectTab = [ {
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
            key   : "unFollow",
            format: "text-color-blue",
            header: "Unfollow"
        }, {
            key   : "unConnect",
            format: "text-color-blue",
            header: "Unconnect"
        }, {
            key   : "block",
            format: "text-color-blue",
            header: "Block"
        } ];

        const followTab = [ {
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
            key   : "unFollow",
            format: "text-color-blue",
            header: "Unfollow"
        } ];

        const followerTab = [ {
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
            key   : "connect",
            format: "text-color-blue",
            header: "Connect"
        }, {
            key   : "block",
            format: "text-color-blue",
            header: "Block"
        } ];

        const fullTab = [ {
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

        if (this.props.tableType) {
            switch (this.props.tableType) {
            case 'connect':
                return connectTab;
            case 'follow':
                return followTab;
            case 'follower':
                return followerTab;
            }
        }
        return fullTab;
    },

    render: function() {
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
            <UserTable tableFormat={data.tabHeader}
                tableData={data.tabdata} tableTitle={this.props.tableTitle} tableFooter={footer}/>
        );
    }
});

export default UserFriends
