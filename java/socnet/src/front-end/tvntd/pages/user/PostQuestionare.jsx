/*
 * Written by Vy Nguyen (2017)
 */
'use strict';

import _                   from 'lodash';
import React               from 'react-mod';
import PropTypes           from 'prop-types';

import SelectComp          from 'vntd-shared/component/SelectComp.jsx';
import StateButton         from 'vntd-shared/utils/StateButton.jsx';
import JarvisWidget        from 'vntd-shared/widgets/JarvisWidget.jsx';
import UserStore           from 'vntd-shared/stores/UserStore.jsx';
import InputStore          from 'vntd-shared/stores/NestableStore.jsx';
import AuthorStore         from 'vntd-root/stores/AuthorStore.jsx';
import Actions             from 'vntd-root/actions/Actions.jsx';
import Mesg                from 'vntd-root/components/Mesg.jsx';
import { GenericAds }      from 'vntd-root/pages/ads/PostAds.jsx';

import { FormData, ProcessForm }      from 'vntd-shared/forms/commons/ProcessForm.jsx';
import { SelectSubForm, SelectForms } from 'vntd-shared/forms/commons/SelectForms.jsx';

const _QuestSuffix = "-qu";

class ChoiceForm extends SelectSubForm
{
    constructor(props, suffix) {
        super(props, suffix);
        this.initForm();
    }

    initForm() {
        let choices = [ {
            field   : 'correct1',
            labelTxt: 'Correct Choice',
            checkedBox: true
        }, {
            field   : 'choice1',
            editor  : true,
            menu    : 'short',
            labelTxt: 'Choice 1'
        }, {
            field   : 'correct2',
            labelTxt: 'Correct Choice',
            checkedBox: true
        }, {
            field   : 'choice2',
            editor  : true,
            menu    : 'short',
            labelTxt: 'Choice 2'
        } ];
        this.forms = {
            formId     : 'answer-choice',
            formEntries: [ {
                legend  : 'Provide answer in multiple choice form',
                inline  : true,
                entries : choices
            } ]
        };
    }
}

class InputForm extends SelectSubForm
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
}

class QuestForm extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        this._submitForm = this._submitForm.bind(this);
        this.selection = {
            selOpt: [ {
                form : ChoiceForm,
                label: 'Multiple choices',
                value: 'choices',
                store: UserStore
            }, {
                form : InputForm,
                label: 'Input box',
                value: 'input',
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
            labelTxt : 'Link Help Id',
            select   : true,
            selectOpt: [ {
                "value": 'abe',
                "label": 'ds sfsfs ss'
            } ]
        }, {
            field    : 'modalId',
            labelTxt : 'New Help Id',
            inpHolder: 'New ID for pop up help',
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
            formId   : 'bus-ads',
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
        console.log("------ submit button ---");
        console.log(data);
    }

    // @Override
    //
    validateInput(data, errFlags) {
        console.log("validate data.........");
        console.log(data);
        console.log(this);
        return this.answer.validateInput(data, errFlags);
    }
}

export class PostQuestionare extends GenericAds
{
    constructor(props) {
        super(props);
        this.data = new QuestForm(props, _QuestSuffix);
    }

    // @Override
    //
    _renderForm() {
        return (
            <ProcessForm form={this.data} store={UserStore} value={this.props.ads}/>
        );
    }
}

export default PostQuestionare;
