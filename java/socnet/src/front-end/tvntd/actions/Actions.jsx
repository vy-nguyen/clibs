/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux        from 'reflux';
import $             from 'jquery';
import UserStore     from 'vntd-shared/stores/UserStore.jsx';
import ErrorStore    from 'vntd-shared/stores/ErrorStore.jsx';

const completedFn = {
    children: ['completed']
};
const completedFailedFn = {
    children: ['completed', 'failed']
};
const completedFailedAlwaysFn = {
    children: ['completed', 'failed', 'always']
};

const Actions = Reflux.createActions({

    clickMenuItem:   completedFn,
    authRequired:    completedFn,

    // User actions
    logout:          completedFailedFn,
    initialData:     completedFailedFn,
    startup:         completedFailedFn,
    getAuthors:      completedFailedFn,
    refreshArticles: completedFailedFn,
    refreshNotify:   completedFailedFn,
    login:           completedFailedFn,
    loginEmail:      completedFailedFn,
    register:        completedFailedFn,
    resendRegister:  completedFailedFn,
    verifyAccount:   completedFailedFn,
    resetPassword:   completedFailedAlwaysFn,
    updateProfile:   completedFailedFn,

    changeUsers:     completedFailedFn,
    saveUserPost:    completedFailedFn,
    deleteUserPost:  completedFailedFn,
    publishUserPost: completedFailedFn,
    updateUserPost:  completedFailedFn,

    getArticles:     completedFailedFn,
    getOneArticle:   completedFailedFn,
    getComments:     completedFailedFn,

    pendingPost:     completedFn,
    uploadAvataDone: completedFn,

    publishProduct:  completedFailedFn,
    pendingProduct:  completedFn,
    getPublishProds: completedFailedFn,
    deleteProduct:   completedFailedFn,

    // Comment actions
    updateComment:   completedFn,
    postComment:     completedFailedFn,
    postCmtSelect:   completedFailedFn,

    // Public ads posting
    publicPostAds:   completedFailedFn,
    getPublishAds:   completedFailedFn,

    // Rank article
    getArticleRank:  completedFailedFn,
    updateArtRank:   completedFailedFn,
    postArtSelect:   completedFailedFn,
    commitTagRanks:  completedFailedFn,
    reRankTag:       completedFn,

    // Get public JSON objs.
    getPublicJson:   completedFailedFn,

    // Preload json for testing.
    preload:         completedFailedFn,

    // Check point to sync new data.
    syncServer:      completedFn,

    // Language choices
    translate:       completedFn,
    getLangJson:     completedFailedFn,
    selectLanguage:  completedFailedFn,

    // Admin actions
    listUsers:       completedFailedFn,
    changeTagArt:    completedFailedFn,
    setTags:         completedFailedFn
});

function postRestCall(formData, url, json, cbObj, authReq, id, context) {
    let type, content, data = formData;

    if ((authReq === true) && !UserStore.isLogin()) {
        Actions.authRequired(id, context);
        return;
    }
    if (json === true) {
        type = "JSON";
        data = JSON.stringify(formData);
        content = "application/json; charset=utf-8";
    }
    $.ajax({
        type: "POST",
        url : url,
        data: data,
        dataType: type,
        contentType: content,
        beforeSend: function(xhdr) {
            let token  = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhdr.setRequestHeader(header, token);
        }
    }).done(function(resp, text, error) {
        resp.cbContext = context;
        cbObj.completed(resp, context);

    }).fail(function(resp, text, error) {
        console.log("REST call failed " + url);
        console.log(resp);

        resp.cbContext = context;
        cbObj.failed(ErrorStore.reportFailure(id, resp, text, error));

    }).always(function(resp, text, error) {
        resp.cbContext = context;
        if (cbObj.always != null) {
            cbObj.always(resp, text, error);
        }
    });
}

