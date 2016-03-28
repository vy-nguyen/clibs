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
package com.tvntd.web;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.security.web.csrf.MissingCsrfTokenException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.
        servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.tvntd.error.InvalidOldPasswordException;
import com.tvntd.error.UserAlreadyExistException;
import com.tvntd.error.UserNotFoundException;
import com.tvntd.service.api.GenericResponse;

@ControllerAdvice
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler
{
    private static final Log s_log =
        LogFactory.getLog(RestResponseEntityExceptionHandler.class);

    @Autowired
    private MessageSource messages;

    public RestResponseEntityExceptionHandler() {
        super();
    }

    // API

    // 400
    @Override
    protected ResponseEntity<Object>
    handleBindException(BindException ex,
            HttpHeaders headers, HttpStatus status, WebRequest request)
    {
        s_log.error("400 Status Code", ex);
        final BindingResult result = ex.getBindingResult();
        final GenericResponse bodyOfResponse =
            new GenericResponse(result.getFieldErrors(), result.getGlobalErrors());

        return handleExceptionInternal(ex, bodyOfResponse,
                new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @Override
    protected ResponseEntity<Object>
    handleMethodArgumentNotValid( MethodArgumentNotValidException ex,
            HttpHeaders headers, HttpStatus status, WebRequest request)
    {
        s_log.error("400 Status Code", ex);
        BindingResult result = ex.getBindingResult();

        GenericResponse bodyOfResponse =
            new GenericResponse(result.getFieldErrors(), result.getGlobalErrors());
        return handleExceptionInternal(ex, bodyOfResponse,
                new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler({ InvalidOldPasswordException.class })
    public ResponseEntity<Object>
    handleInvalidOldPassword(RuntimeException ex, WebRequest request)
    {
        s_log.error("400 Status Code", ex);
        GenericResponse bodyOfResponse =
            new GenericResponse(messages.
                    getMessage("message.invalidOldPassword",
                        null, request.getLocale()), "InvalidOldEmail");
        return handleExceptionInternal(ex,
                bodyOfResponse, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    // 403
    @ExceptionHandler({ MissingCsrfTokenException.class })
    public ResponseEntity<Object>
    handleCsrfMissMatch(RuntimeException ex, WebRequest request)
    {
        s_log.error("403 CRSF code");
        GenericResponse resp = new GenericResponse("Invalid CSRF");

        return handleExceptionInternal(ex,
                resp, new HttpHeaders(), HttpStatus.NOT_FOUND, request);
    }

    // 404
    @ExceptionHandler({ UserNotFoundException.class })
    public ResponseEntity<Object>
    handleUserNotFound(RuntimeException ex, WebRequest request)
    {
        s_log.error("404 Status Code", ex);
        GenericResponse bodyOfResponse =
            new GenericResponse(messages.getMessage("message.userNotFound",
                        null, request.getLocale()), "UserNotFound");
        return handleExceptionInternal(ex,
                bodyOfResponse, new HttpHeaders(), HttpStatus.NOT_FOUND, request);
    }

    // 409
    @ExceptionHandler({ UserAlreadyExistException.class })
    public ResponseEntity<Object>
    handleUserAlreadyExist(RuntimeException ex, WebRequest request)
    {
        s_log.error("409 Status Code", ex);
        GenericResponse bodyOfResponse =
            new GenericResponse(messages.getMessage("message.regError", null,
                        request.getLocale()), "UserAlreadyExist");
        return handleExceptionInternal(ex, bodyOfResponse,
                new HttpHeaders(), HttpStatus.CONFLICT, request);
    }

    // 500
    @ExceptionHandler({ MailAuthenticationException.class })
    public ResponseEntity<Object>
    handleMail(RuntimeException ex, WebRequest request)
    {
        s_log.error("500 Status Code", ex);
        GenericResponse bodyOfResponse =
            new GenericResponse(messages.getMessage("message.email.config.error",
                        null, request.getLocale()), "MailError");
        return new ResponseEntity<Object>(bodyOfResponse,
                new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler({ Exception.class })
    public ResponseEntity<Object>
    handleInternal(RuntimeException ex, WebRequest request)
    {
        s_log.error("500 Status Code", ex);
        GenericResponse bodyOfResponse =
            new GenericResponse(messages.getMessage("message.error",
                        null, request.getLocale()), "InternalError");
        return new ResponseEntity<Object>(bodyOfResponse,
                new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
