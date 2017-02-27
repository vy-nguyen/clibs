/**
 * Vy Nguyen (2016)
 */
'use strict';

import _              from 'lodash';
import React          from 'react-mod';

import UserStore      from 'vntd-shared/stores/UserStore.jsx';
import Actions        from 'vntd-root/actions/Actions.jsx';
import UserTable      from 'vntd-root/components/UserTable.jsx';
import UserSelect     from 'vntd-root/components/UserSelect.jsx';
import Mesg           from 'vntd-root/components/Mesg.jsx';
import Lang           from 'vntd-root/stores/LanguageStore.jsx';

class UserFriends extends React.Component
{
    constructor(props) {
        super(props);

        this._submitChanges = this._submitChanges.bind(this);
        this._getUserTable  = this._getUserTable.bind(this);
        this._getTabHeader  = this._getTabHeader.bind(this);
        this._updateState   = this._updateState.bind(this);
        this.state = {
            self: UserStore.getSelf()
        };
    }

    componentDidMount() {
        this.unsub = UserStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unusb = null;
        }
    }

    _updateState() {
        this.setState({
            self: UserStore.getSelf()
        });
    }

    _submitChanges(event) {
        event.preventDefault();
        UserSelect.submitChanges(this.props.userList);
    }

    _getUserTable() {
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
    }

    _getTabHeader() {
        const connectTab = [ {
            key   : "image",
            format: "",
            header: Lang.translate("Image")
        }, {
            key   : "firstName",
            format: "fa fa-fw fa-user text-muted",
            header: Lang.translate("First Name")
        }, {
            key   : "lastName",
            format: "fa fa-fw fa-user text-muted",
            header: Lang.translate("Last Name")
        }, {
            key   : "unFollow",
            format: "text-color-blue",
            header: Lang.translate("Unfollow")
        }, {
            key   : "unConnect",
            format: "text-color-blue",
            header: Lang.translate("Unconnect")
        }, {
            key   : "block",
            format: "text-color-blue",
            header: Lang.translate("Block")
        } ];

        const followTab = [ {
            key   : "image",
            format: "",
            header: Lang.translate("Image")
        }, {
            key   : "firstName",
            format: "fa fa-fw fa-user text-muted",
            header: Lang.translate("First Name")
        }, {
            key   : "lastName",
            format: "fa fa-fw fa-user text-muted",
            header: Lang.translate("Last Name")
        }, {
            key   : "unFollow",
            format: "text-color-blue",
            header: Lang.translate("Unfollow")
        } ];

        const followerTab = [ {
            key   : "image",
            format: "",
            header: Lang.translate("Image")
        }, {
            key   : "firstName",
            format: "fa fa-fw fa-user text-muted",
            header: Lang.translate("First Name")
        }, {
            key   : "lastName",
            format: "fa fa-fw fa-user text-muted",
            header: Lang.translate("Last Name")
        }, {
            key   : "connect",
            format: "text-color-blue",
            header: Lang.translate("Connect")
        }, {
            key   : "block",
            format: "text-color-blue",
            header: Lang.translate("Block")
        } ];

        const fullTab = [ {
            key   : "image",
            format: "",
            header: Lang.translate("Image")
        }, {
            key   : "firstName",
            format: "fa fa-fw fa-user text-muted",
            header: Lang.translate("First Name")
        }, {
            key   : "lastName",
            format: "fa fa-fw fa-user text-muted",
            header: Lang.translate("Last Name")
        }, {
            key   : "uuid",
            format: "text-color-blue",
            header: "UUID"
        }, {
            key   : "block",
            format: "text-color-red",
            header: Lang.translate("Block Account")
        }, {
            key   : "follow",
            format: "text-color-blue",
            header: Lang.translate("Follow")
        }, {
            key   : "connect",
            format: "text-color-blue",
            header: Lang.translate("Connect")
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
    }

    render() {
        let footer = null;
        let data = this._getUserTable();

        if (data.hasInput === true) {
            footer = (
                <footer>
                    <button className="btn btn-primary pull-right" onClick={this._submitChanges}>
                        <Mesg text="Save Changes"/>
                    </button>
                </footer>
            );
        }
        return (
            <UserTable tableFormat={data.tabHeader}
                tableData={data.tabdata} tableTitle={this.props.tableTitle} tableFooter={footer}/>
        );
    }
}

export default UserFriends;
