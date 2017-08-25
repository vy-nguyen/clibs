/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _      from 'lodash';
import React  from 'react-mod';

import ArticleStore     from 'vntd-root/stores/ArticleStore.jsx';
import Lang             from 'vntd-root/stores/LanguageStore.jsx';
import Mesg             from 'vntd-root/components/Mesg.jsx';
import Actions          from 'vntd-root/actions/Actions.jsx';
import AuthorStore      from 'vntd-root/stores/AuthorStore.jsx';
import ArticleTagStore  from 'vntd-root/stores/ArticleTagStore.jsx';
import ErrorStore       from 'vntd-shared/stores/ErrorStore.jsx';
import JarvisWidget     from 'vntd-shared/widgets/JarvisWidget.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import { FormData, ProcessForm } from 'vntd-shared/forms/commons/ProcessForm.jsx';

class PostForm extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        this.editorEntry = {
            field    : 'content',
            inpName  : 'art-content-',
            editor   : true,
            emptyOk  : true,
            menu     : 'full',
            uploadUrl: '/user/upload-img',
            inputFmt : 'inbox-message no-padding'
        };
        this.initData();
        return this;
    }

    initData() {
        let inputFmt = 'control-label col-xs-11 col-sm-11 col-md-11 col-lg-11',
            labelFmt = 'control-label col-xs-1 col-sm-1 col-md-1 col-lg-1',
        entries = [ {
            dropzone : true,
            url      : '/user/upload-img',
            field    : 'image',
            inpName  : 'art-img-',
            emptyOk  : true,
            inputFmt : inputFmt,
            labelFmt : labelFmt,
            labelTxt : 'Drop Images'
        }, {
            field    : 'tags',
            inpName  : 'art-tag-',
            inpHolder: 'My Post',
            taOptions: this._getAutoTags(),
            typeAhead: true,
            emptyOk  : true,
            inputFmt : inputFmt,
            labelFmt : labelFmt,
            labelTxt : 'Category'
        }, {
            field    : 'topic',
            inpName  : 'art-topic-',
            inpHolder: 'Article Title',
            emptyOk  : true,
            inputFmt : inputFmt,
            labelFmt : labelFmt,
            labelTxt : 'Title'
        }, {
            field    : 'video',
            inpName  : 'art-video-',
            inpHolder: 'Copy published Google link',
            emptyOk  : true,
            inputFmt : inputFmt,
            labelFmt : labelFmt,
            labelTxt : 'Youtube Link'
        } ];
        entries.push(this.editorEntry);

        this.forms = {
            formId   : 'post-article',
            formFmt  : 'product-content product-wrap clearfix',
            submitFn : this._submitPost.bind(this),
            formEntries: [ {
                entries: entries
            } ],
            buttons: [ {
                btnName  : 'post-save',
                btnFmt   : 'btn btn-primary',
                btnCreate: function() {
                    return StateButton.saveButtonFsm("Saved", "Save Post",
                        "Saved", "Save Failed", "Saving...");
                }
            }, {
                btnName  : 'post-publish',
                btnFmt   : 'btn btn-primary',
                btnSubmit: true,
                btnCreate: function() {
                    return StateButton.saveButtonFsm("Publish", "Publish Post",
                        "Published", "Publish Failed", "Publishing...");
                }
            } ]
        };
        this.saveBtn = this.forms.buttons[0];
    }

    _getAutoTags() {
        return _.merge([],
            AuthorStore.getTagsByAuthorUuid(null),
            ArticleTagStore.getAllPublicTags(false));
    }

    _submitPost(data) {
        if (this.props.article == null) {
            Actions.publishUserPost(data);
        } else {
            data.articleUuid = this.props.article.articleUuid;
            Actions.updateUserPost(data);
        }
    }

    validateInput(data, errFlags) {
        if (data.articleUuid === "0") {
            if (_.isEmpty(data.content)) {
                errFlags.content  = true;
                errFlags.errText  = Lang.translate("Missing content");
                errFlags.helpText =
                    Lang.translate("You need to upload picture or write a post...");
                return null;
            }
        }
        if (_.isEmpty(data.tags)) {
            data.tags = "My Post";
        }
        if (_.isEmpty(data.topic)) {
            data.topic = (new Date()).toString();
        }
        return {
            authorUuid : data.authorUuid,
            articleUuid: data.articleUuid,
            videoUrl   : _.isEmpty(data.video) ? null : data.video,
            tags       : data.tags,
            topic      : data.topic,
            content    : data.content
        };
    }

    submitNotif(store, data, result, status, resp) {
        let formId = this.getFormId();

        if (status === "publish-failed") {
            ErrorStore.reportErrMesg(formId, result.error, result.message);
            this.submitFailure(result, status);
            return;

        }
        /* eslint-disable */
        if (tinymce != null) {
            let mce = tinymce.EditorManager.get(this.editorEntry.inpName);
            if (mce != null) {
                mce.setContent('');
            }
        }
        /* eslint-enable */
        super.submitNotif(store, data, result, status, resp);
    }

    onBlur(entry) {
        let btnName = this.saveBtn.btnName;

        super.onBlur(entry);
        StateButtonStore.setButtonStateObj(this.buttons[btnName], "needSave");
    }

    onClick(btn, btnState) {
        let data, errFlags = {};

        super.onClick(btn, btnState);
        if (this.isSubmitting(btn.btnName) === true) {
            data = this.getAndValidateForm(errFlags);
            if (data != null) {
                Actions.saveUserPost(data);
            }
        }
    }
}

class EditorPost extends React.Component
{
    constructor(props) {
        super(props);

        let suffix = props.article != null ? props.article.articleUuid : "post";
        this.data = new PostForm(props, suffix);
        console.log("constructor " + suffix);
    }

    _getDefValue(props) {
        let art = props.article;

        if (art == null) {
            return null;
        }
        return {
            tags   : art.rank != null ? art.rank.tagName : null,
            topic  : art.topic,
            content: art.content
        };
    }

    render() {
        let val = this._getDefValue(this.props);

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
                            <ProcessForm form={this.data} store={ArticleStore}
                                brief={true} value={val}/>
                        </div>
                    </JarvisWidget>
                </article>
            </div>
        );
    }
}

export default EditorPost;
