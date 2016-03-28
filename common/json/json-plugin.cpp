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
#include <stdio.h>
#include <stdlib.h>
#include <json/json-unit.h>
#include <json/json-plugin.h>

VarSubst::~VarSubst()
{
    json_decref(const_cast<json_t *>(js_subst));
}

VarSubst::VarSubst(const json_t *const obj) : js_subst(obj)
{
    json_incref(const_cast<json_t *>(js_subst));
}

/**
 * js_var_kw
 * ---------
 */
const char *
VarSubst::js_var_kw(const char *id, const char **end)
{
    const char *ret, *p;

    if (end != nullptr) {
        *end = nullptr;
    }
    for (p = id; *p != '\0' && *p != '$'; p++) {
        /* empty */
    }
    ret = p;
    if (*p++ != '$') {
        return nullptr;
    }
    if (*p++ != '{') {
        return nullptr;
    }
    for (; *p != '\0' && *p != '}'; p++) {
        /* empty */
    }
    if (*p != '}') {
        return nullptr;
    }
    if (end != nullptr) {
        *end = p + 1;
    }
    /* TODO: assert for var length limit. */
    return ret;
}

/**
 * js_subst_str
 * ------------
 */
json_t *
VarSubst::js_subst_str(JsonVariables::ptr dict, const char *in)
{
    int          subst_cnt, idx;
    std::string  subst;

    subst_cnt = 0;
    for (const char *p = in; *p != '\0'; p++) {
        if (*p == '$') {
            const char *end;
            auto var = js_var_kw(p, &end);

            if ((var == p) && (var != end)) {
                char kw[end - var + 1];
                for (idx = 0; var != end; kw[idx++] = *var++);

                kw[idx] = '\0';
                auto value = dict->js_var_lookup(kw);
                if (value == nullptr) {
                    printf("Warning: unknown variable %s\n", kw);
                    continue;
                }
                value->js_append_val(subst);
                p = end - 1;
                subst_cnt++;
                continue;
            }
        }
        subst.push_back(*p);
    }
    if (subst_cnt == 0) {
        return nullptr;
    }
    /*
     * If variable subst results in int, double, true/false type, change json value.
     */
    char *end;
    auto val = subst.c_str();
    int base[] = { 10, 16, 8, 2, 0 };

    for (int i = 0; base[i] != 0; i++) {
        /* XXX: need to handle base 8, 2 */
        auto num = strtoull(val, &end, base[i]);
        if (*end == '\0') {
            return json_integer(num);
        }
    }
    auto fnum = strtod(val, &end);
    if (*end == '\0') {
        return json_real(fnum);
    }
    if ((val[0] == 't' || val[0] == 'T') &&
        (val[1] == 'r' || val[1] == 'R') &&
        (val[2] == 'u' || val[2] == 'U') &&
        (val[3] == 'e' || val[3] == 'E') && (val[4] == '\0')) {
        return json_true();
    }
    if ((val[0] == 'f' || val[0] == 'F') &&
        (val[1] == 'a' || val[1] == 'A') &&
        (val[2] == 'l' || val[2] == 'L') &&
        (val[3] == 's' || val[3] == 'S') &&
        (val[4] == 'e' || val[4] == 'E') && (val[5] == '\0')) {
        return json_false();
    }
    return json_string(val);;
}

/**
 * js_append_val
 * -------------
 */
void
VarSubst::js_append_val(std::string &str) const
{
    switch (json_typeof(js_subst)) {
    case JSON_STRING:
        for (const char *s = json_string_value(js_subst); *s != '\0'; s++) {
            str.push_back(*s);
        }
        break;

    case JSON_TRUE:
        str.append("true");
        break;

    case JSON_FALSE:
        str.append("false");
        break;

    case JSON_INTEGER:
        str.append(std::to_string(json_integer_value(js_subst)));
        break;

    case JSON_REAL:
        str.append(std::to_string(json_real_value(js_subst)));
        break;

    case JSON_OBJECT:
        break;

    case JSON_ARRAY:
        break;

    default:
        break;
    }
}

/**
 * js_process
 * ----------
 */
void
JsonVariables::js_process(json_t *root)
{
    js_build_dict(root);
    js_subst_dict(root, nullptr, root);
}

/**
 * js_dump
 * -------
 */
void
JsonVariables::js_dump()
{
    for (auto it = js_var_map.begin(); it != js_var_map.end(); it++) {
        auto v = reinterpret_cast<const VarSubst *const>(it.value());
        printf("Map key %s -> %s\n", it.key(), v->to_string());
    }
}

/**
 * js_var_add
 * ----------
 */
void
JsonVariables::js_var_add(const char *var, const char *value)
{
    json_t *json = json_string(value);
    js_var_map.insert(var, static_cast<void *>(new VarSubst(json)), false);
    json_decref(json);
}

/**
 * js_build_dict
 * -------------
 */
void
JsonVariables::js_build_dict(const json_t *const root)
{
    uint32_t    idx;
    const char *key, *end;
    json_t     *val, *elm;

    /*
     * map ${a} = val to the var map table.
     */
    if (json_is_array(root)) {
        json_array_foreach(root, idx, elm) {
            js_build_dict(elm);
        }
    }
    json_object_foreach(const_cast<json_t *>(root), key, val) {
        auto var = VarSubst::js_var_kw(key, &end);
        if ((var == key) && (end != nullptr)) {
            /*
             * Save map "${a}" -> "some value"
             */
            auto str = json_string_value(val);
            if (str != nullptr) {
                auto subst = VarSubst::js_subst_str(this, str);
                if (subst != nullptr) {
                    val = subst;
                }
            }
            js_var_map.insert(var, static_cast<void *>(new VarSubst(val)), false);
        }
        if (json_is_object(val) || json_is_array(val)) {
            js_build_dict(val);
        }
    }
}

/**
 * js_subst_dict
 * -------------
 */
void
JsonVariables::js_subst_dict(json_t *top, const char *key, json_t *curr)
{
    uint32_t    idx;
    json_t     *val, *elm;

    if (json_is_array(curr)) {
        json_array_foreach(curr, idx, elm) {
            if (json_typeof(elm) == JSON_STRING) {
                auto subst = VarSubst::js_subst_str(this, json_string_value(elm));
                if (subst != nullptr) {
                    json_array_set_new(curr, idx, subst);
                }
                continue;
            }
            js_subst_dict(top, key, elm);
        }
    }
    json_object_foreach(curr, key, val) {
        if (json_typeof(val) != JSON_STRING) {
            if (json_is_object(val) || json_is_array(val)) {
                js_subst_dict(curr, key, val);
            }
            continue;
        }
        auto subst = VarSubst::js_subst_str(this, json_string_value(val));
        if (subst != nullptr) {
            json_object_set(curr, key, subst);
            json_decref(subst);
        }
    }
}

/**
 * js_subst_var
 * ------------
 */
void
JsonVariables::js_subst_var(json_t *root, const char *key, json_t *val)
{
}

JsonVariables::~JsonVariables()
{
    void *val;

    for (auto it = js_var_map.begin(); it != js_var_map.end(); it++) {
        (void)it.iter_takeout(&val);
        verify(val != nullptr);

        auto obj = reinterpret_cast<const VarSubst *const >(val);
        delete obj;
    }
}
