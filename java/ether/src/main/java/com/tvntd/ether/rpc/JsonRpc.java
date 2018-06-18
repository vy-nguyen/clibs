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

import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tvntd.ether.web.EtherApi.JsonRpcReqt;

public class JsonRpc
{
    protected HttpClient httpClient;
    protected HttpPost postReq;

    public JsonRpc()
    {
        httpClient = HttpClientBuilder.create().build();
        postReq = new HttpPost("http://localhost:8545/");
        postReq.setHeader(HttpHeaders.CONTENT_TYPE, "application/json");
    }

    public <T> T callJsonRpc(Class<T> clazz, String method, String id, String ...params)
    {
        JsonRpcReqt reqt = new JsonRpcReqt(method, id, params);

        try {
            ObjectMapper mapper = new ObjectMapper();
            postReq.setEntity(new StringEntity(mapper.writeValueAsString(reqt)));

        } catch(Exception e) {
            System.out.println("Exception " + e.getMessage());
        }
        try {
            HttpResponse resp = httpClient.execute(postReq);
            String content = EntityUtils.toString(resp.getEntity());
            int status = resp.getStatusLine().getStatusCode();
            ObjectMapper mapper = new ObjectMapper();

            System.out.println("Status code " + status);
            System.out.println("Resp " + content);
            return (T) mapper.readValue(content, clazz);

        } catch(IOException e) {
            System.out.println("IO Exception " + e.getMessage());
        }
        return null;
    }
}
