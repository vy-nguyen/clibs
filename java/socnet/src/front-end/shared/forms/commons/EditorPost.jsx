/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _      from 'lodash';
import React  from 'react-mod';

import ArticleStore     from 'vntd-root/stores/ArticleStore.jsx';
import Actions          from 'vntd-root/actions/Actions.jsx';
import Lang             from 'vntd-root/stores/LanguageStore.jsx';
import AuthorStore      from 'vntd-root/stores/AuthorStore.jsx';
import ArticleTagStore  from 'vntd-root/stores/ArticleTagStore.jsx';
import Mesg             from 'vntd-root/components/Mesg.jsx';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import DataStore        from 'vntd-shared/stores/NestableStore.jsx';
import ErrorStore       from 'vntd-shared/stores/ErrorStore.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import {EditorEntry}    from 'vntd-shared/forms/editors/Editor.jsx';
import JarvisWidget     from 'vntd-shared/widgets/JarvisWidget.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';
import ErrorView        from 'vntd-shared/layout/ErrorView.jsx';
import {
    DropZoneWrap, InputBox
} from 'vntd-shared/forms/commons/GenericForm.jsx';

class EditorPost extends React.Component
{
    constructor(props) {
        super(props);

        this._imgDz = null;
        this._dzSend           = this._dzSend.bind(this);
        this._dzError          = this._dzError.bind(this);
        this._dzSuccess        = this._dzSuccess.bind(this);
        this._savePost         = this._savePost.bind(this);
        this._clearData        = this._clearData.bind(this);
        this._publishPost      = this._publishPost.bind(this);
        this._onBlurInput      = this._onBlurInput.bind(this);
        this._onPublishResult  = this._onPublishResult.bind(this);
        this._updateAuthorTags = this._updateAuthorTags.bind(this);

        StateButtonStore.createButton(this._getId('publish-main'), function() {
            return StateButton.saveButtonFsm("Publish", "Publish Post",
                        "Published", "Publish Failed", "Publishing...");
        });
        StateButtonStore.createButton(this._getId('save-main'), function() {
            return StateButton.saveButtonFsm("Save", "Save Post",
                        "Saved", "Save Failed", "Saving...");
        });
        this.state = this._getInitState();
    }

    componentWillMount() {
        let article = this.props.article, artRank, tag;
        if (article == null) {
            return;
        }
        artRank = article.rank;
        tag = artRank != null ? artRank.tagName : "My Post";

        DataStore.storeItemIndex(this._getId('main-topic'), article.topic);
        DataStore.storeItemIndex(this._getId('main-tags'), tag);
        DataStore.storeItemIndex(this._getId('main-content'), article.content);
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
        StateButtonStore.setButtonState(this._getId('save-main'), "success");
        StateButtonStore.setButtonState(this._getId('publish-main'), "success");
    }

    _getInitState() {
        return {
            errFlags: {},
            autoTags: this._getAutoTags()
        };
    }

    _getAutoTags() {
        return _.merge([],
            AuthorStore.getTagsByAuthorUuid(null),
            ArticleTagStore.getAllPublicTags(false));
    }

    _getId(elm) {
        if (this.props.article == null) {
            return elm;
        }
        return elm + this.props.article.articleUuid;
    }

    _clearData() {
        if (this._imgDz != null) {
            this._imgDz.removeAllFiles();
        }
        DataStore.freeItemIndex(this._getId('main-topic'));
        DataStore.freeItemIndex(this._getId('main-tags'));
        DataStore.freeItemIndex(this._getId('main-content'));
    }

    _onBlurInput() {
        ErrorStore.clearError(this._getId('post-error'));
        StateButtonStore.setButtonState(this._getId('save-main'), "needSave");
        StateButtonStore.setButtonState(this._getId('publish-main'), "needSave");
    }

    _onPublishResult(store, post, status) {
            console.log("got publish result " + status);
            console.log(post);
        if (status === "publish-failed") {
            StateButtonStore.setButtonState(this._getId('save-main'), "failure");
            StateButtonStore.setButtonState(this._getId('publish-main'), "failure");

        } else if (status === "publish") {
            StateButtonStore.setButtonState(this._getId('save-main'), "saved");
            StateButtonStore.setButtonState(this._getId('publish-main'), "saved");

            this._clearData();
            this.setState(this._getInitState());
        }
    }

    _updateAuthorTags() {
        this.setState({
            autoTags: this._getAutoTags
        });
    }

    _onSend(files, xhr, form) {
        form.append('name', files.name);
        form.append('authorUuid', UserStore.getSelf().userUuid);
        form.append('articleUuid', this.state.articleUuid);
    }

    _onComplete(file, a) {
    }

    _onSuccess(files) {
    }

    _onError(file) {
        console.log(file.xhr);
    }

    _dzSend(files, xhr, form) {
        form.append('name', files.name);
        form.append('authorUuid', '');
        form.append('articleUuid', '');
    }

