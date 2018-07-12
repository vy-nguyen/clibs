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

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.tvntd.ether.api.ITransactionSvc;
import com.tvntd.ether.dto.EtherBlockDTO;
import com.tvntd.ether.dto.GenericResponse;
import com.tvntd.ether.dto.PublicAccountDTO;
import com.tvntd.ether.dto.TransactionDTO.TransListDTO;
import com.tvntd.lib.RawParseUtils;

@Controller
public class EtherApi
{
    static protected Logger s_log = LoggerFactory.getLogger(EtherApi.class);

    @Autowired
    protected ITransactionSvc etherTrans;

    @RequestMapping(value = "/api/ether", method = RequestMethod.GET)
    @ResponseBody
    public PublicAccountDTO
    getEtherStartup(Locale locale, HttpSession session,
            HttpServletRequest reqt, HttpServletResponse resp)
    {
        PublicAccountDTO acct = etherTrans.getPublicAccount();
        return acct;
    }

    @RequestMapping(value = "/api/ether/{start}/{count}", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse
    getEhterBlocks(HttpSession session,
            @PathVariable(value = "start") String start,
            @PathVariable(value = "count") String count)
    {
        EtherBlockDTO result = new EtherBlockDTO(start, count);
        etherTrans.getEtherBlocks(result);
        return result;
    }

    @RequestMapping(value = "/api/tudo/trans-from/{account}/{count}",
            method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse
    getEtherTransactionFrom(HttpSession session,
            @PathVariable(value = "account") String account,
            @PathVariable(value = "count") String count) {
        return getEtherTransaction(account, count, true);
    }

    @RequestMapping(value = "/api/tudo/trans-to/{account}/{count}",
            method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse
    getEtherTransactionTo(HttpSession session,
            @PathVariable(value = "account") String account,
            @PathVariable(value = "count") String count) {
        return getEtherTransaction(account, count, false);
    }

    protected GenericResponse
    getEtherTransaction(String account, String count, boolean from)
    {
        if (account == null) {
            return new GenericResponse("Missing account number");
        }
        int cnt = RawParseUtils.parseNumber(count, 1, 1000);
        return new TransListDTO(etherTrans.getTransactionAcct(account, 0, cnt, from));
    }
}
