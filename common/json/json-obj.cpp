/*
 * Copyright (C) 2014-2015 Vy Nguyen
 * Github https://github.com/vy-nguyen/c-libraries
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
#include <boost/filesystem.hpp>
#include <json/json-obj.h>

namespace fs = boost::filesystem;

static const JsDecode s_def_decode("", nullptr, nullptr);

JsDecode::~JsDecode() {}
JsDecode::JsDecode(const char *const key) :
    JsDecode(key, typeid(JsBase).name(), nullptr, &s_def_decode) {}

JsDecode::JsDecode(const char *const key,
                   const JsDecode *const *curr, const JsDecode *up) :
    JsDecode(key, typeid(JsBase).name(), curr, up) {}

JsDecode::JsDecode(const char *const key, const char *const type,
                   const JsDecode *const *curr, const JsDecode *up) :
    js_key(key), js_typename(type), js_upstream(up), js_decode(curr) {}

/**
 * iter_next
 * ---------
 */
const JsDecode *
JsDecodeIter::iter_next()
{
    while ((js_ref != nullptr) && (js_ref->js_decode == nullptr)) {
        js_ref = js_ref->js_upstream;
    }
    if (js_ref != nullptr) {
        const JsDecode *ret = js_ref->js_decode[js_idx];
        if (ret == nullptr) {
            js_idx = 0;
            js_ref = js_ref->js_upstream;
        } else {
            js_idx++;
        }
        return ret;
    }
    return nullptr;
}

/**
 * js_alloc
 * --------
 */
JsBase::ptr
JsDecode::js_alloc(JsBase::ptr parent, bool has_id,
                   const char *id, int idx, json_t *json) const
{
    return JsBase::alloc(parent, has_id, id, idx, json);
}

/**
 * js_get_decode
 * -------------
 */
const JsDecode &
JsDecode::js_get_decode(const char *key) const
{
    if (js_decode != nullptr) {
        if (strcmp(key, js_key) == 0) {
            return *this;
        }
        for (int i = 0; js_decode[i] != nullptr; i++) {
            if (strcmp(key, js_decode[i]->js_key) == 0) {
                return *(js_decode[i]);
            }
        }
    }
    if (js_upstream == nullptr) {
        if (js_key[0] == '*') {
            return *this;
        }
        return s_def_decode;
    }
    return js_upstream->js_get_decode(key);
}

/**
 * js_format_keyname
 * -----------------
 */
static inline char *
js_make_keyname(const char *key, const void *id, int idx)
{
    size_t len = strlen(key) + 20;
    char *out = new char [len];

    if (idx >= 0) {
        snprintf(out, len, "%s:%p:%d", key, id, idx);
    } else {
        snprintf(out, len, "%s:%p", key, id);
    }
    return out;
}

/**
 * js_format_name
 * --------------
 */
static char *
js_format_name(const void *parent, bool has_id, const char *id, int idx)
{
    char *name = nullptr;

    if (has_id == false) {
        name = js_make_keyname(id, parent, idx);
    } else if (idx < 0) {
        name = new char[strlen(id) + 1];
        strcpy(name, id);
    } else {
        size_t len = strlen(id) + 5;
        name = new char[len];
        snprintf(name, len, "%s-%d", id, idx);
    }
    return name;
}

JsBase::JsBase(JsBase::ptr parent, bool has_id, const char *id, int idx, json_t *json) :
    js_data(json_incref(json)),
    js_id_name(js_format_name(parent.get(), has_id, id, idx)),
    js_parent(parent) {}

JsBase::~JsBase()
{
    delete [] js_id_name;
    if (js_data != nullptr) {
        json_decref(js_data);
    }
    js_parent = nullptr;
}

/**
 * js_deref_all
 * ------------
 */
void
JsBase::js_deref_all()
{
    js_parent = nullptr;
    js_cleanup();
}

/**
 * js_alloc_output
 * ---------------
 */
JsOutput::ptr
JsBase::js_alloc_output() const
{
    return JsOutput::alloc();
}

/**
 * js_dump
 * -------
 */
void
JsBase::js_dump() const
{
    printf("\t[%s], type %s, json %p\n", js_id_name, obj_name(), js_data);
}

