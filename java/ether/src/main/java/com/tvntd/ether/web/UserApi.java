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
package com.tvntd.ether.web;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.tvntd.ether.api.IAccountSvc;
import com.tvntd.ether.api.ITransactionSvc;
import com.tvntd.ether.dto.GenericResponse;
import com.tvntd.ether.dto.WalletInfoDTO;

@Controller
public class UserApi
{
    static protected Logger s_log = LoggerFactory.getLogger(UserApi.class);

    @Autowired
    IAccountSvc accountSvc;

    @Autowired
    ITransactionSvc transSvc;

    @Secured({"ROLE_ADMIN", "ROLE_USER"}) 
    @RequestMapping(value = "/user/ether-account", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse getUserEtherAccount(HttpSession session)
    {
        return new GenericResponse("ok");
    }

    @Secured({"ROLE_ADMIN", "ROLE_USER"}) 
    @RequestMapping(value = "/user/ether-wallet", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse getUserEtherWallet(HttpSession session)
    {
        return new WalletInfoDTO("ok");
    }
}
