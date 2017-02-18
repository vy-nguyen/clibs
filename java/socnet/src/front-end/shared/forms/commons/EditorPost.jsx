/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _      from 'lodash';
import React  from 'react-mod';
import TA     from 'react-typeahead';

import {OverlayTrigger, Tooltip} from 'react-bootstrap';

import ArticleStore    from 'vntd-root/stores/ArticleStore.jsx';
import Actions         from 'vntd-root/actions/Actions.jsx';
import Lang            from 'vntd-root/stores/LanguageStore.jsx';
import AuthorStore     from 'vntd-root/stores/AuthorStore.jsx';
import ArticleTagStore from 'vntd-root/stores/ArticleTagStore.jsx';
import Mesg            from 'vntd-root/components/Mesg.jsx';
import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import DataStore       from 'vntd-shared/stores/NestableStore.jsx';
import {EditorEntry}   from 'vntd-shared/forms/editors/Editor.jsx';
import GenericForm     from 'vntd-shared/forms/commons/GenericForm.jsx';
import JarvisWidget    from 'vntd-shared/widgets/JarvisWidget.jsx';
import {choose}        from 'vntd-shared/utils/Enum.jsx';

const InitState = {
    topic: Lang.translate('Topic'),
    tags : Lang.translate('My Post'),
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
        publishTxt : Lang.translate('Publish'),
        publishBtn : 'btn btn-info disabled'
    }
};

class EditorPost extends React.Component
{
    constructor(props) {
        super(props);

        this.state = InitState.state;
        this.state.autoTags = AuthorStore.getTagsByAuthorUuid(null);

        this._getId       = this._getId.bind(this);
        this._resetData   = this._resetData.bind(this);
        this._getData     = this._getData.bind(this);
        this._savePost    = this._savePost.bind(this);
        this._publishPost = this._publishPost.bind(this);
        this._nextStatus  = this._nextStatus.bind(this);
        this._handleContentChange = this._handleContentChange.bind(this);

        this._updateAutoTags   = this._updateAutoTags.bind(this);
        this._onPublishResult  = this._onPublishResult.bind(this);
        this._updateAuthorTags = this._updateAuthorTags.bind(this);

        this._onSend     = this._onSend.bind(this);
        this._onComplete = this._onComplete.bind(this);
        this._onSuccess  = this._onSuccess.bind(this);
        this._onError    = this._onError.bind(this);
        this._onBlurTag  = this._onBlurTag.bind(this);
        this._onTagOptSelected = this._onTagOptSelected.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this._updateAutoTags());
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

    _updateAutoTags() {
        return {
            autoTags: _.merge([], AuthorStore.getTagsByAuthorUuid(null), ArticleTagStore.getAllPublicTags(false))
        }
    }