/**
 * js_get_lock
 * -----------
 */
pthread_mutex_t *
JsBase::js_get_lock() const
{
    return JsManager::getInstance()->mod_get_lock(reinterpret_cast<const void *>(this));
}

/**
 * js_decode
 * ---------
 */
JsBase::ptr
JsBase::js_decode(json_t *root, const char *key, int idx, bool get_all,
                  JsBase::ptr parent, const JsDecode &decode, JsManager::ptr mgr)
{
    json_t      *cval;
    JsBase::ptr  jobj;

    cval = json_object_get(root, "idName");
    if ((cval != nullptr) && json_is_string(cval)) {
        jobj = decode.js_alloc(parent, true, json_string_value(cval), -1, root);
        mgr->js_put_symb(jobj);

    } else if (key != nullptr) {
        assert(parent != nullptr);
        jobj = decode.js_alloc(parent, false, key, idx, root);

    } else {
        jobj = decode.js_alloc(nullptr, true, "root", idx, root);
        mgr->js_put_symb(jobj);
    }
    if (get_all == true) {
        jobj->js_decode_all(root, nullptr, decode, mgr);
    } else {
        jobj->js_decode_nested(root, decode, mgr);
    }
    return jobj;
}

/**
 * js_decode_nested
 * ----------------
 */
void
JsBase::js_decode_nested(json_t *root, const JsDecode &decode, JsManager::ptr mgr)
{
    json_t         *cval, *elm;
    const char     *ckey, *id;
    uint32_t        cidx;
    JsBase::ptr     jobj;
    JsDecodeIter    iter;
    const JsDecode *active;

    decode.iter_begin(&iter);
    while ((active = iter.iter_next()) != nullptr) {
        ckey = active->js_get_key();
        cval = json_object_get(root, ckey);
        if (cval == nullptr) {
            continue;
        }
        if (json_is_object(cval)) {
            jobj = js_decode(cval, ckey, -1, false, this, *active, mgr);
            mgr->js_put_symb(jobj, ckey);

        } else if (json_is_array(cval)) {
            json_array_foreach(cval, cidx, elm) {
                jobj = js_decode(elm, ckey, (int)cidx, false, this, *active, mgr);
                mgr->js_put_symb(jobj, ckey);
            }
        } else if (json_is_string(cval)) {
            id   = json_string_value(cval);
            jobj = mgr->js_get_symb(id);
            if (jobj == nullptr) {
                mgr->js_unresolve_symb(this, ckey, id);
            }
        }
    }
}

/**
 * js_decode_all
 * -------------
 */
void
JsBase::js_decode_all(json_t *root, const char *key,
                      const JsDecode &decode, JsManager::ptr mgr)
{
    json_t         *cval;
    const char     *ckey;
    uint32_t        cidx;
    JsBase::ptr     jobj;

    if (json_is_array(root)) {
        assert(key != nullptr);
        const JsDecode &active = decode.js_get_decode(key);

        json_array_foreach(root, cidx, cval) {
            if (!json_is_object(cval) && !json_is_array(cval)) {
                continue;
            }
            jobj = js_decode(cval, key, cidx, true, this, active, mgr);
            mgr->js_put_symb(jobj, key);
        }
        return;
    }
    json_object_foreach(root, ckey, cval) {
        assert(ckey != nullptr);
        const JsDecode &active = decode.js_get_decode(ckey);

        if (json_is_array(cval)) {
            js_decode_all(cval, ckey, active, mgr);
            continue;
        }
        if (json_is_object(cval)) {
            jobj = js_decode(cval, ckey, -1, true, this, active, mgr);
            mgr->js_put_symb(jobj, ckey);
            continue;
        }
    }
}

/**
 * js_init
 * -------
 */
void JsBase::js_init() {}
void JsBase::js_cleanup() {}

/**
 * js_selftest
 * -----------
 */
bool
JsBase::js_selftest()
{
    return true;
}

/**
 * js_selfclone
 * ------------
 */
