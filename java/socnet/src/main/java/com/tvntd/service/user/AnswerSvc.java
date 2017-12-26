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
package com.tvntd.service.user;

import java.util.LinkedList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tvntd.forms.QuestionForm.AnsChoice;
import com.tvntd.forms.QuestionForm.AnsInput;
import com.tvntd.forms.QuestionForm.AnswerForm;
import com.tvntd.models.Answer;
import com.tvntd.models.Question;
import com.tvntd.service.api.IAnswerSvc;

@Service
@Transactional
public class AnswerSvc implements IAnswerSvc
{
    @Override
    public List<AnswerDTO> getAnswers(String articleUuid)
    {
        return null;
    }

    @Override
    public List<Answer> processAnswerForm(AnswerForm form, Question quest)
    {
        AnsChoice[] choices = form.getChoices();
        if (choices != null) {
            return fillinChoices(choices, quest);
        }
        AnsInput input = form.getInput();
        if (input != null) {
            return fillinInput(input, quest);
        }
        return null;
    }

    protected List<Answer> fillinChoices(AnsChoice[] choices, Question quest)
    {
        List<Answer> out = new LinkedList<>();
        String artUuid   = quest.getArticleUuid();
        String questUuid = quest.getQuestUuid();

        for (AnsChoice ans : choices) {
            out.add(new Answer(artUuid, questUuid, ans.getChoice(), ans.getCorrect()));
        }
        return out;
    }

    protected List<Answer> fillinInput(AnsInput input, Question quest)
    {
        List<Answer> out = new LinkedList<>();
        String artUuid   = quest.getArticleUuid();
        String questUuid = quest.getQuestUuid();

        out.add(new Answer(artUuid, questUuid, input.getAnsInput(),
                    input.getAnsHolder(), input.getAnsValidate()));
        return out;
    }
}