    _getId() {
        if (this.props.article == null) {
            return "main-post";
        }
        return "main-post-" + this.props.article.articleUuid;
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

            if (_.isEmpty(DataStore.getItemIndex(this.props.id))) {
                DataStore.clearItemIndex(this.props.id);
                setTimeout(function() {
                    this._resetData();
                }.bind(this), 1000);
                this.setState(InitState.state);
            }
        }
    }

    _updateAuthorTags() {
        this.setState(this._updateAutoTags());
    }

    _handleContentChange(e) {
        let state = this._nextStatus("Draft");
        this.setState(state);
    }

    _onSend(files, xhr, form) {
        form.append('name', files.name);
        form.append('authorUuid', UserStore.getSelf().userUuid);
        form.append('articleUuid', this.state.articleUuid);
    }

    _onComplete(file, a) {
        // console.log(file.xhr);
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
    }

    /**
     * Get data to submit to the server to change tag.
     */
    _getData() {
        let article = this.props.article, authorUuid, articleUuid, artRank, tags, topic;

        if (article != null) {
            artRank = AuthorStore.getArticleRank(article.authorUuid, article.articleUuid);
            if (artRank != null) {
                tags = (this.state.tagName == null) ? artRank.tagName : this.state.tagName;
            } else {
                tags = this.state.tagName;
            }
            if (this.refs.topic != null) {
                topic = this.refs.topic.value;
                if (_.isEmpty(topic)) {
                    topic = article.topic;
                }
            } else {
                topic = article.topic;
            }
            authorUuid  = article.authorUuid;
            articleUuid = article.articleUuid;
        } else {
            tags        = this.state.tagName;
            topic       = this.refs.topic.value;
            authorUuid  = UserStore.getSelf().userUuid;
            articleUuid = this.state.articleUuid;
        }
        return {
            topic      : topic,
            tags       : tags,
            content    : DataStore.getItemIndex(this._getId()),
            authorUuid : authorUuid,
            articleUuid: articleUuid
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

        if (this.props.article == null) {
            Actions.publishUserPost(this._getData());
        } else {
            Actions.updateUserPost(this._getData());
        }
    }

    _nextStatus(event) {
        if (event === "Draft") {
            return {
                saveDis: false,
                saveTxt: Lang.translate('Save'),
                saveBtn: 'btn btn-danger',
                publishDis: false,
                publishTxt: Lang.translate('Publish'),
                publishBtn: 'btn btn-primary'
            }
        }
        if (event === "Saving") {
            return {
                saveDis: true,
                saveTxt: Lang.translate('Saving...'),
                saveBtn: 'btn btn-info disabled',
                publishDis: true,
                publishTxt: Lang.translate('Publish'),
                publishBtn: 'btn btn-primary disabled'
            }
        }
        if (event === "Saved") {
            return {
                saveDis: true,
                saveTxt: Lang.translate('Saved'),
                saveBtn: 'btn btn-info disabled',
                publishDis: false,
                publishTxt: Lang.translate('Publish'),
                publishBtn: 'btn btn-primary'
            }
        }
        if (event === "Failed") {
            return {
                saveDis: false,
                saveTxt: Lang.translate('Retry Saving'),
                saveBtn: 'btn btn-danger',
                publishDis: true,
                publishTxt: Lang.translate('Publish Failed'),
                publishBtn: 'btn btn-danger disabled'
            }
        }
        if (event === "Publishing") {
            return {
                saveDis: true,
                saveTxt: Lang.translate('Save'),
                saveBtn: 'btn btn-primary disabled',
                publishDis: true,
                publishTxt: Lang.translate('Publishing...'),
                publishBtn: 'btn btn-danger disabled'
            }
        }
        if (event === "Published") {
            return {
                saveDis: true,
                saveTxt: Lang.translate('Save'),
                saveBtn: 'btn btn-primary disabled',
                publishDis: true,
                publishTxt: Lang.translate('Published'),
                publishBtn: 'btn btn-primary disabled'
            }
        }
        return {
            saveDis: false,
            saveTxt: Lang.translate('Save'),
            saveBtn: 'btn btn-primary',
            publishDis: false,
            publishTxt: Lang.translate('Publish'),
            publishBtn: 'btn btn-primary'
        }
    }

    render() {
        let article = this.props.article, topic, content, artRank, tagName;
        if (article != null) {
            topic   = article.topic;
            content = article.content;
            artRank = AuthorStore.getArticleRank(article.authorUuid, article.articleUuid);
            tagName = choose(artRank, 'tagName', InitState.tags);
        } else {
            topic   = InitState.topic;
            tagName = InitState.tags;
            content = '';
        }
        const editorEntry = {
            id       : this._getId(),
            editor   : true,
            inpHolder: content,
            menu     : "full",
            errorId  : this._getId() + "error",
            errorFlag: this.state.errFlags,
            uploadUrl: '/user/upload-img'
        };
        let form = (
            <form encType="multipart/form-data" acceptCharset="utf-8" className="form-horizontal">
                <div className="inbox-info-bar no-padding">
                    <div className="row">
                        <div className="form-group">
                            <label className="control-label col-md-1"><strong><Mesg text='Topic'/></strong></label>
                            <div className="col-md-10">
                                <input ref="topic" className="form-control" placeholder={topic} type="text"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inbox-info-bar no-padding">
                    <div className="row">
                        <div className="form-group">
                            <label className="control-label col-md-1"><strong><Mesg text='Tags'/></strong></label>
                            <div className="col-md-10">
                                <TA.Typeahead options={this.state.autoTags} maxVisible={4}
                                    placeholder={tagName}
                                    customClasses={{input: "form-control"}}
                                    onBlur={this._onBlurTag} onOptionSelected={this._onTagOptSelected}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inbox-message no-padding">
                    <EditorEntry entry={editorEntry} onChange={this._handleContentChange}/>
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
                            <h2><Mesg text='Publish Post'/></h2>
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