void
JsBase::js_selfclone()
{
    const char *key;
    json_t     *val, *root = json_object();

    json_object_foreach(js_data, key, val) {
        switch (json_typeof(val)) {
        case JSON_STRING:
            json_object_set_new(root, key, json_string(json_string_value(val)));
            break;

        case JSON_INTEGER:
            json_object_set_new(root, key, json_integer(json_integer_value(val)));
            break;

        case JSON_REAL:
            json_object_set_new(root, key, json_real(json_real_value(val)));
            break;

        case JSON_TRUE:
        case JSON_FALSE:
            json_object_set_new(root, key, val);
            break;

        case JSON_ARRAY:
            json_object_set_new(root, key, json_array());
            break;

        case JSON_OBJECT:
            json_object_set_new(root, key, json_null());
            break;

        default:
            break;
        }
    }
    js_data = root;
}

/**
 * js_exec
 * -------
 */
void
JsBase::js_exec(const char *verb, JsOutput::ptr out)
{
    json_t     *cval;
    const char *ckey;

    printf("Base exec data %p, type %s\n", js_data, typeid(this).name());
    json_object_foreach(js_data, ckey, cval) {
        if (json_is_array(cval)) {
            printf("Array %s\n", ckey);
            continue;
        }
        if (json_is_object(cval)) {
            printf("Object %s\n", ckey);
            continue;
        }
        if (json_is_string(cval)) {
            printf("Key %s, value %s\n", ckey, json_string_value(cval));
            continue;
        }
        if (json_is_integer(cval)) {
            printf("Key %s, value %lld\n", ckey, json_integer_value(cval));
            continue;
        }
    }
}

/**
 * js_clone
 * --------
 */
JsBase::ptr
JsBase::js_clone(JsBase::ptr parent, json_t *js, const char *id) const
{
    bool selfclone = false;

    if (js == nullptr) {
        selfclone = true;
        js = js_data;
    }
    JsBase::ptr obj = JsBase::alloc(parent, true, id, -1, js);
    if (selfclone == true) {
        obj->js_selfclone();
    }
    obj->js_init();
    return obj;
}

/**
 * js_array_foreach
 * ----------------
 */
int
JsBase::js_array_foreach(const char *key,
        bool (*fn)(const JsBase::ptr, uint32_t, uint32_t, const char *))
{
    const json_t *arr = json_object_get(js_data, key);
    if (!json_is_array(arr)) {
        return 0;
    }
    int           cnt;
    uint32_t      all, idx;
    const json_t *elm;

    cnt = 0;
    all = json_array_size(arr);
    json_array_foreach(arr, idx, elm) {
        if (json_is_string(elm)) {
            cnt++;
            if ((*fn)(this, idx, all, json_string_value(elm)) == false) {
                break;
            }
        } else {
            break;
        }
    }
    return cnt;
}

int
JsBase::js_array_foreach(const char *key,
                         bool (*fn)(JsBase::ptr, uint32_t, uint32_t, int))
{
    const json_t *arr = json_object_get(js_data, key);
    if (!json_is_array(arr)) {
        return 0;
    }
    int           cnt;
    uint32_t      all, idx;
    const json_t *elm;

    cnt = 0;
    all = json_array_size(arr);
    json_array_foreach(arr, idx, elm) {
        if (json_is_integer(elm)) {
            cnt++;
            if ((*fn)(this, idx, all, json_integer_value(elm)) == false) {
                break;
            }
        } else {
            break;
        }
    }
    return cnt;
}

int
JsBase::js_array_foreach(const char *key,
                         bool (*fn)(JsBase::ptr, uint32_t, uint32_t, double))
{
    const json_t *arr = json_object_get(js_data, key);
    if (!json_is_array(arr)) {
        return 0;
    }
    int           cnt;
    uint32_t      all, idx;
    const json_t *elm;

    cnt = 0;
    all = json_array_size(arr);
    json_array_foreach(arr, idx, elm) {
        if (json_is_real(elm)) {
            cnt++;
            if ((*fn)(this, idx, all, json_real_value(elm)) == false) {
                break;
            }
        } else {
            break;
        }
    }
    return cnt;
}

