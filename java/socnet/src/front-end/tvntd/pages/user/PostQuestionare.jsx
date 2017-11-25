/*
 * Written by Vy Nguyen (2017)
 */
'use strict';

import _                   from 'lodash';
import React               from 'react-mod';
import PropTypes           from 'prop-types';

import InputBase           from 'vntd-shared/layout/InputBase.jsx';
import SelectComp          from 'vntd-shared/component/SelectComp.jsx';
import SelectChoices       from 'vntd-shared/component/SelectChoices.jsx';
import StateButton         from 'vntd-shared/utils/StateButton.jsx';
import JarvisWidget        from 'vntd-shared/widgets/JarvisWidget.jsx';
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
        }, {
            field   : 'correct2',
            labelTxt: 'Correct Choice',
            checkedBox: true
        }, {
            field   : 'choice3',
            editor  : true,
            menu    : 'short',
            labelTxt: 'Choice 3'
        }, {
            field   : 'correct4',
            labelTxt: 'Correct Choice',
            checkedBox: true
        }, {
            field   : 'choice4',
            editor  : true,
            menu    : 'short',
            labelTxt: 'Choice 4'
        } ];
        this.forms = {
            formId     : 'answer-choice',
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
        if (data.correct1 === true || data.correct2 === true ||
            data.correct3 === true || data.correct4 === true) {
            errFlags.errText = this.needText;
            if (data.correct1 === true && data.choice1 === '') {
                errFlags.choice1 = true;

            } else if (data.correct2 === true && data.choice2 === '') {
                errFlags.choice2 = true;

            } else if (data.correct3 === true && data.choice3 === '') {
                errFlags.choice3 = true;

            } else if (data.correct4 === true && data.choice4 === '') {
                errFlags.choice4 = true;

            } else {
                errFlags.errText = null;
            }
        } else {
            errFlags.correct1 = true;
            errFlags.correct2 = true;
            errFlags.correct3 = true;
            errFlags.correct4 = true;
            errFlags.helpText = this.needMark;
        }
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
        console.log("choice form get & val");
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
        let rec = InputStore.getItemIndex(_QuestSuffix), pos = rec.getItemCount();

        rec.push({
            label: pos,
            value: pos,
            data : data,
            component: <Questionare data={data} id={_QuestSuffix} key={pos}/>
        });
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
        return this.answer.validateInput(data, errFlags);
    }
}

export class PostQuestionare extends React.Component
{
    constructor(props) {
        super(props);
        this.id = _QuestSuffix;
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
        this.state = {
            itemCount: 0
        };
        this._updateState = this._updateState.bind(this);
    }

    componentDidMount() {
        this.unsub = InputStore.listen(this._updateState);
    }

    componentWillUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState() {
        let items = InputStore.getItemIndex(this.id);
        this.setState({
            itemCount: items.getItemCount()
        });
        console.log("update .... post state..");
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

    render() {
        console.log("render post questionare...");
        return (
            <JarvisWidget id={this.id} color="purple">
                <header>
                    <span className="widget-icon"><i className="fa fa-pencil"/></span>
                    <h2>Post Questionare</h2>
                </header>
                <div className="widget-body">
                    {this._renderForm()}
                </div>
            </JarvisWidget>
        );
    }
}

export default PostQuestionare;
