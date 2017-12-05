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

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvntd.dao.AnswerRepo;
import com.tvntd.dao.QuestionRepo;
import com.tvntd.forms.QuestionForm;
import com.tvntd.models.Answer;
import com.tvntd.models.Question;
import com.tvntd.service.api.IAnswerSvc;
import com.tvntd.service.api.IProfileService.ProfileDTO;
import com.tvntd.service.api.IQuestionSvc;

@Service
@Transactional
public class QuestionSvc implements IQuestionSvc
{
    @Autowired
    protected QuestionRepo questRepo;

    @Autowired
    protected AnswerRepo ansRepo;

    @Autowired
    protected IAnswerSvc answerSvc;

    @Override
    public List<QuestionDTO> getQuestions(String articleUuid)
    {
        return null;
    }

    @Override
    public QuestionDTO processForm(QuestionForm form,
            ProfileDTO profile, List<String> picOid)
    {
        Question quest = new Question(form, profile);
        Question link  = quest.getLinkQuestion();

        if (link != null) {
            questRepo.save(link);
        }
        questRepo.save(quest);

        List<Answer> answers = answerSvc.processAnswerForm(form.getAnswer(), quest);
        for (Answer ans : answers) {
            ansRepo.save(ans);
        }
        return new QuestionDTO(quest);
    }
}