int
JsBase::js_array_foreach(const char *key,
                         const JsManager::ptr mgr_in,
                         bool (*fn)(JsBase::ptr, uint32_t, uint32_t, JsBase::ptr))
{
    const json_t *arr = json_object_get(js_data, key);
    if (!json_is_array(arr)) {
        return 0;
    }
    int           cnt;
    uint32_t      all, idx;
    const json_t *elm;
    const JsManager::ptr mgr = mgr_in != nullptr ? mgr_in : JsManager::getInstance();

    cnt = 0;
    all = json_array_size(arr);
    json_array_foreach(arr, idx, elm) {
        JsBase::ptr obj = js_get_json(mgr, key, elm, idx);
        if (obj != nullptr) {
            cnt++;
            if ((*fn)(this, idx, all, obj) == false) {
                break;
            }
        }
    }
    return cnt;
}

/**
 * js_get_attr
 * -----------
 */
JsBase::ptr
JsBase::js_get_attr(const JsManager::ptr mgr,
                    const char *key, bool has_id, int idx) const
{
    const char *find = js_format_name(this, has_id, key, idx);
    JsBase::ptr obj = mgr->js_get_symb(find);

    delete [] find;
    return obj;
}

/**
 * js_get_json
 * -----------
 */
JsBase::ptr
JsBase::js_get_json(const JsManager::ptr mgr,
                    const char *key, const json_t *elm, int idx) const
{
    if (json_is_object(elm)) {
        json_t *id = json_object_get(elm, "idName");

        if ((id != nullptr) && json_is_string(id)) {
            return js_get_attr(mgr, json_string_value(id), true, -1);
        }
        return js_get_attr(mgr, key, false, idx);
    }
    if (json_is_string(elm)) {
        return js_get_attr(mgr, json_string_value(elm), true, -1);
    }
    return nullptr;
}

/**
 * js_kv_obj
 * ---------
 */
const json_t *
JsBase::js_kv_obj(const char *key) const
{
    return json_object_get(js_data, key);
}

/**
 * js_kv_str
 * ---------
 */
const char *
JsBase::js_kv_str(const char *key) const
{
    const json_t *json = json_object_get(js_data, key);
    if (json_is_string(json)) {
        return json_string_value(json);
    }
    return nullptr;
}

/**
 * js_kv_real
 * ----------
 */
double
JsBase::js_kv_real(const char *key) const
{
    const json_t *json = json_object_get(js_data, key);
    if (json_is_real(json)) {
        return json_real_value(json);
    }
    return 0;
}

/**
 * js_kv_bool
 * ----------
 */
bool
JsBase::js_kv_bool(const char *key) const
{
    const json_t *json = json_object_get(js_data, key);
    if (json_is_boolean(json)) {
        return json_boolean_value(json);
    }
    return false;
}

/**
 * js_kv_int
 * ---------
 */
int
JsBase::js_kv_int(const char *key) const
{
    const json_t *json = json_object_get(js_data, key);
    if (json_is_integer(json)) {
        return json_integer_value(json);
    }
    return 0;
}

/**
 * js_kv_int64
 * -----------
 */
uint64_t
JsBase::js_kv_int64(const char *key) const
{
    const json_t *json = json_object_get(js_data, key);
    if (json_is_string(json)) {
        const char *str = json_string_value(json);
        if ((str[0] == '0') && (str[1] == 'x' || str[1] == 'X')) {
            return strtoull(str, nullptr, 16);
        }
        return strtoull(str, nullptr, 10);
    }
    return 0;
}

/**
 * js_set_kv_obj
 * -------------
 */
void
JsBase::js_set_kv_obj(const char *key, json_t *json)
{
    json_object_del(js_data, key);
    json_object_set_new(js_data, key, json);
    json_decref(json);
}

/**
 * js_set_kv_str
 * -------------
 */
void
JsBase::js_set_kv_str(const char *key, const char *str, bool own)
{
    json_t *json = json_object_get(js_data, key);
    if (json == nullptr) {
        json_object_set_new(js_data, key, json_string(str));
        assert(json_object_get(js_data, key) != nullptr);
        return;
    }
    if (json_is_string(json)) {
        json_string_set(json, str);
    }
}

/**
 * js_set_kv_real
 * --------------
 */
