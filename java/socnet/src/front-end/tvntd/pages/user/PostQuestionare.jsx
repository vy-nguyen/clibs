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
import AuthorStore         from 'vntd-root/stores/AuthorStore.jsx';
import Actions             from 'vntd-root/actions/Actions.jsx';
import Mesg                from 'vntd-root/components/Mesg.jsx';
import { GenericAds }      from 'vntd-root/pages/ads/PostAds.jsx';
import { FormData, ProcessForm } from 'vntd-shared/forms/commons/ProcessForm.jsx';

class ChoiceForm extends FormData
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
                twoCols : true,
                inline  : true,
                leftFmt : 'col-xs-2 col-sm-2 col-md-2 col-lg-2',
                rightFmt: 'col-xs-10 col-sm-10 col-md-10 col-lg-10',
                entries : choices
            } ]
        };
    }

    validateInput(data, errFlags) {
        errFlags.errText = null;
        return data;
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
}

class SelectAnswer extends React.Component
{
    constructor(props) {
        super(props);
        this._onBlur     = this._onBlur.bind(this);
        this._selInput   = this._selInput.bind(this);
        this._selChoices = this._selChoices.bind(this);

        this.selection = {
            selOpt: [ {
                label: 'Multiple choices',
                value: 'choices',
                selFn: this._selChoices
            }, {
                label: 'Input box',
                value: 'input',
                selFn: this._selInput
            } ]
        };
        this.initForms();
    }

    initForms() {
        this.choice = new ChoiceForm(null, "ch");
        this.input  = new InputForm(null, "inp");
    }

    _onBlur(context) {
        let data, errFlags = {};

        data = context.getAndValidateForm(errFlags);
        console.log("-- on blue....");
        console.log(data);
    }

    _selChoices() {
        return <ProcessForm form={this.choice} store={UserStore} onBlur={this._onBlur}/>;
    }

    _selInput() {
        return <ProcessForm form={this.input} store={UserStore} onBlur={this._onBlur}/>;
    }

    render() {
        return <SelectComp id="sel-answer" selectOpt={this.selection}/>;
    }
}

class QuestForm extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        this._submitForm = this._submitForm.bind(this);

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
            component: <SelectAnswer inpName="quest-ans"/>
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
    validateInput(data) {
        console.log("validate data.........");
        console.log(data);
    }
}

export class PostQuestionare extends GenericAds
{
    constructor(props) {
        super(props);
        this.data = new QuestForm(props, "");
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
