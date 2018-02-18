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
package com.tvntd.forms;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class QuestionForm
{
    protected static Logger s_log = LoggerFactory.getLogger(QuestionForm.class);

    @NotNull
    @Size(max = 64)
    protected String articleUuid;

    @NotNull
    @Size(max = 4096)
    protected String content;

    @Size(max = 64)
    protected String modalArtUuid;
    protected Long modalId;

    @Size(max = 512)
    protected String modalHdr;

    @Size(max = 4096)
    protected String modalContent;

    protected AnswerForm answer;

    public boolean cleanInput()
    {
        return true;
    }

    /**
     * @return the articleUuid
     */
    public String getArticleUuid() {
        return articleUuid;
    }

    /**
     * @param articleUuid the articleUuid to set
     */
    public void setArticleUuid(String articleUuid) {
        this.articleUuid = articleUuid;
    }

    /**
     * @return the content
     */
    public String getContent() {
        return content;
    }

    /**
     * @param content the content to set
     */
    public void setContent(String content) {
        this.content = content;
    }

    /**
     * @return the modalArtUuid
     */
    public String getModalArtUuid() {
        return modalArtUuid;
    }

    /**
     * @param modalArtUuid the modalArtUuid to set
     */
    public void setModalArtUuid(String modalArtUuid) {
        this.modalArtUuid = modalArtUuid;
    }

    /**
     * @return the modalId
     */
    public Long getModalId() {
        return modalId;
    }

    /**
     * @param modalId the modalId to set
     */
    public void setModalId(Long modalId) {
        this.modalId = modalId;
    }

    /**
     * @return the modalHdr
     */
    public String getModalHdr() {
        return modalHdr;
    }

    /**
     * @param modalHdr the modalHdr to set
     */
    public void setModalHdr(String modalHdr) {
        this.modalHdr = modalHdr;
    }

    /**
     * @return the modalContent
     */
    public String getModalContent() {
        return modalContent;
    }

    /**
     * @param modalContent the modalContent to set
     */
    public void setModalContent(String modalContent) {
        this.modalContent = modalContent;
    }

    /**
     * @return the answer
     */
    public AnswerForm getAnswer() {
        return answer;
    }

    /**
     * @param answer the answer to set
     */
    public void setAnswer(AnswerForm answer) {
        this.answer = answer;
    }

    public static class AnswerForm
    {
        protected AnsChoice[] choices;
        protected AnsInput input;

        /**
         * @return the choices
         */
        public AnsChoice[] getChoices() {
            return choices;
        }

        /**
         * @param choices the choices to set
         */
        public void setChoices(AnsChoice[] choices) {
            this.choices = choices;
        }

        /**
         * @return the input
         */
        public AnsInput getInput() {
            return input;
        }

        /**
         * @param input the input to set
         */
        public void setInput(AnsInput input) {
            this.input = input;
        }
    }

    public static class AnsChoice
    {
        protected Boolean correct;
        protected String choice;

        /**
         * @return the correct
         */
        public Boolean getCorrect() {
            return correct;
        }

        /**
         * @param correct the correct to set
         */
        public void setCorrect(Boolean correct) {
            this.correct = correct;
        }

        /**
         * @return the choice
         */
        public String getChoice() {
            return choice;
        }

        /**
         * @param choice the choice to set
         */
        public void setChoice(String choice) {
            this.choice = choice;
        }
    }

    public static class AnsInput
    {
        protected String ansInput;
        protected String ansHolder;
        protected String ansValidate;

        /**
         * @return the ansInput
         */
        public String getAnsInput() {
            return ansInput;
        }

        /**
         * @param ansInput the ansInput to set
         */
        public void setAnsInput(String ansInput) {
            this.ansInput = ansInput;
        }

        /**
         * @return the ansHolder
         */
        public String getAnsHolder() {
            return ansHolder;
        }

        /**
         * @param ansHolder the ansHolder to set
         */
        public void setAnsHolder(String ansHolder) {
            this.ansHolder = ansHolder;
        }

        /**
         * @return the ansValidate
         */
        public String getAnsValidate() {
            return ansValidate;
        }

        /**
         * @param ansValidate the ansValidate to set
         */
        public void setAnsValidate(String ansValidate) {
            this.ansValidate = ansValidate;
        }
    }
}
