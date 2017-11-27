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
import InputStore          from 'vntd-shared/stores/NestableStore.jsx';
import AuthorStore         from 'vntd-root/stores/AuthorStore.jsx';
import Lang                from 'vntd-root/stores/LanguageStore.jsx';
import Actions             from 'vntd-root/actions/Actions.jsx';
import Mesg                from 'vntd-root/components/Mesg.jsx';
import Questionare         from 'vntd-root/pages/user/Questionare.jsx';
import { ColFmtMap }       from 'vntd-root/config/constants.js';
import { GenericAds }      from 'vntd-root/pages/ads/PostAds.jsx';
import { SeqContainer }    from 'vntd-shared/utils/WebUtils.jsx';
import { SelectForms }     from 'vntd-shared/forms/commons/SelectForms.jsx';

import { FormData, ProcessForm }      from 'vntd-shared/forms/commons/ProcessForm.jsx';

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

        for (let count = 1; count <= this.choiceCount; count++) {
            let correct = 'correct' + count, choice = 'choice' + count;

            delete errFlags[correct];
            delete errFlags[choice];

            if (data[correct] === true) {
                checked++;
                if (data[choice] === '') {
                    error++;
                    errFlags[choice] = true;
                    console.log("mark error " + correct + ": " + data[correct]);
                } else {
                    answer++;
                }
            } else {
                if (data[choice] !== '') {
                    answer++;
                }
            }
        }
        console.log("--------------------");
        console.log(errFlags);
        console.log(data);
        console.log("checked : " + checked + ", answer " + answer + " error " + error);
        if (checked > 0 && answer > 0) {
            if (error == 0) {
                errFlags.errText = null;
            } else {
                errFlags.errText = this.needText;
                console.log("set error text " + error);
            }
        } else {
            console.log("Get here?? ");
            for (let count = 1; count <= this.choiceCount; count++) {
                errFlags['correct' + count] = true;
            }
            errFlags.errText = this.needMark;
        }
        console.log(errFlags);
        return data;
    }

    submitNotif(store, result, id, status) {
        console.log("--- mutl choice notif ----");
        console.log(store);
        console.log(result);
        console.log(id);
        console.log(status);
        console.log("---- end ----");
        this.clearData();
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
            field    : 'asnValidate',
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
        errFlags.errText = null;
        return data;
    }

    submitNotif(store, result, status, resp) {
        this.clearData();
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
        let rec = InputStore.getItemIndex(_QuestSuffix),
            pos = rec.getItemCount().toString();

        // Save data to the main selection list.
        //
        rec.push({
            label: pos,
            value: pos,
            data : data,
            component: <Questionare data={data} id={_QuestSuffix} key={pos}/>
        });
        // Add modal header to selection link for next question input.
        //
        if (data.modalHdr != null) {
            rec.pushData(data.modalHdr, data.modalContent);
        }
        InputStore.triggerStore(_QuestSuffix, rec);
    }

    // @Override
    //
    submitNotif(store, result, status, resp) {
        super.submitNotif(store, result, status, resp);
        this.answer.submitNotif(store, result, status, resp);
    }

    // @Override
    //
    validateInput(data, errFlags) {
        _.forOwn(errFlags, function(val, key) {
            delete errFlags[key];
        });
        return this.answer.validateInput(data, errFlags);
    }
}

export class PostQuestionare extends InputBase
{
    constructor(props) {
        super(props, _QuestSuffix);
        InputStore.storeItemIndex(this.id, new SeqContainer(), false);

        this.data = new QuestForm(props, _QuestSuffix);
        this.args = {
            id : this.id,
            top: {
                label: 'Enter your questionaire',
                value: 'question',
                component: <ProcessForm form={this.data} store={InputStore}/>
            }
        };
        this.title = 'Post Questionare';
        this.state = {
            itemCount: 0
        };
        this._updateState = this._updateState.bind(this);
    }

    _updateState(item, id, code) {
        if (id !== this.id) {
            return;
        }
        let items = InputStore.getItemIndex(this.id);
        this.setState({
            itemCount: items.getItemCount()
        });
        // Modify input forms to reflect new states.
        //
        this.data.modifyField('article', 'disabled', true);
        this.data.modifyField('modalSelect', 'disabled', false);
        this.data.modifyField('modalSelect', 'selectOpt', items.getSelectOpt(true));

        console.log("update .... post state..");
        console.log(this.data);
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
