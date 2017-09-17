/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _        from 'lodash';
import $        from 'jquery';
import Reflux   from 'reflux';

import ErrorStore   from 'vntd-shared/stores/ErrorStore.jsx';
import Actions      from 'vntd-root/actions/Actions.jsx';
import {VntdGlob}   from 'vntd-root/config/constants.js';

/*
 * Explicit define known fields in User object.
 */
class User {
    constructor(data) {
        _.forEach(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this.connectState = "stranger";
        this.followers    = this.followerList.length;
        this.follows      = this.followList.length;
        this.connections  = this.connectList.length;

        this.hasData      = 0;
        this.PublicData   = 1;
        this.GroupData    = 2;
        this.PrivateData  = 4;
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

    getCoverImg(index) {
        if (index === 0) {
            return this.coverImg0;
        }
        if (index === 1) {
            return this.coverImg1;
        }
        return this.coverImg2;
    }

    getDomainLink() {
        return ("/domain/" + this.userUuid);
    }

    updateProfile(self) {
        this.firstName = self.firstName;
        this.lastName  = self.lastName;
        this.homeTown  = self.homeTown;
        this.state     = self.state;
        this.country   = self.country;
    }

    getCoverImgStyle() {
        return {
            backgroundImage: 'url(' + this.coverImg0 + ')'
        };
    }

    _reqDomainData() {
        return {
            authorUuid: this.userUuid,
            uuidType  : "domain",
            reqKind   : this.domain
        };
    }

    _reqDataResult(result, context) {
        this.hasData = this.hasData | context.mask;
    }

    getPublicData() {
        if ((this.hasData & this.PublicData) == 0) {
            let context = {
                user: this,
                mask: this.PublicData
            };
            Actions.getDomainData(this._reqDomainData(), context);
            return true;
        }
        return false;
    }

    getGroupData() {
        if ((this.hasData & this.GroupData) == 0) {
            console.log("Request to get Group data");
        }
    }

    getPrivateData() {
        if ((this.hasData & this.PrivateData) == 0) {
            console.log("Request to get Private data");
        }
    }
}

let UserStore = Reflux.createStore({
    data: null,
    listenables: [Actions],

    _reset: function() {
        this.data = {
            userMap   : {},
            uuidFetch : {},
            userSelf  : null,
            userActive: null,
            authCode  : null,
            authMesg  : null,
            authError : null,
            authToken : null,
            csrfHeader: null,
            csrfToken : null,
            loginReady: false,

            estoreUuids   : {},
            artStoreUuids : {},
            authVerifToken: null
        };
    },

    init: function() {
        this._reset();
    },

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

    getFetchedUuidList: function(req) {
        let result, updated, userMap;

        if (this.data.loginReady === false) {
            return null;
        }
        result = [];
        updated = null;
        userMap = this.data.userMap;

        if (req === 'estore') {
            updated = this.data.estoreUuids;
        } else {
            updated = this.data.artStoreUuids;
        }
        _.forOwn(userMap, function(user) {
            let uuid = user.userUuid;
            if (updated[uuid] !== uuid) {
                result.push(uuid);
                updated[uuid] = uuid;
            }
        });
        return result;
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

    getSelfUuid: function(uuid) {
        if (uuid != null) {
            return uuid;
        }
        if (this.data.domainUuid != null) {
            return this.data.domainUuid;
        }
        if (this.data.userSelf != null) {
            return this.data.userSelf.userUuid;
        }
        return VntdGlob.publicUuid;
    },

    getDomainUuid: function() {
        return this.data.domainUuid;
    },

    getDomain: function() {
        return this.data.domain;
    },

    getActiveUser: function() {
        return this.data.userActive;
    },

    getAllUserDomains: function() {
        let out = [];
        _.forOwn(this.data.userMap, function(user) {
            if (user.domain != null) {
                out.push({
                    domain  : user.domain,
                    userUuid: user.userUuid
                });
            }
        });
        return out;
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
     * Iterate through each user with uuid in the list.  If the list is null,
     * iterate through all users.
     */
    iterUser: function(uuidList, func) {
        if (uuidList == null) {
            _.forOwn(this.data.userMap, func);
        } else {
            _.forOwn(uuidList, function(uuid, key) {
                let usr = this.data.userMap[uuid];
                if (usr != null) {
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
                dispatch.meFn(user, key, arg);

            } else {
                dispatch.strangerFn(user, key, arg);
            }
            dispatch.iterFn(user, key, arg);
        });
    },

    /* Startup actions. */
    onStartupCompleted: function(json) {
        this.data.domain     = json.domain;
        this.data.domainUuid = json.domainUuid;
        this._addFromJson(json.linkedUsers);
        if (json.userDTO != null) {
            this._changedData(json.userDTO);
            this._updateLogin(json.userDTO);
        }
        if (this.isLogin()) {
            this.data.loginReady = true;
        }
    },

    onRefreshNotifyCompleted: function(resp) {
        this.trigger(this.data, "refresh", resp);
    },

    /* Login actions. */
    onLoginCompleted: function(response, status) {
        this._changedData(response);
        this.data.loginReady = true;
        Actions.startup("/api/user");
    },

    onLoginEmailCompleted: function(response) {
        this._changedData(response);
        Actions.startup("/api/user");
    },

    onLoginFailed: function(error) {
        this._changedDataFailure(error);
    },

    /* Register actions. */
    onRegisterCompleted: function(response, text) {
        this._changedData(response);
    },

    onResendRegisterCompleted: function(response, text) {
        this._changedData(response);
    },

    onRegisterFailed: function(error) {
        this._changedDataFailure(error);
    },

    onVerifyAccountCompleted: function(response, text) {
        this._changedData(response);
    },

    onVerifyAccountFailed: function(error) {
        this._changedDataFailure(error);
    },

    onUpdateProfileCompleted: function(response) {
        let self = this.data.userSelf;
        if (self.userUuid === response.userSelf.userUuid) {
            self.updateProfile(response.userSelf);
        }
        this.trigger(this.data, "update-profile", response);
    },

    onUpdateDomainCompleted: function(resp) {
        this.trigger(this.data, "update-domain", resp);
    },

    onGetDomainDataCompleted: function(resp, context) {
        context.user._reqDataResult(resp, context);
        this.trigger(this.data, "get-domain", resp);
    },

    /* Logout actions. */
    onLogoutCompleted: function() {
        this._reset();
        this.data.loginReady = false;
        localStorage.removeItem("authToken");
    },

    /* Password reset actions. */
    onResetPasswordCompleted: function(response) {
        this.trigger(this.data, "reset-password", response);
    },

    onResetPasswordFailed: function(error) {
        this.trigger(this.data, "reset-password-failed", error);
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
        this.trigger(this.data, "change-users", raw);
    },

    onUploadAvataDoneCompleted: function(data) {
        let self = this.getSelf();
        self.userImgUrl = data.imgObjUrl;
    },

    _changedDataFailure: function(error) {
        this._changedData({
            error  : error,
            type   : error.errorCodeText,
            message: error.userText,
            authToken: null,
            authVerifToken: null
        });
    },

    _updateLogin: function(user) {
        if (user != null) {
            if (user.csrfHeader != null) {
                $("meta[name='_csrf']").attr("content", user.csrfToken);
                $("meta[name='_csrf_header']").attr("content", user.csrfHeader);
            }
            this.data.csrfHeader = user.csrfHeader;
            this.data.csrfToken = user.csrfToken;
        }
    },

    _changedData: function(resp) {
        let startPage = null;

        if (resp != null) {
            this.data.authCode  = resp.type;
            this.data.authMesg  = resp.message;
            this.data.authHelp  = resp.error != null ? resp.error.userHelp : "";
            this.data.authError = resp.error;
            this.data.authToken = resp.authToken;
            this.data.authVerifToken = resp.authVerifToken;

            if (resp.userSelf != null) {
                let self = new User(resp.userSelf);
                this.data.userSelf = self;
                this.data.userActive = self;
                this.data.userMap[self.userUuid] = self;
                localStorage.setItem("authToken", resp.authToken);
                startPage = self.startPage;
            }
            if (resp.message == "") {
                this.data.authMesg = resp.error;
            }
        }
        this.trigger(this.data, startPage, resp);
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
        if (uuids != null) {
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
