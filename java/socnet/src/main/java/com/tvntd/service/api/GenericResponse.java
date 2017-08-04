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

/*
 * Adopt work from:
 * https://github.com/eugenp/tutorials.git
 */
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class GenericResponse
{
    static private Logger s_log =
        LoggerFactory.getLogger(GenericResponse.class.getName());

    public static final String REG_VERIFY_CODE = "reg-verify";
    public static final String REG_WAIT_EMAIL  = "reg-email-sent";
    public static final String REG_FAILED      = "reg-failure";
    public static final String REG_OK_LOGIN    = "reg-done";
    public static final String REG_USER_EXISTS = "reg-user-exists";
    public static final String REG_NO_USER     = "reg-no-user";
    public static final String USER_HOME       = "user";
    public static final String USER_ERROR      = "user-error";

    private String type;
    private String message;
    private String error;

    public GenericResponse(String message)
    {
        super();
        this.message = message;
    }

    public GenericResponse(String message, String error)
    {
        this(message);
        this.error = error;
    }

    public GenericResponse(String type, String mesg, String error)
    {
        this(mesg, error);
        this.type = type;
    }

    public GenericResponse(List<FieldError> fieldErrors, List<ObjectError> globalErrors)
    {
        super();
        ObjectMapper mapper = new ObjectMapper();
        try {
            this.message = mapper.writeValueAsString(fieldErrors);
            this.error = mapper.writeValueAsString(globalErrors);

        } catch (final JsonProcessingException e) {
            s_log.info(e.getMessage());
            this.message = "";
            this.error = "";
        }
    }

    /**
     * @return the type
     */
    public String getType() {
        return type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(final String message) {
        this.message = message;
    }

    public String getError() {
        return error;
    }

    public void setError(final String error, String mesg) {
        this.error   = error;
        this.message = mesg;
    }
}
