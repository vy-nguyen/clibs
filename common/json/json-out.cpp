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
#include <json/json-obj.h>

JsOutput::JsOutput() :
    out_mgr(nullptr), out_jobj(nullptr), out_json(nullptr), out_str(nullptr),
    out_str_arr(nullptr), out_ints(nullptr), out_arr_size(0), out_str_arr_size(0) {}

JsOutput::~JsOutput()
{
    out_mgr = nullptr;
    out_jobj = nullptr;
    if (out_json != nullptr) {
        json_decref(out_json);
    }
    out_json = nullptr;

    if (out_str != nullptr) {
        delete [] out_str;
    }
    out_str = nullptr;

    if (out_ints != nullptr) {
        delete [] out_ints;
    }
    out_ints = nullptr;
    out_arr_size = 0;

    if (out_str_arr != nullptr) {
        for (int i = 0; i < out_str_arr_size; i++) {
            if (out_str_arr[i] != nullptr) {
                delete [] out_str_arr[i];
                out_str_arr[i] = nullptr;
            }
        }
        delete [] out_str_arr;
    }
    out_str_arr = nullptr;
    out_str_arr_size = 0;
}

/**
 * out_put_jobj
 * ------------
 */
JsOutput::ptr
JsOutput::out_put_jobj(JsBase::ptr obj)
{
    out_jobj = obj;
    return this;
}

/**
 * out_put_json
 * ------------
 */
JsOutput::ptr
JsOutput::out_put_json(json_t *js)
{
    if (out_json != nullptr) {
        json_decref(out_json);
    }
    out_json = js;
    json_incref(js);
    return this;
}

JsOutput::ptr
JsOutput::out_put_num(uint64_t num, uint32_t idx)
{
    if ((idx < out_arr_size) && (out_arr_size > 0)) {
        assert(out_ints != nullptr);
        out_ints[idx] = num;
    }
    return this;
}

/**
 * out_set_num_arr
 * ----------------
 */
JsOutput::ptr
JsOutput::out_set_num_arr(uint64_t *arr, uint32_t size)
{
    if (arr == nullptr) {
        out_ints = nullptr;
        out_arr_size = 0;
    } else {
        if (out_ints != nullptr) {
            delete [] out_ints;
        }
        out_ints = arr;
        out_arr_size = size;
    }
    return this;
}

/**
 * out_put_num_arr
 * ---------------
 */
JsOutput::ptr
JsOutput::out_put_num_arr(uint32_t size, uint64_t num, uint32_t idx)
{
    if (out_ints != nullptr) {
        delete [] out_ints;
    }
    assert(size > idx);
    out_arr_size  = size;
    out_ints      = new uint64_t [size];
    out_ints[idx] = num;
    return this;
}

/**
 * out_put_str
 * -----------
 */
JsOutput::ptr
JsOutput::out_put_str(const char *str)
{
    out_new_str(strlen(str));
    strcpy(out_str, str);
    return this;
}

/**
 * out_set_str
 * ------------
 */
JsOutput::ptr
JsOutput::out_set_str(char *str)
{
    if (str == nullptr) {
        out_str = nullptr;
    } else {
        if (out_str != nullptr) {
            delete [] out_str;
        }
        out_str = str;
    }
    return this;
}

/**
 * out_new_str
 * -----------
 */
JsOutput::ptr
JsOutput::out_new_str(size_t size)
{
    if (out_str != nullptr) {
        delete [] out_str;
    }
    out_str = new char [size];
    return this;
}

/**
 * out_json_equals
 * ---------------
 */
bool
JsOutput::out_json_equals(const json_t *json)
{
    return false;
}

/**
 * out_new_str_arr
 * ---------------
 */
JsOutput::ptr
JsOutput::out_new_str_arr(int elm)
{
    if (out_str_arr != nullptr) {
        delete [] out_str_arr;
    }
    out_str_arr = new char * [elm];
    memset(out_str_arr, 0, sizeof(char *) * elm);
    return this;
}

/**
 * out_set_str_arr
 * ----------------
 */
JsOutput::ptr
JsOutput::out_set_str_arr(char **str, uint32_t size)
{
    if (str == nullptr) {
        out_str_arr = nullptr;
        out_str_arr_size = 0;
    } else {
        if (out_str_arr != nullptr) {
            delete [] out_str_arr;
        }
        out_str_arr = str;
        out_str_arr_size = size;
    }
    return this;
}

/**
 * out_put_str_arr
 * ---------------
 */
JsOutput::ptr
JsOutput::out_put_str_arr(char *str, int idx)
{
    assert(out_str_arr != nullptr);
    assert(idx < out_str_arr_size);

    if (out_str_arr[idx] != nullptr) {
        delete [] out_str_arr[idx];
    }
    out_str_arr[idx] = str;
    return this;
}

/**
 * out_put_json_field
 * ------------------
 */
JsOutput::ptr
JsOutput::out_put_json_field(const char *key, bool val)
{
    if (out_json == nullptr) {
        out_json = json_object();
    }
    if (val == true) {
        json_object_set_new(out_json, key, json_true());
    } else {
        json_object_set_new(out_json, key, json_false());
    }
    return this;
}

/**
 * out_put_json_field
 * ------------------
 */
JsOutput::ptr
JsOutput::out_put_json_field(const char *key, const char *val)
{
    if (out_json == nullptr) {
        out_json = json_object();
    }
    json_object_set_new(out_json, key, json_string(val));
    return this;
}

/**
 * out_put_json_field
 * ------------------
 */
JsOutput::ptr
JsOutput::out_put_json_field(const char *key, uint32_t val)
{
    if (out_json == nullptr) {
        out_json = json_object();
    }
    json_object_set_new(out_json, key, json_integer(val));
    return this;
}

/**
 * out_get_json_bool
 * -----------------
 */
bool
JsOutput::out_get_json_bool(const char *key)
{
    json_t *js = json_object_get(out_json, key);
    if (json_is_true(js)) {
        return true;
    }
    return false;
}

/**
 * out_get_json_int
 * ----------------
 */
uint32_t
JsOutput::out_get_json_int(const char *key)
{
    json_t *js = json_object_get(out_json, key);
    if (json_is_integer(js)) {
        return json_integer_value(js);
    }
    return 0;
}

/**
 * out_get_json_str
 * ----------------
 */
const char *
JsOutput::out_get_json_str(const char *key)
{
    json_t *js = json_object_get(out_json, key);
    if (json_is_string(js)) {
        return json_string_value(js);
    }
    return nullptr;
}
