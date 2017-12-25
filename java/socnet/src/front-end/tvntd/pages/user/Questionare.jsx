/**
 * Written by Vy Nguyen (2017)
 */
'use strict';

import _                  from 'lodash';
import React              from 'react-mod';
import PropTypes          from 'prop-types';

import Wizard             from 'vntd-shared/layout/Wizard.jsx';
import StateButton        from 'vntd-shared/utils/StateButton.jsx';
import InputBase          from 'vntd-shared/layout/InputBase.jsx';
import QuestionStore      from 'vntd-root/stores/QuestionStore.jsx';
import Lang               from 'vntd-root/stores/LanguageStore.jsx';
import RefLinks           from 'vntd-root/components/RefLinks.jsx';
import { VntdGlob }       from 'vntd-root/config/constants.js';
import { QuizChoiceForm } from 'vntd-root/stores/Question.jsx';
import { ProcessForm }    from 'vntd-shared/forms/commons/ProcessForm.jsx';

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

class QuizResult extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let result = [], total = 0, error = 0, questions = this.props.questions;

        _.forEach(questions, function(quest) {
            if (quest.evalAnswer() === false) {
                error++;
            }
            total++;
            result.push(quest.renderResult("Quiz " + total));
        });
        return (
            <div key={_.uniqueId()}>
                <h3>Result: {error} errors out of {total} quizzes</h3>
                {result}
            </div>
        );
    }
}

class Questionare extends InputBase
{
    constructor(props) {
        super(props, _.uniqueId(), [QuestionStore]);
        this.title = Lang.translate("Question");
        this.state = {
            tabIdx: 0
        };
        this._renderResult     = this._renderResult.bind(this);
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
                tabText: Lang.translate('Quiz ') + idx,
                tabIdx : idx,
                goback : true
            });
            idx++;
        });
        items.push({
            domId  : 'quiz-' + artUuid + idx,
            tabText: Lang.translate('Results'),
            tabIdx : idx,
            goback : true
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
            <div key={_.uniqueId()}>
                <div style={VntdGlob.styleContent}
                    dangerouslySetInnerHTML={{ __html: quest.content }}/>
                <QuizChoice choices={quest.answer} questUuid={quest.questUuid}/>
            </div>
        );
    }

    _renderResult(questions) {
        if ((this.state.tabIdx + 1) !== this.questPans.length) {
            return null;
        }
        return (<QuizResult questions={questions}/>);
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

        quizRender.push(this._renderResult(questions));
        return (
            <Wizard context={quiz} proText="Quiz">
                {quizRender}
            </Wizard>
        );
    }
}

export default Questionare;
