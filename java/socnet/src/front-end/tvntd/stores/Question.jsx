/*
 * Copyright by Vy Nguyen (2017)
 * BSD License
 */
import _                 from 'lodash';
import React             from 'react-mod';

import StateButton       from 'vntd-shared/utils/StateButton.jsx';
import QuestionStore     from 'vntd-root/stores/QuestionStore.jsx';
import Lang              from 'vntd-root/stores/LanguageStore.jsx';
import Mesg              from 'vntd-root/components/Mesg.jsx';
import { FormData }      from 'vntd-shared/forms/commons/ProcessForm.jsx';
import { ColFmtMap }     from 'vntd-root/config/constants.js';

export class QuizChoiceForm extends FormData
{
    constructor(props, suffix) {
        super(props, suffix);
        this._submitForm = this._submitForm.bind(this);

        this._initForm(props);
    }

    _initForm(props) {
        let questUuid = props.questUuid;

        this.questUuid = questUuid;
        this.question  = QuestionStore.getQuestionByUuid(questUuid);

        this.forms = {
            formId     : 'choice-' + questUuid,
            submitFn   : this._submitForm,
            formEntries: [ {
                legend : this.question.getLegend(),
                inline : true,
                twoCols: true,
                entries: this.question.getEntries()
            } ]
        };
        if (props.sourceId == null) {
            this.forms.buttons = [ {
                btnName  : 'quiz-submit-' + questUuid,
                btnSubmit: true,
                btnCreate: function() {
                    return StateButton.saveButtonFsm("Select", "Submit", "Result");
                }
            } ];
        }
    }

    updateForm() {
        let disable, error, ans, question = this.question;

        if (question.getAnswerCount() > 0) {
            this.forms.formEntries[0].legend = 
                Lang.translate('Quiz result, error is marked with red');

            question.forEachEntry(function(entry) {
                ans = entry.answer;
                entry.disabled = true;

                ans.evalAnswer();
                ans.setupEntry(entry);
            });
        }
    }

    validateInput(data, errFlags) {
        let checked = 0, question = this.question;

        question.forEachEntry(function(entry) {
            if (entry.ansType === 'choice') {
                if (data[entry.field] !== '') {
                    checked++;
                }
            }
        });
        if (checked > 0) {
            question.forEachEntry(function(entry) {
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
        let question = this.question;

        question.forEachAnswer(function(ans) {
            if (ans.ansType === 'choice') {
                if (data[ans.ansKey] !== '') {
                    question.setAnswer();
                    ans.userSelect = data[ans.ansKey];
                }
            }
        });
        QuestionStore.triggerEvent(question, 'answer', question.questUuid);
    }
}

export class Question {
    constructor(data) {
        _.forOwn(data, function(v, k) {
            this[k] = v;
        }.bind(this));

        this.ansType = 'choice';
        this.answerCount = 0;

        if (this.answer != null && Array.isArray(this.answer)) {
            this.ansType = this.answer[0].ansType;
        }
        if (this.ansType === 'choice') {
            this.evalFn = {
                choice: {
                    eval   : this._evalMultChoice.bind(this),
                    mkEntry: this._makeMultChoice.bind(this),
                    renderResult: this._renderMultiChoiceResult.bind(this)
                }
            };
        }
    }

    compareQuestion(anchor, elm) {
        return anchor.order - elm.order;
    }

    getEntries() {
        let fn = this.evalFn[this.ansType];
        if (fn != null) {
            return fn.mkEntry();
        }
        return null;
    }

    getLegend() {
        return this.legend;
    }

    evalAnswer() {
        let fn = this.evalFn[this.ansType];
        if (fn != null) {
            return fn.eval();
        }
        return false;
    }

    renderResult(header) {
        let fn = this.evalFn[this.ansType];
        if (fn != null) {
            if (this.errorCount == null) {
                fn.eval();
            }
            return fn.renderResult(header);
        }
        return null;
    }

    forEachAnswer(fn) {
        _.forEach(this.answer, fn);
    }

    forEachEntry(fn) {
        _.forEach(this.entries, fn);
    }

    setAnswer() {
        this.answerCount++;
    }

    getAnswerCount() {
        return this.answerCount;
    }

    _evalMultChoice() {
        let out, error = 0, total = 0;

        _.forEach(this.answer, function(ans) {
            out = ans.evalAnswer();
            if (out.correct !== true) {
                error++;
            }
            total++;
        });
        this.totalCount = total;
        this.errorCount = error;
        return error === 0 ? true : false;
    }

    _renderMultiChoiceResult(header) {
        let left, right, len = this.totalCount, out = [],
            status = this.errorCount === 0 ? "Correct" : "Incorrect";

        for (let i = 0; i < len; i++) {
            left  = this.answer[i.toString()].renderResult();
            i++;
            right = this.answer[i.toString()];
            right = (right != null) ? right.renderResult() : null;

            out.push(
                <div className="row" key={_.uniqueId()}>
                    <div className={ColFmtMap[6]}>
                        {left}
                    </div>
                    <div className={ColFmtMap[6]}>
                        {right}
                    </div>
                </div>
            );
        }
        return (
            <div className="well">
                <h2><Mesg text={header}/>: <Mesg text={status}/></h2>
                {out}
            </div>
        );
    }

    _makeMultChoice() {
        let num, correct = 0, questUuid = this.questUuid, label = 'A', entries = [];

        if (this.forms != null) {
            return this.entries;
        }
        _.forEach(this.answer, function(ans) {
            ans.ansKey   = 'mch-' + questUuid + label;
            ans.ansLabel = label;
            entries.push({
                answer    : ans,
                ansType   : ans.ansType,
                field     : ans.ansKey,
                html      : true,
                labelTxt  : '  ' + label + ' / ' + ans.ansChoice,
                checkedBox: true,
                inpDefVal : ans.userSelect
            });
            if (ans.correctChoice === true) {
                correct++;
            }
            num = label.charCodeAt(0) + 1;
            label = String.fromCharCode(num);
        });
        this.entries = entries;
        this.legend = correct === 1 ?
            Lang.translate('Select the correct answer') :
            Lang.translate('Select all correct answers');

        return this.entries;
    }
}

export default Question;
