/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux   from 'reflux';
import _        from 'lodash';
import Actions  from 'vntd-root/actions/Actions.jsx';

let OnlineEnum = ["online", "offline", "busy"];
let ConnetEnum = ["self", "connected", "followed", "follower", "stranger"];

/*
 * Explicit define known fields in User object.
 */
class User {
    constructor(data) {
        this._id          = _.uniqueId('id-user-info-');
        this.email        = data.email;
        this.userUuid     = data.userUuid;
        this.userName     = data.userName;
        this.firstName    = data.firstName;

        this.lastName     = data.lastName;
        this.userRole     = data.userRole;
        this.userUrl      = data.userUrl;
        this.userImgUrl   = data.userImgUrl;
        this.userStatus   = data.userStatus;

        this.coverImg0    = data.coverImg0;
        this.coverImg1    = data.coverImg1;
        this.coverImg2    = data.coverImg2;

        this.transRoot    = data.transRoot;
        this.mainRoot     = data.mainRoot;

        this.creditEarned = data.creditEarned;
        this.moneyEarned  = data.moneyEarned;
        this.creditIssued = data.creditIssued;
        this.moneyIssued  = data.moneyIssued;

        this.connectState = "stranger";

        this.connectList  = data.connectList;
        this.followList   = data.followList;
        this.followerList = data.followerList;
        this.chainLinks   = data.chainLinks;

        this.followers    = this.followerList.length;
        this.follows      = this.followList.length;
        this.connections  = this.connectList.length;
        return this;
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
        if (uuid === null || uuid === undefined) {
            return this.getSelf();
        }
        let user = this.data.userMap[uuid];
        return user !== undefined ? user : null;
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
        return this.data.authToken !== null;
    },

    isUserMe: function(uuid) {
        if (this.data.userSelf === null) {
            return false;
        }
        return this.data.userSelf.userUuid === uuid;
    },

    getSelf: function() {
        return this.data.userSelf;
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
        let users = this.getUserList();
        if (uuidList === null || uuidList === undefined) {
            _.forOwn(users, function(usr, key) {
                func(usr, key);
            });
        } else {
            _.forOwn(uuidList, function(uuid, key) {
                let usr = users[uuid];
                if (usr !== undefined && usr !== null) {
                    func(usr, key);
                }
            });
        }
    },

    /* Startup actions. */
    onStartupCompleted: function(json) {
        if (json.userDTO !== null && json.userDTO !== undefined) {
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
            type: "failure",
            error: xhdr,
            message: text,
            authToken: null,
            authVerifToken: null
        });
    },

    _updateLogin: function(user) {
        if (user !== null && user !== undefined) {
            this.data.csrfHeader = user.csrfHeader;
            this.data.csrfToken = user.csrfToken;

            if ((user.csrfHeader !== null) && (user.csrfHeader !== undefined)) {
                $("meta[name='_csrf']").attr("content", user.csrfToken);
                $("meta[name='_csrf_header']").attr("content", user.csrfHeader);
            }
        }
    },

    _changedData: function(resp) {
        if (resp !== null && resp !== undefined) {
            this.data.authCode  = resp.type;
            this.data.authMesg  = resp.message;
            this.data.authError = resp.error;
            this.data.authToken = resp.authToken;
            this.data.authVerifToken = resp.authVerifToken;

            if ((resp.userSelf !== undefined) && (resp.userSelf !== null)) {
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
                if (!_.isEmpty(user)) {
                    user.connectState = status;
                }
            }.bind(this));
        }
    },

    exports: {
    }
});

User.prototype.setConnectState = function() {
    let status = "connected";
    let filter = function(elm) {
        let user = UserStore.getUserByUuid(elm);
        if (user !== undefined && user.userUuid !== this.userUuid) {
            user.connectState = status;
        }
    }.bind(this);
    _.forOwn(this.connectList, filter);

    status = "followed";
    _.forOwn(this.followList, filter);

    status = "follower";
    _.forOwn(this.followerList, filter);
};

User.prototype.isUserMe = function() {
    return UserStore.isUserMe(this.userUuid);
}

export default UserStore
