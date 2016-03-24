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
#ifndef INCLUDE_JSON__JSON_OBJ_H_
#define INCLUDE_JSON__JSON_OBJ_H_

#include <pthread.h>
#include <foss/janson/jansson.h>

#include <di/program.h>
#include <cpptype/list-obj.h>
#include <cpptype/hash-obj.h>
#include <json/json-plugin.h>

class JsBase;
class JsDecode;
class JsManager;

class JsOutput : public Object
{
  public:
    OBJECT_COMMON_DEFS(JsOutput);

    inline JsOutput::ptr out_put_mgr(bo::intrusive_ptr<JsManager> mgr) {
        out_mgr = mgr;
        return this;
    }
    inline bo::intrusive_ptr<JsManager> out_get_mgr() {
        return out_mgr;
    }

    JsOutput::ptr  out_put_json(json_t *js);
    inline json_t *out_get_json() const {
        return out_json;
    }

    /**
     * Assign kv field to json output.
     */
    JsOutput::ptr  out_put_json_field(const char *key, bool val);
    JsOutput::ptr  out_put_json_field(const char *key, const char *val);
    JsOutput::ptr  out_put_json_field(const char *key, uint32_t val);
    bool           out_get_json_bool(const char *key);
    uint32_t       out_get_json_int(const char *key);
    const char    *out_get_json_str(const char *key);

    /**
     * Test if this obj equals to the json input.
     */
    virtual bool out_json_equals(const json_t *json);

    JsOutput::ptr out_put_jobj(bo::intrusive_ptr<JsBase> jobj);
    inline bo::intrusive_ptr<JsBase> out_get_jobj() {
        return out_jobj;
    }

    JsOutput::ptr  out_put_num(uint64_t num, uint32_t idx);
    JsOutput::ptr  out_set_num_arr(uint64_t *arr, uint32_t size);
    JsOutput::ptr  out_put_num_arr(uint32_t arr_size, uint64_t num, uint32_t idx);

    inline JsOutput::ptr out_put_real(double r) {
        out_real = r;
        return this;
    }
    inline double out_get_real() const {
        return out_real;
    }

    inline JsOutput::ptr out_put_num(uint64_t num) {
        out_num = num;
        return this;
    }
    inline uint64_t out_get_num() const {
        return out_num;
    }
    inline uint64_t *out_get_num_arr(uint32_t *size) const {
        *size = out_arr_size;
        return out_ints;
    }

    JsOutput::ptr  out_new_str(size_t size);
    JsOutput::ptr  out_set_str(char *str);
    JsOutput::ptr  out_put_str(const char *str);
    inline char *out_get_str() const {
        return out_str;
    }

    JsOutput::ptr  out_new_str_arr(int elm);
    JsOutput::ptr  out_set_str_arr(char **str, uint32_t size);
    JsOutput::ptr  out_put_str_arr(char *str, int idx);
    inline char **out_get_str_arr(uint32_t *size) const
    {
        *size = out_str_arr_size;
        return out_str_arr;
    }

  protected:
    bo::intrusive_ptr<JsManager> out_mgr;
    bo::intrusive_ptr<JsBase>    out_jobj;

    json_t                  *out_json;
    char                    *out_str;
    char                   **out_str_arr;
    double                   out_real;

    uint64_t                 out_num;
    uint64_t                *out_ints;
    uint32_t                 out_arr_size;
    uint32_t                 out_str_arr_size;

    JsOutput();
    virtual ~JsOutput();
};

struct JsDecodeIter
{
    const JsDecode          *js_ref;
    int                      js_idx;

    const JsDecode *iter_next();
};

class JsDecode
{
  public:
    virtual ~JsDecode();
    JsDecode(const char *const key);
    JsDecode(const char *const key, const JsDecode *const *curr, const JsDecode *up);

    /**
     * @return object with enough memory to hold data for the json obj.
     */
    virtual bo::intrusive_ptr<JsBase>
    js_alloc(bo::intrusive_ptr<JsBase> parent, bool has_id,
             const char *id, int idx, json_t *json) const;

