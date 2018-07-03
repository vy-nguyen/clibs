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
package com.tvntd.ether.rpc;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tvntd.ether.api.EtherRpcApi.RpcResponse;

public class JsonRpc
{
    static Logger s_log = LoggerFactory.getLogger(JsonRpc.class);

    private static final String s_url = "http://10.1.10.12:8545/";
    // private static final String s_url = "http://localhost:8545/";
    protected HttpClient httpClient;

    public JsonRpc()
    {
        httpClient = HttpClientBuilder.create().build();
    }

    public <T extends RpcResponse>
    T callJsonRpc(Class<T> clazz, String method, String id, String ...params) {
        return callJsonRpc(clazz, new JsonRpcReqt(method, id, params));
    }

    public <T extends RpcResponse>
    T callJsonRpc(Class<T> clazz, String method, String id, List<String> p) {
        return callJsonRpc(clazz, new JsonRpcReqt(method, id, p));
    }

    public <T extends RpcResponse>
    T callJsonRpcArr(Class<T> clazz, String m, String id, List<String> p) {
        return callJsonRpc(clazz, new JsonRpcReqtArr(m, id, p));
    }

    protected <T extends RpcResponse> T callJsonRpc(Class<T> clazz, JsonRpcCommon reqt)
    {
        HttpPost postReq = new HttpPost(s_url);

        try {
            ObjectMapper mapper = new ObjectMapper();

            postReq.setHeader(HttpHeaders.CONTENT_TYPE, "application/json");
            postReq.setEntity(new StringEntity(mapper.writeValueAsString(reqt)));

        } catch(Exception e) {
            s_log.info("Req exception " + e.getMessage());
        }
        try {
            HttpResponse resp = httpClient.execute(postReq);
            String content = EntityUtils.toString(resp.getEntity());
            int status = resp.getStatusLine().getStatusCode();
            ObjectMapper mapper = new ObjectMapper();

            if (status == HttpStatus.SC_OK) {
                return (T) mapper.readValue(content, clazz);
            }
            return null;

        } catch(IOException e) {
            s_log.info("IO exception " + e.getMessage());
        }
        return null;
    }

    public static class JsonRpcCommon
    {
        protected String method;
        protected String jsonrpc;
        protected String id;

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

        public JsonRpcCommon(String method, String id)
        {
            this.method = method;
            this.id = id;
        }
    }

    public static class JsonRpcReqt extends JsonRpcCommon
    {
        protected List<String> params;

        @JsonProperty(value = "params")
        public List<String> getParams() {
            return params;
        }

        public JsonRpcReqt(String method, String id, String ...params)
        {
            super(method, id);
            this.params = new LinkedList<>();

            for (String p : params) {
                this.params.add(p);
            }
        }

        public JsonRpcReqt(String method, String id, List<String> params)
        {
            super(method, id);
            this.params = params;
        }
    }

    public static class JsonRpcReqtArr extends JsonRpcCommon
    {
        protected List<List<String>> params;

        /**
         * @return the params
         */
        @JsonProperty(value = "params")
        public List<List<String>> getParams() {
            return params;
        }

        public JsonRpcReqtArr(String method, String id, List<String> params)
        {
            super(method, id);
            this.params = new LinkedList<>();
            this.params.add(params);
        }
    }
}
