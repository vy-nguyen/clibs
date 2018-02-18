/*
 * Written by Vy Nguyen (2017)
 */
'use strict';

import _                   from 'lodash';
import React               from 'react-mod';
import PropTypes           from 'prop-types';

import InputBase           from 'vntd-shared/layout/InputBase.jsx';
import SelectChoices       from 'vntd-shared/component/SelectChoices.jsx';
import StateButton         from 'vntd-shared/utils/StateButton.jsx';
import UserStore           from 'vntd-shared/stores/UserStore.jsx';
import QuestionStore       from 'vntd-root/stores/QuestionStore.jsx';
import AuthorStore         from 'vntd-root/stores/AuthorStore.jsx';
import Lang                from 'vntd-root/stores/LanguageStore.jsx';
import Actions             from 'vntd-root/actions/Actions.jsx';
import Mesg                from 'vntd-root/components/Mesg.jsx';
import Questionare         from 'vntd-root/pages/user/Questionare.jsx';
import { ArticleStore }    from 'vntd-root/stores/ArticleStore.jsx';
import { ColFmtMap }       from 'vntd-root/config/constants.js';
import { GenericAds }      from 'vntd-root/pages/ads/PostAds.jsx';
import { SeqContainer }    from 'vntd-shared/utils/WebUtils.jsx';
import { SelectForms }     from 'vntd-shared/forms/commons/SelectForms.jsx';
import { FormData, ProcessForm } from 'vntd-shared/forms/commons/ProcessForm.jsx';

const _QuestSuffix = "-qu";

class ChoiceForm extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        this.choiceCount = props != null ? props.choices || 4 : 4;
        this.initForm();
    }

    initForm() {
        let choices = [];

        for (let count = 1; count <= this.choiceCount; count++) {
            choices.push({
                field   : 'correct' + count,
                labelTxt: 'Correct Choice',
                checkedBox: true
            });
            choices.push({
                field   : 'choice' + count,
                editor  : true,
                menu    : 'short',
                labelTxt: 'Choice ' + count
            });
        }
        this.forms = {
            formId     : 'ans-choice-' + this.choiceCount,
            formEntries: [ {
                legend  : 'Provide answer in multiple choice form',
                inline  : true,
                entries : choices
            } ]
        };
        this.needMark = Lang.translate('You must select one or more correct choices');
        this.needText = Lang.translate('You need to have text for the checked answer');
    }

    validateInput(data, errFlags) {
        let error = 0, checked = 0, answer = 0;

        data.type = 'choices';
        for (let count = 1; count <= this.choiceCount; count++) {
            let correct = 'correct' + count, choice = 'choice' + count;

            delete errFlags[correct];
            delete errFlags[choice];

            if (data[correct] === true) {
                checked++;
                if (data[choice] === '') {
                    error++;
                    errFlags[choice] = true;
                } else {
                    answer++;
                }
            } else {
                if (data[choice] !== '') {
                    answer++;
                }
            }
        }
        if (checked > 0 && answer > 0) {
            if (error == 0) {
                errFlags.errText = null;
            } else {
                errFlags.errText = this.needText;
            }
        } else {
            for (let count = 1; count <= this.choiceCount; count++) {
                errFlags['correct' + count] = true;
            }
            errFlags.errText = this.needMark;
        }
        console.log("validate mult choice input");
        console.log(data);
        return data;
    }

    submitNotif(store, result, id, status) {
        this.clearData();
    }

    static toInputForm(data) {
        let out = [], map = {}, index;

        if (data.answer != null && data.answer.type == 'choices') {
            for (let i = 1; i <= 8; i++) {
                index = i - 1;
                map['choice' + i] = {
                    index: index,
                    key  : 'choice'
                };
                map['correct' + i] = {
                    index: index,
                    key  : 'correct'
                };
            }
            _.forOwn(data.answer, function(val, key) {
                let rec = map[key];
                if (rec != null) {
                    if (out[rec.index] == null) {
                        out[rec.index] = {};
                    }
                    out[rec.index][rec.key] = val;
                }
            });
        }
        return out;
    }
}

class InputForm extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        this.initForm();
    }

    initForm() {
        let inpEntries = [ {
            field   : 'ansInput',
            labelTxt: 'Input label'
        }, {
            field   : 'ansHolder',
            labelTxt: 'Input holder'
        }, {
            editor   : true,
            menu     : 'short',
            field    : 'ansValidate',
            labelTxt : 'Answers',
            inpHolder: 'Answer 1 | Answer 2 | ...'
        } ];
        this.forms = {
            formId     : 'answer-input',
            formEntries: [ {
                legend : 'Provide answer in input form',
                entries: inpEntries
            } ]
        };
    }

    validateInput(data, errFlags) {
        let noErr = true;
        data.type = 'fillin';

        if (data.ansValidate == null || data.ansValidate === '') {
            noErr = false;
            errFlags.ansValidate = true;
        }
        if (data.ansInput == null || data.ansInput === '') {
            noErr = false;
            errFlags.ansInput = true;
        }
        if (noErr === true) {
            errFlags.errText = null;
        }
        return data;
    }

    submitNotif(store, result, status, resp) {
        this.clearData();
    }

    static toInputForm(data) {
        let answer = data.answer;
        if (answer != null && answer.type === 'fillin') {
            return {
                ansInput   : answer.ansInput,
                ansHolder  : answer.ansHolder,
                ansValidate: answer.ansValidate
            };
        }
        return null;
    }
}

