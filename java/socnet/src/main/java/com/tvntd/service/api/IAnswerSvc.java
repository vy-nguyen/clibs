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

import com.tvntd.forms.QuestionForm.AnswerForm;
import com.tvntd.models.Answer;
import com.tvntd.models.Question;
import com.tvntd.util.Util;

public interface IAnswerSvc
{
    List<AnswerDTO> getAnswers(String articleUuid);
    List<Answer> processAnswerForm(AnswerForm form, Question quest);

    public static class AnswerDTO
    {
        protected Answer answer;
        protected String inputValue;

        public AnswerDTO(Answer ans) {
            answer = ans;
        }

        public static List<AnswerDTO> convertAnswerDTO(List<Answer> in)
        {
            List<AnswerDTO> out = new LinkedList<>();
            for (Answer ans : in) {
                out.add(new AnswerDTO(ans));
            }
            return out;
        }

        public String getAnsType()
        {
            Long type = answer.getInputFlags();

            if ((type & Answer.MultChoices) != 0) {
                return "choice";
            }
            if ((type & Answer.InputAnswer) != 0) {
                return "input";
            }
            return "unknown";
        }

        public String getAnsInput() {
            return Util.fromRawByte(answer.getInputField());
        }

        public String getAnsHolder() {
            return Util.fromRawByte(answer.getInputHolder());
        }

        public String getAnsValidate()
        {
            if (inputValue == null) {
                inputValue = Util.fromRawByte(answer.getInputValue());
            }
            return inputValue;
        }

        public String getAnsChoice()
        {
            Long type = answer.getInputFlags();

            if ((type & Answer.MultChoices) != 0) {
                return getAnsValidate();
            }
            return null;
        }

        public Boolean isCorrectChoice() {
            return (answer.getInputFlags() & Answer.ChoicesCorrect) != 0 ? true : false;
        }
    }
}
