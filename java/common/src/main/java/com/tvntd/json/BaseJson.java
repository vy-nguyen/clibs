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
package com.tvntd.json;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class BaseJson
{
    protected static final ConcurrentMap<String, List<BaseJson>> sObjInst;
    protected static final ArrayList<JsonField> sJsFields;
    static {
        sObjInst = new ConcurrentHashMap<>();
        sJsFields = new ArrayList<>();
    }

    protected int instCount;
    protected BaseJson caller;
    protected ConcurrentMap<String, BaseJson> attrs;

    /**
     * Common to all json objs.
     */
    protected String idName;
    protected String[] exeVerbs;

    protected BaseJson() {
        attrs = new ConcurrentHashMap<>();
    }

    public static class JsonField
    {
        private boolean required;
        private String field;
        private Class<? extends BaseJson> clazz;

        public JsonField(String f, Class<? extends BaseJson> o) {
            this.field = f;
            this.clazz = o;
            this.required = false;
        }

        public JsonField(String f, Class<? extends BaseJson> o, boolean req) {
            this(f, o);
            this.required = true;
        }

        /**
         * @return the required
         */
        public boolean isRequired() {
            return required;
        }

        /**
         * @param required the required to set
         */
        public void setRequired(boolean required) {
            this.required = required;
        }

        /**
         * @return the field
         */
        public String getField() {
            return field;
        }

        /**
         * @param field the field to set
         */
        public void setField(String field) {
            this.field = field;
        }

        /**
         * @return the clazz
         */
        public Class<? extends BaseJson> getClazz() {
            return clazz;
        }

        /**
         * @param clazz the clazz to set
         */
        public void setClazz(Class<? extends BaseJson> clazz) {
            this.clazz = clazz;
        }
    }
}
