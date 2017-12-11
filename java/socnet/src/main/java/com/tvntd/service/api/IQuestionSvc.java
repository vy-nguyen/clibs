/*
 * Copyright (C) 2014-2015 Vy Nguyen
 * Github https://github.com/vy-nguyen/tvntd
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */
package com.tvntd.service.api;

import java.util.LinkedList;
import java.util.List;

import com.tvntd.forms.QuestionForm;
import com.tvntd.forms.UuidForm;
import com.tvntd.models.Answer;
import com.tvntd.models.Question;
import com.tvntd.service.api.IAnswerSvc.AnswerDTO;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.util.Util;

public interface IQuestionSvc
{
    List<QuestionDTO> getQuestions(String articleUuid);
    QuestionDTO processForm(QuestionForm form, ProfileDTO profile, List<String> picOid);

    QuestionDTOResponse getQuestion(UuidForm form);
    
    public static class QuestionDTO
    {
        protected Question question;

        public QuestionDTO(Question quest)
        {
            question = quest;
        }

        public String getQuestUuid() {
            return question.getQuestUuid();
        }

        public String getArticleUuid() {
            return question.getArticleUuid();
        }

        public String getContentHeader() {
            return Util.fromRawByte(question.getContentHeader());
        }

        public String getContent() {
            return Util.fromRawByte(question.getContent());
        }

        public Long getQuesType() {
            return question.getQuesType();
        }

        public QuestionDTO getLinkQuestion()
        {
            Question link = question.getLinkQuestion();
            return link == null ? null : new QuestionDTO(link);
        }

        public QuestionDTO getLinkResult()
        {
            Question res = question.getLinkResult();
            return res == null ? null : new QuestionDTO(res);
        }

        public List<AnswerDTO> getAnswer()
        {
            List<Answer> answer = question.getAnswer();
            if (answer == null) {
                return null;
            }
            return AnswerDTO.convertAnswerDTO(answer);
        }
    }

    public static class QuestionDTOResponse extends GenericResponse
    {
        protected List<QuestionDTO> questions;

        public QuestionDTOResponse(List<QuestionDTO> resp)
        {
            super(GenericResponse.USER_HOME, null, null);
            questions = resp;
        }

        public QuestionDTOResponse(QuestionDTO resp)
        {
            super(GenericResponse.USER_HOME, null, null);
            questions = new LinkedList<>();
            questions.add(resp);
        }

        /**
         * @return the questions
         */
        public List<QuestionDTO> getQuestions() {
            return questions;
        }
    }
}