void
JsBase::js_set_kv_real(const char *key, double val)
{
    json_t *json = json_object_get(js_data, key);
    if (json == nullptr) {
        json_object_set_new(js_data, key, json_real(val));
        return;
    }
    if (json_is_real(json)) {
        json_real_set(json, val);
    }
}

/**
 * js_set_kv_int
 * -------------
 */
void
JsBase::js_set_kv_int(const char *key, int val)
{
    json_t *json = json_object_get(js_data, key);
    if (json == nullptr) {
        json_object_set_new(js_data, key, json_integer(val));
        return;
    }
    if (json_is_integer(json)) {
        json_integer_set(json, val);
    }
}

/**
 * js_set_kv_int64
 * ---------------
 */
void
JsBase::js_set_kv_int64(const char *key, uint64_t val)
{
    char num[JsManager::name_size];

    snprintf(num, sizeof(num), "0x%lx", val);
    js_set_kv_str(key, num);
}

/**
 * js_kv_obj_count
 * ---------------
 */
int
JsBase::js_kv_obj_count(const char *key) const
{
    json_t *elm = json_object_get(js_data, key);

    if (json_is_object(elm)) {
        return 1;
    }
    if (json_is_array(elm)) {
        return json_array_size(elm);
    }
    return 0;
}

/**
 * js_kv_obj
 * ---------
 */
JsBase::ptr
JsBase::js_kv_obj(const char *key, int idx, JsManager::ptr mgr) const
{
    json_t *elm = json_object_get(js_data, key);

    if (json_is_array(elm)) {
        elm = json_array_get(elm, idx);
        if (elm == nullptr) {
            printf("no elem matching %s, idx %d\n", key, idx);
            return nullptr;
        }
    }
    return js_get_json(mgr, key, elm, idx);
}

/**
 * js_check_symbols
 * ----------------
 */
bool
JsBase::js_check_symbols(const JsManager::ptr mgr, const JsDecode &decode)
{
    return true;
}

/**
 * js_check_resolve_symbols
 * ------------------------
 */
bool
JsBase::js_check_resolve_symbols(const JsManager::ptr mgr, const JsDecode &decode) const
{
    bool        ret = true;
    json_t     *val;
    const char *key;

    json_object_foreach(js_data, key, val) {
        if (json_is_string(val)) {
            const JsDecode &dc = decode.js_get_decode(key);
            if (&dc == &s_def_decode) {
                continue;
            }
            const char *id = json_string_value(val);
            JsBase::ptr obj = mgr->js_get_symb(id);
            if (obj == nullptr) {
                ret = false;
                printf("Error: could not find object with id %s\n", id);
                continue;
            }
            if (obj->obj_name() != dc.js_get_typename()) {
                ret = false;
                printf("Error: [%s] expect type %s, actual type %s\n",
                       id, dc.js_get_typename(), obj->obj_name());
            }
        }
    }
    return ret;
}

JsManager::JsManager(const char *mod) :
    mod_name(mod), js_symbol(symb_tab_size), js_autogen(auto_gen_size)
{
    js_glob_vars = JsonVariables::alloc(global_vars);
    mod_alloc_locks(8);
}

JsManager::~JsManager()
{
    js_glob_vars = nullptr;
}

/**
 * mod_shutdown
 * ------------
 */
void
JsManager::mod_shutdown()
{
    for (auto it = js_symbol.begin(); it != js_symbol.end(); it++) {
        JsBase::ptr obj = object_cast<JsBase>(it.iter_takeout());
        obj->js_deref_all();
        obj = nullptr;
    }
    for (auto it = js_autogen.begin(); it != js_autogen.end(); it++) {
        JsBase::ptr obj = object_cast<JsBase>(it.iter_takeout());
        obj->js_deref_all();
        obj = nullptr;
    }
}

/**
 * js_def_decode
 * -------------
 */
const JsDecode &
JsManager::js_def_decode()
{
    return s_def_decode;
}

/**
 * js_load_file
 * ------------
 */
