/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React  from 'react-mod';
import Reflux from 'reflux';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import DropzoneComponent from 'react-dropzone-component';

import ArticleStore    from 'vntd-root/stores/ArticleStore.jsx';
import Actions         from 'vntd-root/actions/Actions.jsx';
import Select2         from 'vntd-shared/forms/inputs/Select2.jsx';
import Editor          from 'vntd-shared/forms/editors/Editor.jsx';
import JarvisWidget    from 'vntd-shared/widgets/JarvisWidget.jsx';

let EditorPost = React.createClass({

    mixins: [Reflux.connect(ArticleStore)],

    _getData: function() {
        return {
            topic: this.refs.topic.value,
            tags: this.refs.tags.value,
            content: this.state.content,
            articleUuid: this.state.articleUuid
        }
    },

    _savePost: function(e) {
        e.preventDefault();
        this.setState({
            status: 'Saving...'
        });
        console.log(this.state);
        Actions.saveUserPost(this._getData());
    },

    _publishPost: function(e) {
        e.preventDefault();
        this.setState({
            status: 'Publishing...'
        });
        Actions.publishUserPost(this._getData());
        this.setState({
            status: 'Published'
        });
    },

    _onPublishResult: function() {
        if (this.state.errorResp !== null) {
            let status = (this.state.status == "Saving...") ? 'Save Failed' : 'Publish Failed';
            this.setState({
                status: status
            });
        }
    },

    _handleContentChange: function(e) {
        this.setState({
            content: e.target.value,
            status: 'Draft'
        });
    },

    _onSend: function(files, xhr, form) {
        form.append('name', files.name);
        form.append('articleUuid', this.state.articleUuid);
    },

    _onComplete: function(file, a) {
        console.log("Upload complete");
        console.log(file.xhr);
    },

    _onSuccess: function(files, a, b, c) {
        console.log("scuesss");
        console.log(files);
        console.log(a);
        console.log(b);
        console.log(c);
    },

    _onError: function(file) {
        console.log("Error ");
        console.log(file.xhr);
    },

    getInitialState: function() {
        return {
            content: '',
            status: 'Clean',
            errorText: "",
            errorResp: null,
            articleUuid: "",
            imgUuidList: []
        }
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
            sending:  this._onSend,
            complete: this._onComplete,
            success:  this._onSuccess,
            error:    this._error
        };

        let form = (
            <form encType="multipart/form-data" acceptCharset="utf-8" className="form-horizontal">
                <div className="inbox-info-bar no-padding">
                    <div className="row">
                        <div className="form-group">
                            <label className="control-label col-md-1"><strong>Topic</strong></label>
                            <div className="col-md-10">
                                <input ref="topic" className="form-control" placeholder="Topic" type="text"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inbox-info-bar no-padding">
                    <div className="row">
                        <div className="form-group">
                            <label className="control-label col-md-1"><strong>Link Chain</strong></label>
                            <div className="col-md-10">
                                <input ref="tags" className="form-control" placeholder="My Posts" type="text"/>
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
                                <DropzoneComponent className="col-sm-12 col-md-12col-lg-12"
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
                    <button onClick={this._savePost}
                        className="btn btn-danger margin=top-10 pull-right" type="button">Save</button>

                    <button onClick={this._publishPost}
                        className="btn btn-info  margin=top-10 pull-right" type="button">Publish</button>
                </div>
            </form>
        );
        return (
            <div className="row">
                <article className="col-sm-12 col-md-12 col-lg-12">
                    <JarvisWidget id="my-post" color="purple">
                        <header>
                            <span className="widget-icon"> <i className="fa fa-pencil"/></span>
                            <h2>Publish Post <span className="label txt-color-white">{this.state.status}</span></h2>
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
