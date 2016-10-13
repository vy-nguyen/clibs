/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux        from 'reflux';
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
    register:        completedFailedFn,
    verifyAccount:   completedFailedFn,
    resetPassword:   completedFailedAlwaysFn,

    changeUsers:     completedFailedFn,
    saveUserPost:    completedFailedFn,
    deleteUserPost:  completedFailedFn,
    publishUserPost: completedFailedFn,

    getArticles:     completedFailedFn,
    getOneArticle:   completedFailedFn,
    getComments:     completedFailedFn,

    pendingPost:     completedFn,
    uploadAvataDone: completedFn,

    // Comment actions
    updateComment:   completedFn,
    postComment:     completedFailedFn,
    postCmtSelect:   completedFailedFn,

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

    // Language choices
    translate:       completedFn,
    getLangJson:     completedFailedFn,
    selectLanguage:  completedFailedFn,

    // Admin actions
    listUsers:       completedFailedFn,
    setTags:         completedFailedFn
});

function postRestCall(formData, url, json, cbObj, authReq, id, context) {
    let type = undefined;
    let data = formData;
    let content = undefined;

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
        cbObj.completed(resp, text);

    }).fail(function(resp, text, error) {
        resp.cbContext = context;
        cbObj.failed(ErrorStore.reportFailure(id, resp, text, error));

    }).always(function(resp, text, error) {
        resp.cbContext = context;
        if (cbObj.always != null) {
            cbObj.always(resp, text, error);
        }
    });
};

function getJSON(url, cbObj, authReq, id, context)
{
    if ((authReq === true) && !UserStore.isLogin()) {
        Actions.authRequired(id, context);
        return;
    }
    $.getJSON(url).done(function(data) {
        data.cbContext = context;
        cbObj.completed(data);

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
    getJSON(url, this, false, "startup");
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

Actions.logout.listen(function() {
    this.completed();
    document.location.href = "/login/logout";
});

Actions.register.listen(function(regData) {
    postRestCall(regData, "/register", true, this);
});

Actions.verifyAccount.listen(function(regData) {
    postRestCall(regData, "/register/verify", true, this);
});

Actions.resetPassword.listen(function(resetData) {
    postRestCall(resetData, "/", true, this);
});

Actions.preload.listen(function() {
    /*
    let data = {
        articles: require('json!../mock-json/article.json'),
        authors : require('json!../mock-json/author.json'),
        users   : require('json!../mock-json/user.json'),
        comments: require('json!../mock-json/comment.json')
    };
    this.completed(data);
     */
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

Actions.pendingPost.listen(function(data) {
    this.completed(data);
});

/**
 * Comment actions.
 */
Actions.updateComment.listen(function(data) {
    console.log(data);
    postRestCall(data, "/user/change-comment", true, this, true, "updateComment");
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
    postRestCall(data, "/user/update-art-rank", true, this, true, "updateArtRank", callback);
});

Actions.postArtSelect.listen(function(data) {
    postRestCall(data, "/user/update-art-rank", true, this, true, "postArtSelect");
});

Actions.getArticleRank.listen(function(data) {
    postRestCall(data, "/user/get-art-rank", true, this, "getArticleRank");
});

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
    console.log("Request admin get users");
    getJSON("/admin/list-users", this, true, "listUsers");
});

Actions.setTags.listen(function(data) {
    postRestCall(data, "/admin/set-tags", true, this, true, "setTags");
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
