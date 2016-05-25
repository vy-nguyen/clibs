/*
 * Vy Nguyen (2016)
 */
'use strict';

import _                from 'lodash';
import React            from 'react-mod';
import {renderToString} from 'react-dom-server';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import Actions          from 'vntd-root/actions/Actions.jsx';
import UserIcon         from 'vntd-root/components/UserIcon.jsx';

var UserSelect = function() {
    const format = {
        me      : "<button>Self</button>",
        follow  : "<button>Follow</button>",
        follower: "<button>Follower</button>",
        block   : "<button>Blocked</button>",
        connect : "<button>Connected</button>",
        noSelect: "<button>N/A</button",
        notOwner: "<button>Not Owner</button>",
        reqSent : "<button>Pending</button"
    };

    let submitChanges = function(userList) {
        let data = {
            block  : [],
            follow : [],
            connect: [],
            unConnect: [],
            unFollow : [],
            unBlock  : []
        };
        UserStore.iterUser(userList, function(user, idx) {
            let key = user.userUuid;
            if ($('#connect-' + key).prop('checked') === true) {
                data.connect.push(key);
            }
            if ($('#follow-' + key).prop('checked') === true) {
                data.follow.push(key);
            }
            if ($('#block-' + key).prop('checked') === true) {
                data.block.push(key);
            }
            if ($('#unConnect-' + key).prop('checked') === true) {
                data.unConnect.push(key);
            }
            if ($('#unFollow-' + key).prop('checked') === true) {
                data.unFollow.push(key);
            }
            if ($('#unBlock-' + key).prop('checked') === true) {
                data.unBlock.push(key);
            }
        });
        Actions.changeUsers(data);
    };

    let userInput = function(key) {
        return "<input type='checkbox' id='" + key + "' name='" + key + "'/>";
    };
    let connectInput = function(key) {
        return userInput('connect-' + key);
    };
    let followInput = function(key) {
        return userInput('follow-' + key);
    };
    let blockInput = function(key) {
        return userInput('block-' + key);
    };
    let unConnectInput = function(key) {
        return userInput('unConnect-' + key);
    };
    let unFollowInput = function(key) {
        return userInput('unFollow-' + key);
    };
    let unBlockInput = function(key) {
        return userInput('unBlock-' + key);
    };

    let reqConnect = function(user, key, arg) {
        if (user.isUserMe()) {
            arg.followFmt  = format.me;
            arg.connectFmt = format.me;
            arg.blockFmt   = format.me;
            arg.unFollFmt  = format.me;
            arg.unConnFmt  = format.me;
            arg.unBlockFmt = format.me;
        } else {
            arg.followFmt  = format.follow;
            arg.connectFmt = format.connect;
            arg.unBlockFmt = format.noSelect;
            if (arg.tabOwner === true) {
                arg.hasInput  = true;
                arg.blockFmt  = blockInput(key);
                arg.unFollFmt = unFollowInput(key);
                arg.unConnFmt = unConnectInput(key);
            } else {
                arg.blockFmt  = format.notOwner;
                arg.unFollFmt = format.notOwner;
                arg.unConnFmt = format.notOwner;
            }
        }
    };

    let reqFollow = function(user, key, arg, follow) {
        arg.hasInput   = true;
        arg.unBlockFmt = format.noSelect;

        if (follow === true) {
            arg.followFmt = format.follow;
            if (arg.tabOwner === true) {
                arg.unFollFmt = unFollowInput(key);
                arg.blockFmt  = blockInput(key);
            } else {
                arg.unFollFmt = format.notOwner;
            }
        } else {
            arg.followFmt = format.follower;
            arg.unFollFmt = format.noSelect;
            if (arg.tabOwner === true) {
                arg.blockFmt  = blockInput(key);
            } else {
                arg.blockFmt = format.notOwner;
            }
        }
        if (user.isUserMe) {
            arg.connectFmt = connectInput(key);
            arg.unConnFmt  = format.noSelect;
        } else {
            arg.connectFmt = format.reqSent;
            arg.unConnFmt  = unConnectInput(key);
        }
    };

    let reqForSelf = function(user, key, arg) {
        arg.hasInput   = true;
        arg.connectFmt = connectInput(key);
        arg.followFmt  = followInput(key);
        arg.blockFmt   = format.noSelect;
        arg.unFollFmt  = format.noSelect;
        arg.unConnFmt  = format.noSelect;
        arg.unBlockFmt = format.noSelect;
    };

    let reqForStranger = function(user, key, arg) {
        arg.connectFmt = format.noSelect;
        arg.followFmt  = format.noSelect;
        arg.blockFmt   = format.noSelect;

        arg.unFollFmt  = format.noSelect;
        arg.unConnFmt  = format.noSelect;
        arg.unBlockFmt = format.noSelect;
    };

    let makeUserRow = function(user, key, arg) {
        let row = {};
        _.forEach(arg.tabHeader, function(value, idx) {
            switch (value.key) {
            case 'image':
                row.image = renderToString(<UserIcon userUuid={user.userUuid}/>);
                break;
            case 'firstName':
                row.firstName = user.firstName;
                break;
            case 'lastName':
                row.lastName = user.lastName;
                break;
            case 'eMail':
                row.eMail = user.email;
                break;
            case 'uuid':
                row.uuid = user.userUuid;
                break;
            case 'follow':
                row.follow = arg.followFmt;
                break;
            case 'connect':
                row.connect = arg.connectFmt;
                break;
            case 'block':
                row.block = arg.blockFmt;
                break;
            case 'unFollow':
                row.unFollow = arg.unFollFmt;
                break;
            case 'unConnect':
                row.unConnect = arg.unConnFmt;
                break;
            case 'unBlock':
                row.unBlock = arg.unBlockFmt;
                break;
            }
        });
        arg.tabdata.push(row);
    };

    var dispatch = {
        meFn      : reqForSelf,
        strangerFn: reqForStranger,
        connectFn : reqConnect,
        iterFn    : makeUserRow,

        followFn: function(user, key, arg) {
            reqFollow(user, key, arg, true);
        },
        followerFn: function(user, key, arg) {
            reqFollow(user, key, arg, false);
        }
    }
    return {
        dispatch   : dispatch,
        makeUserRow: makeUserRow,
        submitChanges: submitChanges
    }
}();

module.exports = UserSelect;