    /**
     * @return the decoding obj that could be used to decode the keyword.
     */
    const JsDecode &js_get_decode(const char *key) const;

    /**
     * Iterator through decoder in this obj, all the way to upstream obj.
     */
    inline void iter_begin(JsDecodeIter *iter) const
    {
        iter->js_ref = this;
        iter->js_idx = 0;
    }

    /**
     * @return the key that this decoder knows how to parse.
     */
    inline const char *js_get_key() const {
        return js_key;
    }

    /**
     * @return the typename matching this decoder.
     */
    inline const char *const js_get_typename() const {
        return js_typename;
    }

  protected:
    friend struct JsDecodeIter;
    JsDecode(const char *const key, const char *const type,
             const JsDecode *const *curr, const JsDecode *up);

    const char *const        js_key;
    const char *const        js_typename;
    const JsDecode          *js_upstream;
    const JsDecode *const   *js_decode;
};

class JsBase : public Object
{
  public:
    OBJECT_COMMON_DEFS(JsBase);

    static JsBase::ptr
    js_decode(json_t *root, const char *key, int idx, bool get_all,
              JsBase::ptr parent, const JsDecode &decode,
              bo::intrusive_ptr<JsManager> mgr);

    virtual bool js_selftest();
    virtual void js_exec(const char *verb, JsOutput::ptr out);
    virtual void js_deref_all();
    virtual void js_init();
    virtual JsBase::ptr js_clone(JsBase::ptr parent, json_t *js, const char *id) const;

    /**
     * Get simple values out of json data.
     */
    const json_t *js_kv_obj(const char *key) const;
    const char   *js_kv_str(const char *key) const;
    double        js_kv_real(const char *key) const;
    bool          js_kv_bool(const char *key) const;
    int           js_kv_int(const char *key) const;
    uint64_t      js_kv_int64(const char *key) const;

    /**
     * Override values from json data.
     */
    void js_set_kv_obj(const char *key, json_t *json);
    void js_set_kv_str(const char *key, const char *str, bool own = false);
    void js_set_kv_real(const char *key, double val);
    void js_set_kv_int(const char *key, int val);
    void js_set_kv_int64(const char *key, uint64_t val);

    /**
     * @return number of objects for the key.
     *    0 : if this is not object/array.
     *    1 : if this is an object.
     *    > 1 : size of the array.
     */
    int js_kv_obj_count(const char *key) const;

    JsBase::ptr
    js_kv_obj(const char *key, int idx, const bo::intrusive_ptr<JsManager>) const;

    /**
     * Iterate for each array type identified by the key.
     */
    int js_array_foreach(const char *k,
            bool (*fn)(JsBase::ptr self, uint32_t idx, uint32_t cnt, const char *val));

    int js_array_foreach(const char *k,
            bool (*fn)(JsBase::ptr self, uint32_t idx, uint32_t cnt, int val));

    int js_array_foreach(const char *k,
            bool (*fn)(JsBase::ptr self, uint32_t idx, uint32_t cnt, double val));

    int js_array_foreach(const char *k,
            const bo::intrusive_ptr<JsManager>,
            bool (*fn)(JsBase::ptr self, uint32_t idx, uint32_t cnt, JsBase::ptr elm));

    /**
     * @return id name of the obj.
     */
    inline const char *const js_get_id() const {
        return js_id_name;
    }
    inline const json_t *js_get_json() const {
        return js_data;
    }

    /**
     * Invoke the object with a verb.
     */
    inline JsOutput::ptr js_invoke(const char *verb)
    {
        JsOutput::ptr out = js_alloc_output();
        js_exec(verb, out);
        return out;
    }

    /**
     * Get attribute object associated with a key.
     */
    JsBase::ptr
    js_get_attr(bo::intrusive_ptr<JsManager> mgr,
                const char *key, bool has_id, int idx = -1) const;

    void js_dump() const;
    virtual void js_barrier() {};
    pthread_mutex_t *js_get_lock() const;

  protected:
    friend class JsManager;

    json_t                  *js_data;
    const char *const        js_id_name;
    JsBase::ptr              js_parent;

