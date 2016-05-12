/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React  from 'react-mod';
import Reflux from 'reflux';
import _      from 'lodash';

import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import DropzoneComponent from 'react-dropzone-component';

import ArticleStore    from 'vntd-root/stores/ArticleStore.jsx';
import Actions         from 'vntd-root/actions/Actions.jsx';
import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import Select2         from 'vntd-shared/forms/inputs/Select2.jsx';
import Editor          from 'vntd-shared/forms/editors/Editor.jsx';
import JarvisWidget    from 'vntd-shared/widgets/JarvisWidget.jsx';
import {safeStringify} from 'vntd-shared/utils/Enum.jsx';

let EditorPost = React.createClass({

    mixins: [Reflux.connect(ArticleStore)],

    initValues: {
        topic: 'Topic',
        tags : 'My Post',
        state: {
            content    : '',
            errorText  : '',
            errorResp  : null,
            imgUuidList: [],
            articleUuid: '',

            saveDis: true,
            saveTxt: 'Save',
            saveBtn: 'btn btn-info disabled',
            publishDis: true,
            publishTxt: 'Publish',
            publishBtn: 'btn btn-info disabled'
        },
        dropzone: null
    },

    _resetData: function() {
        this.refs.topic.value = this.initValues.topic;
        this.refs.tags.value  = this.initValues.tags;
        this.setState(this.initValues.state);
        this.initValues.dropzone.removeAllFiles();
    },

    _getData: function() {
        return {
            topic  : safeStringify(this.refs.topic.value),
            tags   : safeStringify(this.refs.tags.value),
            content: safeStringify(this.state.content),
            authorUuid: UserStore.getSelf().userUuid,
            articleUuid: this.state.articleUuid
        }
    },

    _savePost: function(e) {
        e.preventDefault();
        this.setState(this._nextStatus("Saving"));
        Actions.saveUserPost(this._getData());
    },

    _publishPost: function(e) {
        e.preventDefault();
        this.setState(this._nextStatus("Publishing"));
        Actions.publishUserPost(this._getData());
    },

    _nextStatus: function(event) {
        if (event === "Draft") {
            return {
                saveDis: false,
                saveTxt: 'Save',
                saveBtn: 'btn btn-danger',
                publishDis: false,
                publishTxt: 'Publish',
                publishBtn: 'btn btn-primary'
            }
        }
        if (event === "Saving") {
            return {
                saveDis: true,
                saveTxt: 'Saving...',
                saveBtn: 'btn btn-info disabled',
                publishDis: true,
                publishTxt: 'Publish',
                publishBtn: 'btn btn-primary disabled'
            }
        }
        if (event === "Saved") {
            return {
                saveDis: true,
                saveTxt: 'Saved',
                saveBtn: 'btn btn-info disabled',
                publishDis: false,
                publishTxt: 'Publish',
                publishBtn: 'btn btn-primary'
            }
        }
        if (event === "Failed") {
            return {
                saveDis: false,
                saveTxt: 'Retry Saving',
                saveBtn: 'btn btn-danger',
                publishDis: true,
                publishTxt: 'Publish Failed',
                publishBtn: 'btn btn-danger disabled'
            }
        }
        if (event === "Publishing") {
            return {
                saveDis: true,
                saveTxt: 'Save',
                saveBtn: 'btn btn-primary disabled',
                publishDis: true,
                publishTxt: 'Publishing...',
                publishBtn: 'btn btn-danger disabled'
            }
        }
        if (event === "Published") {
            return {
                saveDis: true,
                saveTxt: 'Save',
                saveBtn: 'btn btn-primary disabled',
                publishDis: true,
                publishTxt: 'Published',
                publishBtn: 'btn btn-primary disabled'
            }
        }
        return {
            saveDis: false,
            saveTxt: 'Save',
            saveBtn: 'btn btn-primary',
            publishDis: false,
            publishTxt: 'Publish',
            publishBtn: 'btn btn-primary'
        }
    },

    _onPublishResult: function() {
        if (this.state.errorResp !== null) {
            this.setState(this._nextStatus("Failed"));
        } else {
            let state = {};
            if (this.state.saveTxt === "Saving...") {
                state = this._nextStatus("Saved");
            } else {
                state = this._nextStatus("Published");
            }
            if (this.state.myPostResult) {
                state.articleUuid = this.state.myPostResult.articleUuid;
            }
            this.setState(state);

            if (this.state.content !== '') {
                setTimeout(function() {
                    this._resetData();
                }.bind(this), 1000);
            }
        }
    },

    _handleContentChange: function(e) {
        let state = this._nextStatus("Draft");
        state.content = e.value;
        this.setState(state);
    },

    _onSend: function(files, xhr, form) {
        form.append('name', files.name);
        form.append('authorUuid', UserStore.getSelf().userUuid);
        form.append('articleUuid', this.state.articleUuid);
    },

    _onComplete: function(file, a) {
        console.log("Upload complete");
        console.log(file.xhr);
    },

    _onSuccess: function(files) {
        console.log("scuesss");
        console.log(files);
    },

    _onError: function(file) {
        console.log("Error ");
        console.log(file.xhr);
    },

    getInitialState: function() {
        return this.initValues.state;
    },

    componentDidMount: function() {
        this.listenTo(ArticleStore, this._onPublishResult);
    },

    render: function() {
        let editorStyle = {
            overflow: 'auto',
            display: 'inline-block',
            minHeight: 200
        };
        let djsConfig = {
            addRemoveLinks: true,
            acceptedFiles: "image/jpeg, image/png, image/gif",
            params: {},
            headers: {}
        };
        let token  = $("meta[name='_csrf']").attr("content");
        let header = $("meta[name='_csrf_header']").attr("content");
        djsConfig.headers[header] = token;

        const componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: '/user/upload-img'
        };
        const eventHandlers = {
            sending : this._onSend,
            complete: this._onComplete,
            success : this._onSuccess,
            error   : this._error,
            init    : function(dz) { this.initValues.dropzone = dz }.bind(this)
        };

        let form = (
            <form encType="multipart/form-data" acceptCharset="utf-8" className="form-horizontal">
                <div className="inbox-info-bar no-padding">
                    <div className="row">
                        <div className="form-group">
                            <label className="control-label col-md-1"><strong>Topic</strong></label>
                            <div className="col-md-10">
                                <input ref="topic" className="form-control" placeholder={this.initValues.topic} type="text"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inbox-info-bar no-padding">
                    <div className="row">
                        <div className="form-group">
                            <label className="control-label col-md-1"><strong>Link Chain</strong></label>
                            <div className="col-md-10">
                                <input ref="tags" className="form-control" placeholder={this.initValues.tags} type="text"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inbox-info-bar no-padding">
                    <div className="row">
                        <div className="form-group">
                            <label className="control-label col-md-1">
                                <strong>Images </strong><i className="fa fa-paperclip fa-lg"/>
                            </label>
                            <div className="col-md-10">
                                <DropzoneComponent className="col-sm-12 col-md-12col-lg-12" id="post-dropzone"
                                    dictDefaultMessage="Drop your image files here"
                                    config={componentConfig} eventHandlers={eventHandlers} djsConfig={djsConfig}>
                                </DropzoneComponent>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inbox-message no-padding">
                    <Editor id="main-post"
                        style={editorStyle}
                        content={this.state.content}
                        onChange={this._handleContentChange}
                    />
                </div>
        
                <div className="inbox-compose-footer">
                    <button onClick={this._savePost} disabled={this.state.saveDis}
                        className={this.state.saveBtn + " margin=top-10 pull-right"}
                        type="button">{this.state.saveTxt}</button>

                    <button onClick={this._publishPost} disabled={this.state.publishDis}
                        className={this.state.publishBtn + " margin=top-10 pull-right"}
                        type="button">{this.state.publishTxt}</button>
                </div>
            </form>
        );
        return (
            <div className="row">
                <article className="col-sm-12 col-md-12 col-lg-12">
                    <JarvisWidget id="my-post" color="purple">
                        <header>
                            <span className="widget-icon"> <i className="fa fa-pencil"/></span>
                            <h2>Publish Post</h2>
                        </header>
                        <div className="widget-body">
                            {form}
                        </div>
                    </JarvisWidget>
                </article>
            </div>
        )
    }
});

export default EditorPost