void
JsManager::js_load_file(const char *file, const JsDecode &decode, bool load)
{
    json_t       *root;
    size_t        flag;
    json_error_t  err;

    if (js_glob_vars->js_var_lookup("${basedir}") == nullptr) {
        /* Insert built in basedir with the directory of this file. */
        fs::path dir = fs::absolute(fs::path(file)).parent_path();
        js_glob_vars->js_var_add("${basedir}", dir.c_str());
    }
    flag = JSON_DECODE_ANY;
    root = json_load_file(file, flag, &err);
    if (root != nullptr) {
        js_glob_vars->js_process(root);
        if (load == true) {
            js_load_json(root, decode);
        } else {
            js_process_json(root, decode);
        }
        json_decref(root);
        return;
    }
    printf("Error [line %d, col %d]: %s\n", err.line, err.column, err.text);
}

/**
 * js_put_symb
 * -----------
 */
void
JsManager::js_put_symb(JsBase::ptr obj)
{
    pthread_mutex_lock(&m_mod_mtx);
    js_symbol.insert_keystr(obj);
    pthread_mutex_unlock(&m_mod_mtx);
}

void
JsManager::js_put_symb(JsBase::ptr obj, const char *key)
{
    if (!obj->obj_is_chained()) {
        js_put_symb(obj);
    }
}

/**
 * js_put_autogen
 * --------------
 */
void
JsManager::js_put_autogen(JsBase::ptr obj)
{
    pthread_mutex_lock(&m_mod_mtx);
    js_autogen.insert_keystr(obj);
    pthread_mutex_unlock(&m_mod_mtx);
}

/**
 * js_get_symb
 * -----------
 */
JsBase::ptr
JsManager::js_get_symb(const char *id)
{
    pthread_mutex_lock(&m_mod_mtx);
    JsBase::ptr obj = object_cast<JsBase>(js_symbol.lookup(id));
    pthread_mutex_unlock(&m_mod_mtx);

    return obj;
}

JsBase::ptr
JsManager::js_get_symb(const JsDecode &root, const char *kw, const char *id)
{
    const JsDecode &decode = root.js_get_decode(kw);

    if (&decode == &s_def_decode) {
        return nullptr;
    }
    JsBase::ptr obj = js_get_symb(id);
    if (obj != nullptr) {
        if (obj->name() != decode.js_get_typename()) {
            return nullptr;
        }
    }
    return obj;
}

/**
 * js_get_autogen
 * --------------
 */
JsBase::ptr
JsManager::js_get_autogen(const char *id, uint32_t gen)
{
    pthread_mutex_lock(&m_mod_mtx);
    JsBase::ptr obj = js_get_autogen_nolock(id, gen);
    pthread_mutex_unlock(&m_mod_mtx);
   
    return obj;
}

JsBase::ptr
JsManager::js_get_autogen(const char *full_id)
{
    pthread_mutex_lock(&m_mod_mtx);
    JsBase::ptr obj = object_cast<JsBase>(js_autogen.lookup(full_id));
    pthread_mutex_unlock(&m_mod_mtx);

    return obj;
}

/**
 * js_get_autogen_nolock
 * ---------------------
 */
JsBase::ptr
JsManager::js_get_autogen_nolock(const char *id, uint32_t gen)
{
    char name[JsManager::name_size];

    js_autogen_id(id, name, gen);
    return object_cast<JsBase>(js_autogen.lookup(name));
}

/**
 * js_erase_symb
 * -------------
 */
JsBase::ptr
JsManager::js_erase_symb(const char *id)
{
    pthread_mutex_lock(&m_mod_mtx);
    JsBase::ptr obj = object_cast<JsBase>(js_symbol.lookup(id));
    if (obj != nullptr) {
        js_symbol.remove_obj(obj);
    }
    pthread_mutex_unlock(&m_mod_mtx);
    return obj;
}

/**
 * js_erase_autogen
 * ----------------
 */
JsBase::ptr
JsManager::js_erase_autogen(char *id, uint32_t gen)
{
    pthread_mutex_lock(&m_mod_mtx);
    JsBase::ptr obj = js_get_autogen_nolock(id, gen);
    if (obj != nullptr) {
        js_autogen.remove_obj(obj);
    }
    pthread_mutex_unlock(&m_mod_mtx);

    return obj;
}

