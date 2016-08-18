/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux           from 'reflux';
import moment           from 'moment';
import ErrorDispatch    from 'vntd-shared/actions/ErrorDispatch.jsx';

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
    switchComment:   completedFn,
    postComment:     completedFailedFn,
    postCmtSelect:   completedFailedFn,

    // Rank article
    getArticleRank:  completedFailedFn,
    updateArtRank:   completedFailedFn,
    postArtSelect:   completedFailedFn,
    reRankTags:      completedFn,

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

function postRestCall(formData, url, json, cbObj) {
    let type = undefined;
    let data = formData;
    let content = undefined;

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
        cbObj.completed(resp, text);

    }).fail(function(resp, text, error) {
        cbObj.failed(new ErrorDispatch(resp, text, error));

    }).always(function(resp, text, error) {
        if (cbObj.always != null) {
            cbObj.always(resp, text, error);
        }
    });
};

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

/**
 * UI click actions.
 */
Actions.clickMenuItem.listen(function(item) {
    this.completed(item);
});

/**
 * User menu actions.
 */
Actions.startup.listen(function(url) {
    $('[data-toggle="tooltip"]').tooltip();
    $.getJSON(url).then(function(data) {
        if (this.translate != null) {
            this.translate(data);
        }
        this.completed(data);
    }.bind(this), this.failed);
});

Actions.refreshNotify.listen(function() {
    $.getJSON("/api/user-notification").then(this.completed, this.failed);
});

Actions.getAuthors.listen(function(data, url) {
    if (url) {
        $.getJSON(url).then(this.completed, this.failed);
    } else {
        this.completed(data);
    }
});

/**
 * Posts and comments.
 */
Actions.refreshArticles.listen(function(authorUuid) {
    $.getJSON("/user/get-posts/" + authorUuid).then(this.completed, this.failed);
});

Actions.getOneArticle.listen(function(artUuid) {
    $.getJSON("/user/get-article/" + artUuid).then(this.completed, this.failed);
});

Actions.getArticles.listen(function(artUuids) {
    postRestCall(artUuids, "/user/get-articles", true, this);
});

Actions.getComments.listen(function(artUuids) {
    postRestCall(artUuids, "/user/get-comments", true, this);
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
    postRestCall(data, "/api/user-connections", true, this);
});

Actions.saveUserPost.listen(function(data) {
    postRestCall(data, "/user/save-post", true, this);
    Actions.pendingPost(data);
});

Actions.deleteUserPost.listen(function(data) {
    postRestCall(data, "/user/delete-post", true, this);
});

Actions.publishUserPost.listen(function(data) {
    postRestCall(data, "/user/publish-post", true, this);
    Actions.pendingPost(data);
});

Actions.pendingPost.listen(function(data) {
    this.completed(data);
});

/**
 * Comment actions.
 */
Actions.switchComment.listen(function(data) {
    this.completed(data);
});

Actions.postComment.listen(function(data) {
    postRestCall(data, "/user/publish-comment", true, this);
});

Actions.postCmtSelect.listen(function(data) {
    postRestCall(data, "/user/change-comment", true, this);
});

/**
 * Rank article actions.
 */
Actions.updateArtRank.listen(function(data) {
    postRestCall(data, "/user/update-art-rank", true, this);
});

Actions.postArtSelect.listen(function(data) {
    postRestCall(data, "/user/update-art-rank", true, this);
});

Actions.getArticleRank.listen(function(data) {
    postRestCall(data, "/user/get-art-rank", true, this);
});

Actions.reRankTags.listen(function(tagMgr) {
    this.completed(tagMgr);
});

/**
 * Get public json objs.
 */
Actions.getPublicJson.listen(function(url) {
    $.getJSON(url).then(this.completed, this.failed);
});

/**
 * Admin actions.
 */
Actions.listUsers.listen(function() {
    console.log("Request admin get users");
    $.getJSON("/admin/list-users").then(this.completed, this.failed);
});

Actions.setTags.listen(function(data) {
    postRestCall(data, "/admin/set-tags", true, this);
});

/**
 * Language choices.
 */
Actions.getLangJson.listen(function(lang) {
    $.getJSON('/public/get-json/langs/' + lang)
        .then(this.completed.bind(this, lang), this.failed.bind(this, lang));
});

Actions.translate.listen(function() {
    this.completed();
});

Actions.selectLanguage.listen(function(lang) {
    console.log("Set languages " + lang);
});

export default Actions;