    virtual ~JsBase();
    JsBase(JsBase::ptr parent, bool has_id, const char *id, int idx, json_t *json);

    virtual void js_cleanup();
    virtual void js_selfclone();
    virtual JsOutput::ptr js_alloc_output() const;

    virtual void
    js_decode_nested(json_t *root, const JsDecode &, bo::intrusive_ptr<JsManager> mgr);

    virtual void
    js_decode_all(json_t *root, const char *key,
                  const JsDecode &, bo::intrusive_ptr<JsManager> mgr);

    JsBase::ptr
    js_get_json(const bo::intrusive_ptr<JsManager> mgr,
                const char *key, const json_t *elm, int idx) const;

    /**
     * This method may be called multiple times.  When overriding it, make sure it's
     * idempotent.
     */
    virtual bool
    js_check_symbols(const bo::intrusive_ptr<JsManager>, const JsDecode &decode);

    virtual bool
    js_check_resolve_symbols(const bo::intrusive_ptr<JsManager>, const JsDecode &) const;

    /**
     * Required for hash table.
     */
    const char *obj_keystr() const {
        return js_id_name;
    }
};

#define JSMANAGER_MOD                  "JsManager"

class JsManager : public Module
{
  public:
    OBJECT_COMMON_DEFS(JsManager);
    MODULE_COMMON_DEFS(JsManager, JSMANAGER_MOD);

    static const int name_size     = 256;
    static const int symb_tab_size = 1 << 10;
    static const int auto_gen_size = 1 << 16;
    static const int global_vars   = 1 << 10;

    /**
     * @return the default decoder.
     */
    static const JsDecode &js_def_decode();

    /**
     * Load raw json_t to build JsBase objects.
     */
    inline void js_process_json(json_t *root, const JsDecode &decode) {
        JsBase::js_decode(root, NULL, -1, true, NULL, decode, this);
    }

    inline void js_load_json(json_t *root, const JsDecode &decode) {
        JsBase::js_decode(root, NULL, -1, false, NULL, decode, this);
    }

    /**
     * Wrapper to load and run the file.
     */
    virtual void js_process_file(const char *file, const JsDecode &decode);
    virtual void js_run(const char *cmds[]);

    void js_dump_all();
    void js_unresolve_symb(JsBase::ptr obj, const char *field, const char *key);
    void js_load_file(const char *file, const JsDecode &decode, bool load);

    /**
     * Get/put object from/to global name space based on "idName".
     */
    void        js_put_autogen(JsBase::ptr obj);
    void        js_put_symb(JsBase::ptr obj);
    void        js_put_symb(JsBase::ptr obj, const char *key);

    JsBase::ptr js_get_symb(const char *id);
    JsBase::ptr js_get_autogen(const char *full_id);
    JsBase::ptr js_get_autogen(const char *id, uint32_t gen);
    JsBase::ptr js_get_symb(const JsDecode &root, const char *kw, const char *id);
    JsBase::ptr js_erase_symb(const char *id);
    JsBase::ptr js_erase_autogen(char *id, uint32_t gen);
   
    /**
     * Generate id for auto gen objs.
     */
    inline void js_autogen_id(const char *src, char *templ, uint32_t gen) const {
        snprintf(templ, JsManager::name_size, "%s-%u", src, gen);
    }

    /**
     * Main method to run command list.
     */
    virtual void js_run_objs(const char *cmds[]);

  protected:
    DHashObj                 js_symbol;
    DHashObj                 js_autogen;
    DListObj                 js_unresolved;
    JsonVariables::ptr       js_glob_vars;

    virtual ~JsManager();
    explicit JsManager(const char *mod = JSMANAGER_MOD);

    void js_do_init();
    void js_resolve_objs(const JsDecode &decode, bool resolved);
    void js_resolve_symbols(const JsDecode &decode);

    JsBase::ptr js_get_autogen_nolock(const char *id, uint32_t gen);

    void mod_shutdown() override;
};

#endif /* INCLUDE_JSON__JSON_OBJ_H_ */
