/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _      from 'lodash';
import React  from 'react-mod';
import TA     from 'react-typeahead';

import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import DropzoneComponent from 'react-dropzone-component';

import ArticleStore    from 'vntd-root/stores/ArticleStore.jsx';
import Actions         from 'vntd-root/actions/Actions.jsx';
import AuthorStore     from 'vntd-root/stores/AuthorStore.jsx';
import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import Editor          from 'vntd-shared/forms/editors/Editor.jsx';
import GenericForm     from 'vntd-shared/forms/commons/GenericForm.jsx';
import JarvisWidget    from 'vntd-shared/widgets/JarvisWidget.jsx';

const InitState = {
    topic: 'Topic',
    tags : 'My Post',
    state: {
        content    : '',
        errorText  : '',
        errorResp  : null,
        imgUuidList: [],
        articleUuid: '',

        saveDis    : true,
        saveTxt    : 'Save',
        saveBtn    : 'btn btn-info disabled',
        publishDis : true,
        publishTxt : 'Publish',
        publishBtn : 'btn btn-info disabled'
    }
};

class EditorPost extends React.Component
{
    constructor(props) {
        super(props);

        this.dropzone = null;
        this.state = InitState.state;
        this.state.autoTags = AuthorStore.getTagsByAuthorUuid(null);

        this._resetData   = this._resetData.bind(this);
        this._getData     = this._getData.bind(this);
        this._savePost    = this._savePost.bind(this);
        this._publishPost = this._publishPost.bind(this);
        this._nextStatus  = this._nextStatus.bind(this);
        this._handleContentChange = this._handleContentChange.bind(this);

        this._onPublishResult  = this._onPublishResult.bind(this);
        this._updateAuthorTags = this._updateAuthorTags.bind(this);

        this._onSend     = this._onSend.bind(this);
        this._onComplete = this._onComplete.bind(this);
        this._onSuccess  = this._onSuccess.bind(this);
        this._onError    = this._onError.bind(this);
        this._onBlurTag  = this._onBlurTag.bind(this);
        this._onTagOptSelected = this._onTagOptSelected.bind(this);
    }

    componentWillMount() {
        this.setState({
            autoTags: AuthorStore.getTagsByAuthorUuid(null)
        });
    }

    componentDidMount() {
        this.unsub = ArticleStore.listen(this._onPublishResult);
        this.unsubAuthor = AuthorStore.listen(this._updateAuthorTags);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsubAuthor();
            this.unsub = null;
            this.unsubAuthor = null;
        }
    }

    _onPublishResult(data, post, status) {
        if (data.errorResp !== null) {
            this.setState(this._nextStatus("Failed"));
        } else {
            let state = null;
            if (this.state.saveTxt === "Saving...") {
                state = this._nextStatus("Saved");
            } else {
                state = this._nextStatus("Published");
            }
            if (data.myPostResult) {
                state.articleUuid = data.myPostResult.articleUuid;
            }
            this.setState(state);
            if (this.state.content !== '') {
                setTimeout(function() {
                    this._resetData();
                }.bind(this), 1000);
                this.setState(InitState.state);
            }
        }
    }

    _updateAuthorTags() {
        this.setState({
            autoTags: AuthorStore.getTagsByAuthorUuid(null)
        });
    }

    _handleContentChange(e) {
        let state = this._nextStatus("Draft");
        state.content = e.value;
        this.setState(state);
    }

    _onSend(files, xhr, form) {
        form.append('name', files.name);
        form.append('authorUuid', UserStore.getSelf().userUuid);
        form.append('articleUuid', this.state.articleUuid);
    }

    _onComplete(file, a) {
        console.log(file.xhr);
    }

    _onSuccess(files) {
    }

    _onError(file) {
        console.log("Error upload");
        console.log(file.xhr);
    }

    /**
     * Select tag for this article post.
     */
    _onBlurTag(val) {
        this.setState({
            tagName: val.target.value
        });
    }

    _onTagOptSelected(val) {
        this.setState({
            tagName: val
        });
    }

    _resetData() {
        if (this.refs != null) {
            if (this.refs.topic != null) {
                this.refs.topic.value = InitState.topic;
            }
        }
        if (this.dropzone != null) {
            this.dropzone.removeAllFiles();
        }
    }

    /**
     * Get data to submit to the server to change tag.
     */
    _getData() {
        return {
            topic      : this.refs.topic.value,
            tags       : this.state.tagName,
            content    : this.state.content,
            authorUuid : UserStore.getSelf().userUuid,
            articleUuid: this.state.articleUuid
        }
    }

    _savePost(e) {
        e.preventDefault();
        this.setState(this._nextStatus("Saving"));
        Actions.saveUserPost(this._getData());
    }

    _publishPost(e) {
        e.preventDefault();
        this.setState(this._nextStatus("Publishing"));
        Actions.publishUserPost(this._getData());
    }

    _nextStatus(event) {
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
    }

    render() {
        const djsConfig = GenericForm.getDjsConfig();
        const componentConfig = {
            iconFiletypes   : ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl         : '/user/upload-img'
        };
        const eventHandlers = {
            sending : this._onSend,
            complete: this._onComplete,
            success : this._onSuccess,
            error   : this._error,
            init    : function(dz) { this.dropzone = dz }.bind(this)
        };
        let form = (
            <form encType="multipart/form-data" acceptCharset="utf-8" className="form-horizontal">
                <div className="inbox-info-bar no-padding">
                    <div className="row">
                        <div className="form-group">
                            <label className="control-label col-md-1"><strong>Topic</strong></label>
                            <div className="col-md-10">
                                <input ref="topic" className="form-control" placeholder={InitState.topic} type="text"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inbox-info-bar no-padding">
                    <div className="row">
                        <div className="form-group">
                            <label className="control-label col-md-1"><strong>Tags</strong></label>
                            <div className="col-md-10">
                                <TA.Typeahead options={this.state.autoTags} maxVisible={4}
                                    placeholder={InitState.tags}
                                    customClasses={{input: "form-control"}}
                                    onBlur={this._onBlurTag} onOptionSelected={this._onTagOptSelected}/>
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
                    <Editor id="main-post" content={this.state.content} onChange={this._handleContentChange}/>
                </div>
        
                <div className="inbox-compose-footer">
                    <button onClick={this._savePost} disabled={this.state.saveDis}
                        className={this.state.saveBtn + " margin-top-10 pull-right"}
                        type="button">{this.state.saveTxt}</button>

                    <button onClick={this._publishPost} disabled={this.state.publishDis}
                        className={this.state.publishBtn + " margin-top-10 pull-right"}
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
}

export default EditorPost
