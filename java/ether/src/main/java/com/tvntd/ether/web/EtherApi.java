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

import java.util.LinkedList;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.googlecode.jsonrpc4j.JsonRpcHttpClient;
import com.tvntd.ether.api.EtherRpcApi;
import com.tvntd.ether.api.EtherRpcApi.EtherAccount;
import com.tvntd.ether.dto.GenericResponse;

@Controller
public class EtherApi
{
    static protected Logger s_log = LoggerFactory.getLogger(EtherApi.class);

    @Autowired
    protected EtherRpcApi etherRpcApi;

    @Autowired
    protected JsonRpcHttpClient etherJsonRpc;

    /**
     * Handle Api REST calls.
     */
    @RequestMapping(value = "/api/hello", method = RequestMethod.GET)
    @ResponseBody
    public GenericResponse
    getUserNotification(Locale locale, HttpSession session,
            HttpServletRequest reqt, HttpServletResponse resp)
    {
        try {
            Object args = new JsonRpcReqt("foo",
                    "0x3E869518AaBdbb1805Bd467847B402F9E567b27b");

            EtherAccount res = etherJsonRpc
                .invoke("tudo_getAccount", args, EtherAccount.class);

            System.out.println("Output " + res);
            res.printJson();

        } catch(Throwable e) {
            System.out.println("Exception " + e.getMessage());
        }
        return new GenericResponse("Echo Hello World");
    }

    public void sendJsonRpc(String method, String id, String ...params)
    {
    }

    public static class JsonRpcReqt
    {
        @JsonProperty(value = "method")
        public String getMethod() {
            return method;
        }

        @JsonProperty(value = "jsonrpc")
        public String getJsonrpc() {
            return jsonrpc;
        }

        @JsonProperty(value = "id")
        public String getId() {
            return id;
        }

        @JsonProperty(value = "params")
        public List<String> getParams() {
            return params;
        }

        protected String method;
        protected String jsonrpc;
        protected String id;
        protected List<String> params;

        public JsonRpcReqt(String method, String id, String ...params)
        {
            this.jsonrpc = "2.0";
            this.id = id;
            this.method = method;
            this.params = new LinkedList<>();

            for (String p : params) {
                this.params.add(p);
            }
        }
    }
}