    _dzSuccess(dz, hdr, progress) {
        let img = {
            articleUuid: hdr.articleUuid,
            authorUuid : hdr.authorUuid,
            imgObjIds  : hdr.imgObjId // TODO: save to array
        };
        DataStore.storeItemIndex(this._getId('main-img'), img, false);
    }

    _dzError() {
    }

    _getData() {
        let article = this.props.article,
            imgRec = DataStore.getItemIndex(this._getId('main-img'));

        if (article != null) {
            imgRec = {
                articleUuid: article.articleUuid,
                authorUuid : article.authorUuid
            };
        } else if (imgRec == null) {
            imgRec = {
                articleUuid: 0,
                authorUuid : UserStore.getSelf().userUuid
            };
        }
        return {
            authorUuid : imgRec.authorUuid,
            articleUuid: imgRec.articleUuid,
            tags       : DataStore.getItemIndex(this._getId('main-tags')),
            topic      : DataStore.getItemIndex(this._getId('main-topic')),
            content    : DataStore.getItemIndex(this._getId('main-content'))
        };
    }

    _savePost(e) {
        StateButtonStore.setButtonState(this._getId('save-main'), "saving");
        StateButtonStore.setButtonState(this._getId('publish-main'), "success");
        Actions.saveUserPost(this._getData());
    }

    _publishPost(e) {
        StateButtonStore.setButtonState(this._getId('save-main'), "success");
        StateButtonStore.setButtonState(this._getId('publish-main'), "saving");
        if (this.props.article == null) {
            Actions.publishUserPost(this._getData());
        } else {
            Actions.updateUserPost(this._getData());
        }
    }

    render() {
        let article = this.props.article, errFlags = this.state.errFlags,
            tagId = this._getId('main-tags'),
            topicId = this._getId('main-topic'),
            contentId = this._getId('main-content'),
            inputFmt = 'control-label col-xs-11 col-sm-11 col-md-11 col-lg-11',
            labelFmt = 'control-label col-xs-1 col-sm-1 col-md-1 col-lg-1',
        tagEntry = {
            inpName  : tagId,
            inpDefVal: '',
            inpHolder: DataStore.getItemIndex(tagId),
            taOptions: this.state.autoTags,
            typeAhead: true,
            errorId  : tagId,
            errorFlag: errFlags.tags,
            inputFmt : inputFmt,
            labelFmt : labelFmt,
            labelTxt : 'Category'
        },
        topicEntry = {
            inpName  : topicId,
            inpDefVal: DataStore.getItemIndex(topicId),
            inpHolder: Lang.translate("Article Title"),
            errorId  : topicId,
            errorFlag: errFlags.topic,
            inputFmt : inputFmt,
            labelFmt : labelFmt,
            labelTxt : 'Topic'
        },
        editorEntry = {
            id       : contentId,
            editor   : true,
            inpDefVal: DataStore.getItemIndex(contentId),
            menu     : "full",
            errorId  : contentId,
            errorFlag: errFlags,
            uploadUrl: '/user/upload-img'
        },
        imgDzInfo = {
            dropzone : true,
            url      : '/user/upload-img',
            errorId  : 'post-img',
            errorFlag: null,
            inputFmt : inputFmt,
            labelFmt : labelFmt,
            labelTxt : 'Drop Images',
            handlers : {
                sending: this._dzSend,
                success: this._dzSuccess,
                error  : this._dzError,
                init   : dz => {
                    this._imgDz = dz;
                }
            }
        },
        buttons = (
            <div className="btn-group pull-right" role="group">
                <StateButton btnId={this._getId('save-main')} onClick={this._savePost}/>
                <StateButton btnId={this._getId('publish-main')}
                    onClick={this._publishPost}/>
            </div>
        ),
            /*
                <div className="row">
                    <div className="form-group">
                        <div className={labelFmt} for="textInput">
                            <Mesg text="Drop Images"/>
                        </div>
                        <div className={inputFmt}>
                            <DropZoneWrap entry={imgDzInfo} eventHandlers={imgDz}/>
                        </div>
                    </div>
                </div>
             */
        form = (
            <div>
                <InputBox entry={tagEntry} onBlur={this._onBlurInput}/>
                <InputBox entry={topicEntry} onBlur={this._onBlurInput}/>
                <InputBox entry={imgDzInfo}/>
                <div className="inbox-message no-padding">
                    <EditorEntry entry={editorEntry} onChange={this._onBlurInput}/>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12"> 
                        <ErrorView errorId={this._getId('post-error')}/>
                        {buttons}
                    </div>
                </div>
            </div>
        );
        return (
            <div className="row">
                <article className="col-sm-12 col-md-12 col-lg-12">
                    <JarvisWidget id="my-post" color="purple">
                        <header>
                            <span className="widget-icon"> <i className="fa fa-pencil"/>
                            </span>
                            <h2><Mesg text='Publish Post'/></h2>
                        </header>
                        <div className="widget-body">
                            {form}
                        </div>
                    </JarvisWidget>
                </article>
            </div>
        );
    }
}

export default EditorPost;