class QuestForm extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        this._submitForm = this._submitForm.bind(this);
        this.selection = {
            selOpt: [ {
                form : ChoiceForm,
                label: 'Multiple 4 choices',
                value: '4-choice',
                store: UserStore,
                args : {
                    choices: 4
                }
            }, {
                form : ChoiceForm,
                label: 'Multiple 6 choices',
                value: '6-choice',
                store: UserStore,
                args : {
                    choices: 6
                }
            }, {
                form : ChoiceForm,
                label: 'Multiple 8 choices',
                value: '8-choice',
                store: UserStore,
                args : {
                    choices: 8
                }
            }, {
                form : InputForm,
                label: 'Input box',
                value: 'ans-inp',
                store: UserStore
            } ]
        };
        this.answer = new SelectForms('answer', _QuestSuffix, this.selection);
        this.initData();
        return this;
    }

    initData() {
        let tagMgr = AuthorStore.getAuthorTagMgr(UserStore.getSelfUuid()),
        artLink = [ {
            field    : 'article',
            labelTxt : 'Link Article',
            select   : true,
            inpHolder: 'Select linked article',
            selectOpt: tagMgr.getAllArtSelect()
        }, {
            field    : 'content',
            labelTxt : 'Question',
            menu     : 'short',
            editor   : true
        }, {
            field    : 'modalSelect',
            labelTxt : 'Link Help Topic',
            select   : true,
            disabled : true,
            selectOpt: null
        }, {
            field    : 'modalHdr',
            labelTxt : 'Help Header',
        }, {
            field    : 'modalContent',
            labelTxt : 'Help Content',
            menu     : 'short',
            editor   : true
        }, {
            url      : '/public/upload-ad-img',
            field    : 'image',
            dropzone : true,
            labelTxt : 'Drop your image'
        } ],
        answer = [ {
            field    : 'answer',
            labelTxt : 'Select Answer Type',
            component: this.answer.render()
        } ];
        this.forms = {
            formId   : 'question',
            formFmt  : 'product-content product-wrap clearfix',
            submitFn : this._submitForm, // Actions.publicPostAds,
            formEntries: [ {
                legend : 'Question',
                sectFmt: 'product-deatil',
                entries: artLink 
            }, {
                legend : 'Answer',
                sectFmt: 'product-deatil',
                entries: answer 
            } ],
            buttons: [ {
                btnName  : 'bus-ad-submit',
                btnSubmit: true,
                btnCreate: function() {
                    return StateButton.saveButtonFsm("Create", "Submit", "Published");
                }
            } ]
        };
    }

    _submitForm(data) {
        Actions.postQuestForm({
            articleUuid : data.article,
            content     : data.content,
            modalSelect : data.modalSelect,
            modalHdr    : data.modalHdr,
            modalContent: data.modalContent,
            imageRec    : data.imageRec,
            answer      : {
                choices : ChoiceForm.toInputForm(data),
                input   : InputForm.toInputForm(data)
            }
        }, _QuestSuffix);
    }

    // @Override
    //
    submitNotif(store, data, result, status, cb) {
        let rec = QuestionStore.getItem(_QuestSuffix), article,
            pos = rec.getItemCount().toString();

        // Save data to the main selection list.
        //
        article = ArticleStore.getArticleByUuid(result.articleUuid);
        rec.push({
            label: pos,
            value: pos,
            data : data,
            component: (
                <Questionare listStore={QuestionStore} article={article}
                    sourceId={_QuestSuffix} key={_.uniqueId(pos)}/>
            )
        });
        // Add modal header to selection link for next question input.
        //
        if (result.modalHdr != null) {
            rec.pushData(result.modalHdr, result.modalContent);
        }
        super.submitNotif(store, data, result, status, cb);
        this.answer.submitNotif(store, data, result, status, cb);
    }

    // @Override
    //
    validateInput(data, errFlags) {
        _.forOwn(errFlags, function(val, key) {
            delete errFlags[key];
        });
        if (data.article == null || data.article === '') {
            errFlags.article = true;
        }
        if (data.content == null || data.content === '') {
            errFlags.content = true;
        }
        return this.answer.validateInput(data, errFlags);
    }
}

export class PostQuestionare extends InputBase
{
    constructor(props) {
        super(props, _QuestSuffix, [QuestionStore]);

        this.id = _QuestSuffix;
        this._updateState = this._updateState.bind(this);
        QuestionStore.storeItem(this.id, new SeqContainer(), false);

        this.data = new QuestForm(props, _QuestSuffix);
        this.args = {
            id : this.id,
            top: {
                label: 'Enter your questionaire',
                value: 'question',
                component: <ProcessForm form={this.data} store={QuestionStore}/>
            }
        };
        this.title = 'Post Questionare';
        this.state = {
            itemCount: 0
        };
        this._updateState = this._updateState.bind(this);
    }

    _updateState(store, data, item, code, arr, context) {
        if (code !== "post" && context !== _QuestSuffix) {
            console.log("bail out, context " + context);
            return;
        }
        let items = QuestionStore.getItem(this.id);
        this.setState({
            itemCount: items.getItemCount()
        });
        // Modify input forms to reflect new states.
        //
        this.data.modifyField('article', 'disabled', true);
        this.data.modifyField('modalSelect', 'disabled', false);
        this.data.modifyField('modalSelect', 'selectOpt', items.getSelectOpt(true));
    }

    _renderForm() {
        return (
            <div>
                <div className="well">
                    <button className="btn btn-info">
                        {this.state.itemCount} pending questionares
                    </button>
                </div>
                <div className="well">
                    <SelectChoices {...this.args}/>
                </div>
            </div>
        );
    }
}

export default PostQuestionare;