/**
 * js_resolve_objs
 * ---------------
 */
void
JsManager::js_resolve_objs(const JsDecode &decode, bool resolved)
{
    int fail = 0;

    for (auto it : js_symbol) {
        JsBase::ptr obj = object_cast<JsBase>(it);
        if (resolved == false) {
            if (obj->js_check_symbols(this, decode) == false) {
                fail++;
            }
        } else {
            if (obj->js_check_resolve_symbols(this, decode) == false) {
                fail++;
            }
        }
    }
    if (fail > 0) {
        printf("Found %d errors during semantic checks, exit with errors.\n", fail);
        exit(255);
    }
}

/**
 * js_process_file
 * ---------------
 */
void
JsManager::js_process_file(const char *file, const JsDecode &decode)
{
    js_load_file(file, decode, false);
    js_resolve_objs(decode, false);
    js_resolve_symbols(decode);
    js_resolve_objs(decode, true);
    js_do_init();
}

/**
 * js_run
 * ------
 */
void
JsManager::js_run(const char *cmds[])
{
    const char *def[] = { "main", nullptr };

    if (cmds == nullptr) {
        cmds = def;
    }
    js_run_objs(cmds);
}

class UnresolveSym : public Object
{
  public:
    OBJECT_COMMON_DEFS(UnresolveSym);

    inline JsBase::ptr urs_get_object() {
        return js_obj;
    }

  protected:
    JsBase::ptr              js_obj;
    const char              *js_field;
    const char              *js_key;

    UnresolveSym(JsBase::ptr obj, const char *field, const char *key)
    {
        js_obj   = obj;
        js_field = field;
        js_key   = key;
    }
};

/**
 * js_unresolve_symb
 * -----------------
 */
void
JsManager::js_unresolve_symb(JsBase::ptr obj, const char *field, const char *key)
{
    pthread_mutex_lock(&m_mod_mtx);
    js_unresolved.dl_add_back(UnresolveSym::alloc(obj, field, key));
    pthread_mutex_unlock(&m_mod_mtx);
}

/**
 * js_do_init
 * ----------
 */
void
JsManager::js_do_init()
{
    int failure = 0;

    for (auto it : js_symbol) {
        JsBase::ptr obj = object_cast<JsBase>(it);
        obj->js_init();
    }
    for (auto it : js_symbol) {
        JsBase::ptr obj = object_cast<JsBase>(it);
        if (obj->js_selftest() == false) {
            failure++;
        }
    }
    if (failure > 0) {
        printf("Found %d errors during selftest, exit with errors.\n", failure);
        exit(255);
    }
}

/**
 * js_run_objs
 * -----------
 */
void
JsManager::js_run_objs(const char *cmds[])
{
    if (cmds == nullptr) {
        for (auto it : js_symbol) {
            JsBase::ptr obj = object_cast<JsBase>(it);
            printf("Invoke obj %p %s\n", obj.get(), obj->js_get_id());
            obj->js_invoke(nullptr);
        }
    } else {
        for (int i = 0; cmds[i] != nullptr; i++) {
            JsBase::ptr obj = object_cast<JsBase>(js_symbol.lookup(cmds[i]));
            if (obj == nullptr) {
                printf("Unknown symbol %s\n", cmds[i]);
                continue;
            }
            obj->js_invoke(nullptr);
        }
    }
}

/**
 * js_resolve_symbols
 * ------------------
 */
void
JsManager::js_resolve_symbols(const JsDecode &decode)
{
    while (!js_unresolved.dl_empty()) {
        UnresolveSym::ptr task = object_cast<UnresolveSym>(js_unresolved.dl_rm_front());
        JsBase::ptr obj = task->urs_get_object();
        obj->js_exec(nullptr, nullptr);
        obj->js_check_symbols(this, decode);
    }
}

/**
 * js_dump_all
 * -----------
 */
void
JsManager::js_dump_all()
{
    printf("All Objects --------------\n");
    for (auto it : js_symbol) {
        JsBase::ptr obj = object_cast<JsBase>(it);
        obj->js_dump();
    }
    printf("All Global Variables ------------\n");
    js_glob_vars->js_dump();
}