function getJSON(url, cbObj, authReq, id, context, syncServer) {
    if ((authReq === true) && !UserStore.isLogin()) {
        Actions.authRequired(id, context);
        return;
    }
    $.getJSON(url).done(function(data, status, resp) {
        data.cbContext = context;
        cbObj.completed(data);
        if (syncServer === true) {
            Actions.syncServer();
        }

    }).fail(function(resp, text, error) {
        resp.cbContext = context;
        cbObj.failed(ErrorStore.reportFailure(id, resp, text, error));

    }).always(function(resp, text, error) {
        resp.cbContext = context;
        if (cbObj.always != null) {
            cbObj.always(resp, text, error);
        }
    });
}

/**
 * UI click actions.
 */
Actions.clickMenuItem.listen(function(item) {
    this.completed(item);
});

Actions.authRequired.listen(function(id, context) {
    this.completed(id, context);
});

/**
 * User menu actions.
 */
Actions.startup.listen(function(url) {
    $('[data-toggle="tooltip"]').tooltip();
    getJSON(url, this, false, "startup", null, true);
});

Actions.refreshNotify.listen(function() {
    getJSON("/api/user-notification", this, true, "refreshNotify");
});

Actions.getAuthors.listen(function(data, url) {
    if (url) {
        getJSON(url, this, true, "getAuthors");
    } else {
        this.completed(data);
    }
});

/**
 * Posts and comments.
 */
Actions.refreshArticles.listen(function(authorUuid) {
    getJSON("/user/get-posts/" + authorUuid, this, true, "refreshArticles");
});

Actions.getOneArticle.listen(function(artUuid) {
    getJSON("/user/get-article/" + artUuid, this, true, "getOneArticle");
});

Actions.getArticles.listen(function(artUuids) {
    postRestCall(artUuids, "/user/get-articles", true, this);
});

Actions.getComments.listen(function(artUuids) {
    let url = UserStore.isLogin() ? "/user/get-comments" : "/public/get-comments";
    postRestCall(artUuids, url, true, this);
});

Actions.uploadAvataDone.listen(function(data) {
    this.completed(data);
});

/**
 * User actions.
 */
Actions.login.listen(function(loginData, formData) {
    postRestCall(formData, "/login", false, this);
});

Actions.loginEmail.listen(function(loginData) {
    postRestCall(loginData, "/login/email", true, this);
});

Actions.logout.listen(function() {
    this.completed();
    document.location.href = "/login/logout";
});

Actions.register.listen(function(regData) {
    postRestCall(regData, "/register", true, this);
});

Actions.resendRegister.listen(function(regData) {
    postRestCall(regData, "/register/resend", true, this);
});

Actions.verifyAccount.listen(function(regData) {
    postRestCall(regData, "/register/verify", true, this);
});

Actions.resetPassword.listen(function(resetData) {
    postRestCall(resetData, "/", true, this);
});

Actions.updateProfile.listen(function(data) {
    postRestCall(data, "/user/update-profile", true, this);
});

Actions.preload.listen(function() {
    /*
    let data = {
        articles: require('json!../mock-json/article.json'),
        authors : require('json!../mock-json/author.json'),
        users   : require('json!../mock-json/user.json'),
        comments: require('json!../mock-json/comment.json')
    };
    */
    this.completed(null);
});

/**
 * User activities.
 */
Actions.changeUsers.listen(function(data) {
    postRestCall(data, "/api/user-connections", true, this, true, "changeUsers");
});

Actions.saveUserPost.listen(function(data) {
    postRestCall(data, "/user/save-post", true, this, true, "saveUserPost");
    Actions.pendingPost(data);
});

Actions.deleteUserPost.listen(function(data) {
    postRestCall(data, "/user/delete-post", true, this, true, "deleteUserPost");
});

Actions.publishUserPost.listen(function(data) {
    postRestCall(data, "/user/publish-post", true, this, true, "publishUserPost");
    Actions.pendingPost(data);
});

Actions.updateUserPost.listen(function(data, save) {
    let url = save === true ? "/user/update-post/save" : "/user/update-post/publish";
    postRestCall(data, url, true, this, true, "updateUserPost");
    Actions.pendingPost(data);
});

Actions.pendingPost.listen(function(data) {
    this.completed(data);
});

Actions.publishProduct.listen(function(data) {
    postRestCall(data, "/user/publish-product", true, this, true, "pubishProduct");
    Actions.pendingProduct(data);
});

