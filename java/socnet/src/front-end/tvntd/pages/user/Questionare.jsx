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
import UserStore          from 'vntd-shared/stores/UserStore.jsx';
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

        let questions = QuestionStore.getQuestions(props.article.articleUuid);
        this.state = {
            tabIdx   : 0,
            questions: questions,
            currQuest: questions != null ? questions[0] : null
        };
        this._renderResult     = this._renderResult.bind(this);
        this._getQuestions     = this._getQuestions.bind(this);
        this._getCurrentTabIdx = this._getCurrentTabIdx.bind(this);
        this._setCurrentTabIdx = this._setCurrentTabIdx.bind(this);
    }

    _updateState(store, data, item, status, isArr, id) {
        let question = this._getQuestions();
        if (question == null ||
            question.questions == null || !Array.isArray(question.questions)) {
            return;
        }
        if (id !== question.currQuest.questUuid) {
            return;
        }
        question.tabIdx = this.state.tabIdx + 1;
        if (question.tabIdx >= question.questions.length) {
            question.currQuest = null;
        } else {
            question.currQuest = question.questions[question.tabIdx];
        }
        this.setState(question);
    }

    // @Override
    //
    _isOwner() {
        let questions = this.state.questions;
        if (questions != null && Array.isArray(questions)) {
            if (this.state.tabIdx >= questions.length) {
                return false;
            }
        }
        return UserStore.isUserMe(this.props.article.authorUuid);
    }

    // @Override
    //
    _deletePost() {
        let currQuest = this.state.currQuest;
        if (currQuest != null) {
            console.log("delete question " + this.state.currQuest.questUuid);
        }
        super._deletePost();
    }

    _getQuestions() {
        let questions, tabIdx, article = this.props.article;

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
                <h3>{quest.questUuid}</h3>
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
