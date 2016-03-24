'use strict';

import Reflux      from 'reflux';

const Actions = Reflux.createActions({
    // User actions
    logout:          {},
    startup:         {children: ['completed', 'failed']},
    login:           {children: ['completed', 'failed', 'always']},
    register:        {children: ['completed', 'failed', 'always']},
    verifyAccount:   {children: ['completed', 'failed' ]},
    resetPassword:   {children: ['completed', 'failed', 'always']},

    // Preload json for testing.
    preload:         {children: ['completed', 'failed']}
});

function postRestCall(formData, url, json, complete, failure, always) {
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
        complete(resp, text);

    }).fail(function(resp, text, error) {
        failure(resp, text, error);

    }).always(function(resp, text, error) {
        if (always != null && always != undefined) {
            always(resp, text, error);
        }
    });
};

Actions.startup.listen(function(url) {
    console.log("Request startup url " + url);
    $.getJSON(url).then(this.completed, this.failed);
});

Actions.login.listen(function(loginData, formData) {
    postRestCall(formData, "/login", false, this.completed, this.failed, this.always);
});

Actions.logout.listen(function() {
});

Actions.register.listen(function(regData) {
    postRestCall(regData, "/register", true, this.completed, this.failed, this.always);
});

Actions.verifyAccount.listen(function(regData) {
    postRestCall(regData, "/register/verify", true, this.completed, this.failed, null);
});

Actions.resetPassword.listen(function(resetData) {
    postRestCall(resetData, "/", true, this.completed, this.failed, this.always);
});

Actions.preload.listen(function() {
    let data = {
        articles: require('json!../mock-json/article.json'),
        authors : require('json!../mock-json/author.json'),
        users   : require('json!../mock-json/user.json')
    };
    this.completed(data);
});

export default Actions;
