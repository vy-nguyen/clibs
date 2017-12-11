/*
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
import _                 from 'lodash';
import Reflux            from 'reflux';

import {Util}            from 'vntd-shared/utils/Enum.jsx';
import Actions           from 'vntd-root/actions/Actions.jsx';
import Answer            from 'vntd-root/stores/Answer.jsx';
import Question          from 'vntd-root/stores/Question.jsx';
import BaseStore         from 'vntd-root/stores/BaseStore.jsx';

let QuestionStore = Reflux.createStore({
    init: function() {
        this.store     = new BaseStore(this);
        this.articles  = {};
        this.questions = {};
    },

    listenables: Actions,

    storeItem(id, item, force) {
        return this.store.storeItem(id, item, force);
    },

    getItem(id) {
        return this.store.getItem(id);
    },

    getQuestions(artUuid) {
        return this.articles[artUuid];
    },

    getQuestionByUuid(questUuid) {
        return this.questions[questUuid];
    },

    getAnswers(questUuid) {
        return this.questions[questUuid].answer;
    },

    _convertObj(quest, field) {
        let ref, raw = quest[field];

        if (raw != null) {
            ref = new Question(raw);
            quest[field] = ref;
            this.questions[raw.questUuid] = ref;
        }
    },

    _converAnswer(quest) {
        let answer, ref = {};

        _.forEach(quest.answer, function(ans, key) {
            answer = new Answer(ans);
            ref[key] = answer;
        });
        quest.answer = ref;
    },

    _addQuestions(questions) {
        let quest, artRef, retVal = null;

        _.forEach(questions, function(item) {
            quest = new Question(item);
            this.questions[quest.questUuid] = quest;

            this._convertObj(quest, 'linkQuestion');
            this._convertObj(quest, 'linkResult');
            this._converAnswer(quest);

            artRef = this.articles[quest.articleUuid];
            if (artRef == null) {
                artRef = this.articles[quest.articleUuid] = [];
            }
            Util.insertSorted(quest, artRef, Question.compareQuestion);
            retVal = quest;
        }.bind(this));

        return quest;
    },

    onPostQuestFormCompleted: function(data, ctxId) {
        console.log("post question completed");
        console.log(data);
        let quest = this._addQuestions(data.questions);
        this.trigger(this, quest, "post", false, ctxId);
    },

    onGetQuestionsCompleted: function(data) {
        console.log("get question completed");
        console.log(data);
        this._addQuestions(data.questions);
        this.trigger(this, data, "get", false);
    },

    dumpData(hdr) {
        console.log(hdr);
        console.log(this.store);
        console.log(this.questions);
        console.log(this.articles);
    }
});

export default QuestionStore;
