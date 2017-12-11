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

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvntd.dao.AnswerRepo;
import com.tvntd.dao.QuestionRepo;
import com.tvntd.forms.QuestionForm;
import com.tvntd.forms.UuidForm;
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
            quest.setAnswer(ans);
        }
        return new QuestionDTO(quest);
    }

    @Override
    public QuestionDTOResponse getQuestion(UuidForm form)
    {
        List<String> artUuids = new LinkedList<>();
        for (String uuid : form.getUuids()) {
            artUuids.add(uuid);
        }
        List<QuestionDTO> out = getQuestion(artUuids);
        return new QuestionDTOResponse(out);
    }

    protected List<QuestionDTO> convertDTO(List<Question> quest, List<Answer> ans)
    {
        List<Question> fixup = new LinkedList<>();
        List<QuestionDTO> out = new LinkedList<>();
        Map<String, Question> map = new HashMap<>();

        for (Question q : quest) {
            String linkUuid = q.getLinkUuid();

            if (linkUuid != null) {
                Question link = map.get(linkUuid);
                if (link == null) {
                    fixup.add(q);
                } else {
                    q.connectLink(link);     
                    map.remove(linkUuid);
                }
            }
            map.put(q.getQuestUuid(), q);
        }
        for (Question q : fixup) {
            String linkUuid = q.getLinkUuid();
            Question link = map.get(linkUuid);

            if (link != null) {
                q.connectLink(link);
                map.remove(linkUuid);
            }
        }
        for (Answer a : ans) {
            Question q = map.get(a.getQuestUuid());
            if (q != null) {
                q.setAnswer(a);
            }
        }
        for (Question val : map.values()) {
            out.add(new QuestionDTO(val));
        }
        map.clear();
        fixup.clear();
        return out;
    }

    protected List<QuestionDTO> getQuestion(List<String> artUuids)
    {
        List<Question> quest = questRepo.findByArticleUuidIn(artUuids);

        if (quest == null || quest.isEmpty()) {
            return null;
        }
        List<Answer> answer = ansRepo.findByArticleUuidIn(artUuids);
        List<QuestionDTO> out = convertDTO(quest, answer);

        return out;
    }
}
