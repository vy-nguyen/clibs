/**
 * Written by Vy Nguyen (2017)
 */
'use strict';

import _                 from 'lodash';
import React             from 'react-mod';
import PropTypes         from 'prop-types';

import Wizard            from 'vntd-shared/layout/Wizard.jsx';
import StateButton       from 'vntd-shared/utils/StateButton.jsx';
import InputBase         from 'vntd-shared/layout/InputBase.jsx';
import QuestionStore     from 'vntd-root/stores/QuestionStore.jsx';
import RefLinks          from 'vntd-root/components/RefLinks.jsx';
import { VntdGlob }      from 'vntd-root/config/constants.js';

import { FormData, ProcessForm } from 'vntd-shared/forms/commons/ProcessForm.jsx';

class QuizChoiceForm extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        this._submitForm = this._submitForm.bind(this);

        this._initForm(props);
    }

    _initForm(props) {
        let num, correct = 0, label = 'A', entries = [], { choices, questUuid } = props;

        this.entries   = entries;
        this.questUuid = questUuid;

        _.forEach(choices, function(ans) {
            ans.ansKey = 'choice-' + questUuid + '-' + label;
            entries.push({
                answer    : ans,
                ansType   : ans.ansType,
                field     : ans.ansKey,
                html      : true,
                labelTxt  : '   ' + label + ' / ' + ans.ansChoice,
                checkedBox: true,
                inpDefVal : ans.userSelect
            });
            if (ans.correctChoice === true) {
                correct++;
            }
            num = label.charCodeAt(0) + 1;
            label = String.fromCharCode(num);
        });
        let legend = correct === 1 ?
            'Select the correct answer' : 'Select all correct answers';

        this.forms = {
            formId     : 'choice-' + questUuid,
            submitFn   : this._submitForm,
            formEntries: [ {
                legend : legend,
                inline : true,
                twoCols: true,
                entries: entries
            } ],
            buttons: [ {
                btnName  : 'quiz-submit-' + questUuid,
                btnSubmit: true,
                btnCreate: function() {
                    return StateButton.saveButtonFsm("Select", "Submit", "Result");
                }
            } ]
        };
    }

    updateForm() {
        let disable, error, ans;

        if (this.hasAns == null) {
            _.forEach(this.entries, function(entry) {
                if (entry.answer.userSelect === true) {
                    this.hasAns = true;
                    return false;
                }
                return true;
            }.bind(this));
        }
        if (this.hasAns === true) {
            this.forms.formEntries[0].legend = 'Quiz result, error is marked with red';
            _.forEach(this.entries, function(entry) {
                ans = entry.answer;
                entry.disabled = true;
                if (ans.correctChoice === true && ans.userSelect !== true) {
                    entry.errorFlag = true;
                }
            });
        }
    }

    validateInput(data, errFlags) {
        let checked = 0;

        _.forEach(this.entries, function(entry) {
            if (entry.ansType === 'choice') {
                if (data[entry.field] !== '') {
                    checked++;
                }
            }
        });
        if (checked > 0) {
            _.forEach(this.entries, function(entry) {
                delete errFlags[entry.field];
            });
            delete errFlags.errText;
            delete errFlags.helpText;
        } else {
            return null;
        }
        return data;
    }

    submitNotif(store, data, result, status, cb) {
        super.submitNotif(store, data, result, status, cb);
    }

    _submitForm(data) {
        let question = QuestionStore.getQuestionByUuid(this.questUuid);

        _.forEach(question.answer, function(ans) {
            if (ans.ansType === 'choice') {
                if (data[ans.ansKey] !== '') {
                    ans.userSelect = data[ans.ansKey];
                }
            }
        });
        QuestionStore.triggerEvent(question, 'answer', question.questUuid);
    }
}

class QuizChoice extends InputBase
{
    constructor(props) {
        super(props, _.uniqueId(), [QuestionStore]);
        this.choiceForm = new QuizChoiceForm(props, 'quiz-' + props.questUuid);
    }

    _updateState(store, data, item, code, arr, context) {
    }

    render() {
        this.choiceForm.updateForm();
        return (
            <div className="well">
                <ProcessForm form={this.choiceForm} store={QuestionStore}/>
            </div>
        );
    }
}

class Questionare extends InputBase
{
    constructor(props) {
        super(props, _.uniqueId(), [QuestionStore]);
        this.title = "Question";
        this.state = {
            tabIdx: 0
        };
        this._getQuestions     = this._getQuestions.bind(this);
        this._getCurrentTabIdx = this._getCurrentTabIdx.bind(this);
        this._setCurrentTabIdx = this._setCurrentTabIdx.bind(this);
    }

    _updateState(store, data, item, status, isArr, id) {
        let question = this._getQuestions();
        if (question == null) {
            return;
        }
        if (id !== question.currQuest.questUuid) {
            console.log("bail out, not match...");
            return;
        }
        this.setState({
            tabIdx: this.state.tabIdx + 1
        });
    }

    _getQuestions() {
        let questions, article = this.props.article;

        if (article == null || article.articleUuid == null) {
            return null;
        }
        questions = QuestionStore.getQuestions(article.articleUuid);
        if (questions == null) {
            return null;
        }
        return {
            questions: questions,
            currQuest: questions[this.state.tabIdx]
        };
    }

    _getCurrentTabIdx() {
        return this.state.tabIdx;
    }

    _setCurrentTabIdx(index) {
        this.setState({
            tabIdx: index
        });
    }

    _getQuizWizard(artUuid, questions) {
        let idx = 0, items = [], count = questions.length;

        if (this.artUuid == artUuid) {
            return this.questWizard;
        }
        _.forEach(questions, function(quest) {
            items.push({
                domId  : 'quiz-' + artUuid + idx,
                tabText: 'Quiz ' + idx,
                tabIdx : idx,
                goback : true
            });
            idx++;
        });
        this.artUuid     = artUuid;
        this.questPans   = items;
        this.questWizard = {
            containerFmt : '',
            getActivePane: this._getCurrentTabIdx,
            setActivePane: this._setCurrentTabIdx,
            tabItems     : items,
            activePane   : 4
        };
        return this.questWizard;
    }

    _renderQuiz(quest) {
        return (
            <div>
                <div style={VntdGlob.styleContent}
                    dangerouslySetInnerHTML={{ __html: quest.content }}/>
                <QuizChoice choices={quest.answer} questUuid={quest.questUuid}/>
            </div>
        );
    }

    _renderForm() {
        let quiz, article = this.props.article, quizRender = [],
            questions = QuestionStore.getQuestions(article.articleUuid);

        if (questions == null) {
            return null;
        }
        quiz = this._getQuizWizard(article.articleUuid, questions);
        _.forEach(questions, function(quest) {
            quizRender.push(this._renderQuiz(quest));
        }.bind(this));

        return (
            <Wizard context={quiz} proText="Quiz">
                {quizRender}
            </Wizard>
        );
    }
}

export default Questionare;