Actions.pendingProduct.listen(function(data) {
    this.completed(data);
});

Actions.getPublishProds.listen(function(data) {
    postRestCall(data, "/public/get-estores", true, this, false, "getPublishProds");
});

Actions.deleteProduct.listen(function(data) {
    postRestCall(data, "/user/delete-product", true, this, true, "deleteProduct");
});

/**
 * Public ads posting.
 */
Actions.publicPostAds.listen(function(data) {
    postRestCall(data, "/public/publish-ads", true, this, false, "publicPostAds");
});

Actions.getPublishAds.listen(function(data) {
    postRestCall(data, "/public/get-ads", true, this, false, "getPublishAds");
});

/**
 * Comment actions.
 */
Actions.updateComment.listen(function(data, callback) {
    postRestCall(data, "/user/change-comment",
                 true, this, true, "updateComment", callback);
});

Actions.postComment.listen(function(data) {
    postRestCall(data, "/user/publish-comment", true, this, true, "postComment");
});

Actions.postCmtSelect.listen(function(data) {
    postRestCall(data, "/user/change-comment", true, this, true, "postCmtSelect");
});

/**
 * Rank article actions.
 */
Actions.updateArtRank.listen(function(data, callback) {
    postRestCall(data, "/user/update-art-rank",
                 true, this, true, "updateArtRank", callback);
});

Actions.postArtSelect.listen(function(data) {
    postRestCall(data, "/user/update-art-rank", true, this, true, "postArtSelect");
});

Actions.getArticleRank.listen(function(data) {
    postRestCall(data, "/user/get-art-rank", true, this, "getArticleRank");
});

/*
 * userTags: {
 *     userUuid:
 *     tagRanks: [ {
 *         tagName:
 *         parent :
 *         pubTag : true | false
 *         rank   :
 *     } ],
 *     artList: [ {
 *         tagName:
 *         artUuid: []
 *     } ]
 * }
 */
Actions.commitTagRanks.listen(function(tagMgr, userTags) {
    postRestCall(userTags, "/user/update-tag-rank", true, this, true, tagMgr.btnId, tagMgr);
});

Actions.reRankTag.listen(function(tagMgr) {
    this.completed(tagMgr);
});

/**
 * Get public json objs.
 */
Actions.getPublicJson.listen(function(url) {
    getJSON(url, this, false, "getPublicJson");
});

/**
 * Admin actions.
 */
Actions.listUsers.listen(function() {
    getJSON("/admin/list-users", this, true, "listUsers");
});

Actions.setTags.listen(function(data) {
    postRestCall(data, "/admin/set-tags", true, this, true, "setTags");
});

Actions.changeTagArt.listen(function(data) {
    console.log("publish tag");
    console.log(data);
    postRestCall(data, "/admin/change-art-tag", true, this, true, "changeTagArt");
});

/**
 * Language choices.
 */
Actions.getLangJson.listen(function(lang) {
    getJSON('/public/get-json/langs/' + lang, this, false, "getLang", lang);
});

Actions.translate.listen(function() {
    this.completed();
});

Actions.selectLanguage.listen(function(lang) {
    console.log("Set languages " + lang);
});

/**
 * Generate event to sync up with server.
 */
Actions.syncServer.listen(function() {
    this.completed();
});

export { postRestCall, Actions };
export default Actions;

/*
function uploadFiles(url, progId, formData, complete, failure) {
    $.ajax({
        type: "POST",
        url: url,
        data: formData,
        cache: false,
        xhr: function() {
            var req = $.ajaxSettings.xhr();
            if (req.upload) {
                req.upload.addEventListener('progress', progress, false);
            }
            return req;
        },
        beforeSend: function(xhdr) {
            let token  = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhdr.setRequestHeader(header, token);
        }
    }).done(function(resp, text, error) {
        complete(resp, text);

    }).fail(function(resp, text, error) {
        failure(new ErrorDispatch(resp, text, error));
    });

    function progress(e) {
        if (e.lengthComputable) {
            $('#' + progId).attr({value: e.loaded, max: e.total});
        }
    }
};
*/
