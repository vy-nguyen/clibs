/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _        from 'lodash';
import Reflux   from 'reflux';

import ErrorStore from 'vntd-shared/stores/ErrorStore.jsx';
import Actions    from 'vntd-root/actions/Actions.jsx';

let OnlineEnum = ["online", "offline", "busy"];
let ConnetEnum = ["self", "connected", "followed", "follower", "stranger"];

/*
 * Explicit define known fields in User object.
 */
class User {
    constructor(data) {
        _.forEach(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this._id          = _.uniqueId('id-user-info-');
        this.connectState = "stranger";
        this.followers    = this.followerList.length;
        this.follows      = this.followList.length;
        this.connections  = this.connectList.length;
        return this;
    }

    getUserName() {
        return this.firstName + " " + this.lastName;
    }

    isInConnection() {
        return this.connectState === "connected"
    }
    isInFollowed() {
        return this.connectState === "followed";
    }
    isFollower() {
        return this.connectState === "follower";
    }
}

let UserStore = Reflux.createStore({
    data: {
        userMap: {},
        uuidFetch: {},
        userSelf: null,
        userActive: null,
        authCode: null,
        authMesg: null,
        authError: null,
        authToken: null,
        authVerifToken: null,
        fetchUsers: true,
        csrfHeader: null,
        csrfToken: null
    },
    listenables: [Actions],

    /*
     * Public Api to get UserStore data.
     */
    getUserList: function() {
        return _.forOwn(this.data.userMap);
    },

    getUserByUuid: function(uuid) {
        if (uuid == null) {
            return this.getSelf();
        }
        return this.data.userMap[uuid];
    },

    getUserUuidList: function() {
        let uuids = [];
        _.forOwn(this.data.userMap, function(v, k) {
            uuids.push(k);
        });
        return uuids;
    },

    getCsrfHeader: function() {
        return this.data.csrfHeader;
    },

    getCsrfToken: function() {
        return this.data.csrfToken;
    },

    getAuthToken: function() {
        return this.data.authToken;
    },

    getAuthCode: function() {
        return this.data.authCode;
    },

    isLogin: function() {
        return this.data.authToken != null;
    },

    isUserMe: function(uuid) {
        if (this.data.userSelf == null) {
            return false;
        }
        return this.data.userSelf.userUuid === uuid;
    },

    amIAdmin: function() {
        let self = this.data.userSelf;
        if (self != null) {
            if (self.role && self.role.indexOf("Admin") >= 0) {
                return true;
            }
        }
        return false;
    },

    getSelf: function() {
        return this.data.userSelf;
    },

    getSelfUuid: function() {
        return this.data.userSelf.userUuid;
    },

    getActiveUser: function() {
        return this.data.userActive;
    },

    setActiveUser: function(user) {
        this.data.userActive = user;
    },

    getData: function() {
        return this.data;
    },

    dumpData: function(header) {
        console.log("UserStore content: " + header);
        console.log(this.data);
    },

    setFetchUser: function(uuid) {
        this.uuidFetch[uuid] = true;
    },

    /**
     * Iterate through each user with uuid in the list.  If the list is null, iterate through all users.
     */
    iterUser: function(uuidList, func) {
        if (uuidList == null) {
            _.forOwn(this.data.userMap, func);
        } else {
            _.forOwn(uuidList, function(uuid, key) {
                let usr = this.data.userMap[uuid];
                if (usr !== undefined && usr !== null) {
                    func(usr, key);
                }
            }.bind(this));
        }
    },

    iterUserRelationship: function(uuidList, dispatch, arg) {
        this.iterUser(uuidList, function(user, idx) {
            let key = user.userUuid;
            if (user.isInConnection()) {
                dispatch.connectFn(user, key, arg);

            } else if (user.isInFollowed()) {
                dispatch.followFn(user, key, arg);

            } else if (user.isFollower()) {
                dispatch.followerFn(user, key, arg);

            } else if (user.isUserMe()) {
                displatch.meFn(user, key, arg);

            } else {
                dispatch.strangerFn(user, key, arg);
            }
            dispatch.iterFn(user, key, arg);
        });
    },

    /* Startup actions. */
    onStartupCompleted: function(json) {
        if (json.userDTO != null) {
            this._updateLogin(json.userDTO);
            this._changedData(json.userDTO);
        }
        this._addFromJson(json.linkedUsers);
    },

    onRefreshNotifyCompleted: function(json) {
        this.trigger(this.data);
    },

    /* Login actions. */
    onLoginCompleted: function(response, status) {
        this._changedData(response);
    },

    onLoginFailed: function(xhdr, text, error) {
        this._changedDataFailure(xhdr, text, error);
    },

    /* Register actions. */
    onRegisterCompleted: function(response, text) {
        this._changedData(response);
    },

    onRegisterFailed: function(xhdr, text, error) {
        this._changedDataFailure(xhdr, text, error);
    },

    onVerifyAccountCompleted: function(response, text) {
        this._changedData(response);
    },

    onVerifyAccountFailed: function(xhdr, text, error) {
        this._changedDataFailure(xhdr, text, error);
    },

    /* Logout actions. */
    onLogoutCompleted: function() {
        this._reset();
        localStorage.removeItem("authToken");
    },

    /* Password reset actions. */
    onResetPasswordCompleted: function() {
        this.trigger(this.data);
    },

    onResetPasswordFailed: function() {
        this.trigger(this.data);
    },

    /* Init. action. */
    onInitCompleted: function(json) {
        this._changedData(null);
    },

    /* Preload for server-less test. */
    onPreloadCompleted: function(raw) {
        this._addFromJson(raw.users);
        this._changedData(null);
    },

    /* Change user connection status. */
    onChangeUsersCompleted: function(raw) {
        this._setFriendStatus(raw.result.follow, "followed");
        this._setFriendStatus(raw.result.connect, "connected");
        this._setFriendStatus(raw.result.connecting, "connecting");
        this.trigger(this.data);
    },

    onUploadAvataDoneCompleted: function(data) {
        let self = this.getSelf();
        self.userImgUrl = data.imgObjUrl;
    },

    _reset: function() {
        this.data.userMap = {};
        this.data.userSelf = null;
        this.data.userActive = null;
        this.data.authError = null;
        this.data.authToken = null;
        this.data.csrfHeader = null;
        this.data.csrfToken = null;
    },

    _changedDataFailure: function(xhdr, text, error) {
        console.log("Post action UserStore failed");
        console.log(xhdr);
        this._changedData({
            type   : "failure",
            error  : ErrorStore.hasError(),
            message: text,
            authToken: null,
            authVerifToken: null
        });
    },

    _updateLogin: function(user) {
        if (user != null) {
            this.data.csrfHeader = user.csrfHeader;
            this.data.csrfToken = user.csrfToken;

            if ((user.csrfHeader !== null) && (user.csrfHeader !== undefined)) {
                $("meta[name='_csrf']").attr("content", user.csrfToken);
                $("meta[name='_csrf_header']").attr("content", user.csrfHeader);
            }
        }
    },

    _changedData: function(resp) {
        if (resp != null) {
            this.data.authCode  = resp.type;
            this.data.authMesg  = resp.message;
            this.data.authError = resp.error;
            this.data.authToken = resp.authToken;
            this.data.authVerifToken = resp.authVerifToken;

            if (resp.userSelf != null) {
                let self = new User(resp.userSelf);
                this.data.userSelf = self;
                this.data.userActive = self;
                this.data.userMap[self.userUuid] = self;
                localStorage.setItem("authToken", resp.authToken);
            }
            if (resp.message == "") {
                this.data.authMesg = resp.error;
            }
        }
        this.trigger(this.data);
    },

    _addFromJson: function(items) {
        _(items).forOwn(function(it) {
            if (it.connectState === "self" && this.data.userSelf === null) {
                this.data.userSelf = new User(it);
                this.data.userActive = this.data.userSelf;
                this.data.userMap[it.userUuid] = this.data.userSelf;
                return;
            }
            if (_.isEmpty(this.data.userMap[it.userUuid])) {
                this.data.userMap[it.userUuid] = new User(it);
            }
        }.bind(this));

        if (this.data.userSelf != null) {
            this.data.userSelf.setConnectState();
            this.data.userSelf.connectState = "connected";
        }
    },

    _setFriendStatus: function(uuids, status) {
        if (uuids !== null && uuids !== undefined) {
            uuids.map(function(uuid) {
                let user = this.data.userMap[uuid];
                if (user) {
                    user.connectState = status;
                }
            }.bind(this));
        }
    },

    exports: {
    }
});

User.prototype.setConnectState = function() {
    let filter = function(state) {
        return function(elm) {
            let user = UserStore.getUserByUuid(elm);
            if (user && user.userUuid !== this.userUuid) {
                user.connectState = state;
            }
        }.bind(this);
    }.bind(this);

    _.forOwn(this.connectList, filter("connected"));
    _.forOwn(this.followList, filter("followed"));
    _.forOwn(this.followerList, filter("follower"));
};

User.prototype.isUserMe = function() {
    return UserStore.isUserMe(this.userUuid);
}

export default UserStore
