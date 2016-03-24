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
#include <di/logger.h>
#include <unit-test-def.h>
#include <json/json-unit.h>

LOGGER_STATIC_DECL(s_log);
namespace jsunit {

/**
 * ---------------------------------------------------------------
 * Implement for JSON Root object.
 * ---------------------------------------------------------------
 */
const RootDecode g_root_decode("root", nullptr, &g_unit_test_def);

/**
 * js_exec
 * -------
 */
void
Root::js_exec(const char *verb, JsOutput::ptr out)
{
    printf("------------------- Root exec %s\n", name());
}

/**
 * js_init
 * -------
 */
void
Root::js_init()
{
}

/**
 * js_selftest
 * -----------
 */
bool
Root::js_selftest()
{
    return true;
}

/**
 * ---------------------------------------------------------------
 * Implement for JSON RangeSpec object.
 * ---------------------------------------------------------------
 */
const RangeSpecDecode g_range_spec_decode("rangeSpec", nullptr, &g_unit_test_def);

class DataGenParam : public JsOutput
{
  public:
    OBJECT_COMMON_DEFS(DataGenParam);

    inline void gen_set_field_name(const char *name) {
        g_field_name = name;
    }
    inline const char *gen_get_field_name() {
        return g_field_name;
    }

  protected:
    const char *g_field_name;

    DataGenParam() : g_field_name(nullptr) {}
};

static char *js_gen_rand_str(size_t len, bool seq = false)
{
    static const char alphanum[] =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    char *s = new char[len + 1];
    for (int i = 0; i < len; ++i) {
        if (seq == true) {
            s[i] = alphanum[i % sizeof(alphanum)];
        } else {
            s[i] = alphanum[rand() % (sizeof(alphanum) - 1)];
        }
    }
    s[len] = 0;
    return s;
}

/**
 * js_gen_rand_int
 * ---------------
 */
static uint64_t js_gen_rand_int(uint64_t min, uint64_t max)
{
    return (min + (rand() % (max - min)));
}

/**
 * js_get_gen_ops
 * --------------
 */
static int
js_get_gen_ops(const json_t *ops, const json_t *pct,
               const char ***js_ops, uint32_t **js_pct_ops, int *js_cur_op)
{
    int i;
    size_t ops_cnt = json_array_size(ops);
    size_t pct_cnt = json_array_size(pct);
    int js_ops_cnt = MIN(ops_cnt, pct_cnt);

    *js_cur_op  = -1;
    *js_ops     = new const char * [js_ops_cnt + 1];
    *js_pct_ops = new uint32_t [js_ops_cnt + 1];

    for (i = 0; i < js_ops_cnt; i++) {
        const json_t *elm = json_array_get(pct, i);
        (*js_pct_ops)[i] = json_integer_value(elm);

        if (i > 0) {
            (*js_pct_ops)[i] += (*js_pct_ops)[i - 1];
        }
    }
    (*js_pct_ops)[i] = 0;

    for (i = 0; i < js_ops_cnt; i++) {
        const json_t *elm = json_array_get(ops, i);
        (*js_ops)[i] = json_string_value(elm);
    }
    (*js_ops)[i] = nullptr;
    return js_ops_cnt;
}

/**
 * js_get_gen_op
 * -------------
 */
static int
js_get_gen_op(const char **ops, const uint32_t *pct, int size, int *cur_op)
{
    if (ops == nullptr || pct == nullptr) {
        return -1;
    }
    (*cur_op)++;
    for (int i = 0; i < size; i++) {
        assert(ops[i] != nullptr);
        if (*cur_op < pct[i]) {
            return i;
        }
    }
    (*cur_op) = -1;
    return size - 1;
}

/**
 * js_gen_number
 * -------------
 */
void
RangeSpec::js_gen_number(JsOutput::ptr out, int order, const char *fname, int slot)
{
    uint64_t v;
    int idx = js_get_gen_op(js_ops, js_pct_ops, js_ops_cnt, &js_cur_op);

    if (idx < 0 || idx >= js_ops_cnt) {
        out->out_put_num(0);
        return;
    }
    if (strncmp(js_ops[idx], "random", sizeof("random")) == 0) {
        v = js_gen_random();

    } else if (strncmp(js_ops[idx], "sequential", sizeof("sequential")) == 0) {
        v = js_gen_sequential();

    } else if (strncmp(js_ops[idx], "butterfly", sizeof("butterfly")) == 0) {
        v = js_gen_butterfy();

    } else if (strncmp(js_ops[idx], "useMin", sizeof("useMin")) == 0) {
        v = js_pod->min_value;

    } else if (strncmp(js_ops[idx], "useMax", sizeof("useMax")) == 0) {
        v = js_pod->max_value;

    } else {
        out->out_put_num(0);
        auto obj = js_mgr->js_get_symb(js_ops[idx]);
        if (obj == nullptr) {
            s_log.error("Unknown range op %s", js_ops[idx]);
            return;
        }
        auto driver = dynamic_cast<TestDriver *>(obj.get());
        if (driver == nullptr) {
            s_log.error("Range spec %s must be TestDriver type", js_ops[idx]);
            return;
        }
        v = driver->gen_range_num(order, fname);
        if (v == 0) {
            /* Don't want to generate any value, terminate the clone. */
            out->out_put_num(ULLONG_MAX);
            out->out_set_str(nullptr);
            return;
        }
    }
    if (v == ULLONG_MAX) {
        v--;
    }
    if (slot < 0) {
        out->out_put_num(v);
    } else {
        out->out_put_num(v, slot);
    }
}

/**
 * js_exec
 * -------
 */
void
RangeSpec::js_exec(const char *verb, JsOutput::ptr out)
{
    if (out == nullptr) {
        s_log.error("Call rangeSpec %s w/out args", js_get_id());
        return;
    }
    DataGenParam::ptr args = dynamic_cast<DataGenParam *>(out.get());
    assert(args != nullptr);

    int order = args->out_get_num();
    const char *fname = args->gen_get_field_name();

    if ((js_pod->gen_count == 0) || (js_pod->gen_count == 1)) {
        js_gen_number(out, order, fname, -1);
    } else {
        out->out_put_num_arr(js_pod->gen_count, 0, 0);
        for (int i = 0; i < js_pod->gen_count; i++) {
            js_gen_number(out, order, fname, i);
        }
    }
}

/**
 * js_init
 * -------
 */
void
RangeSpec::js_init()
{
    json_t *ops = json_object_get(js_data, "genOps");
    json_t *pct = json_object_get(js_data, "percentageOps");

    js_mgr = JsManager::getInstance();
    js_pod = RangeSpecDecode::js_make_pod(nullptr, js_data);
    if ((js_pod == nullptr) || !json_is_array(ops) || !json_is_array(pct)) {
        return;
    }
    js_gen_num = 0;
    js_ops_cnt = js_get_gen_ops(ops, pct, &js_ops, &js_pct_ops, &js_cur_op);
    if (js_ops_cnt <= 0) {
        return;
    }
    js_pod->gen_ops = const_cast<char **>(js_ops);
    js_pod->percentage_ops = js_pct_ops;

    if (js_pod->max_value < js_pod->min_value) {
        uint32_t tmp = js_pod->max_value;
        js_pod->max_value = js_pod->min_value;
        js_pod->min_value = tmp;
    }
    js_range_val = js_pod->max_value - js_pod->min_value;
}

/**
 * js_cleanup
 * ----------
 */
void
RangeSpec::js_cleanup()
{
    js_mgr = nullptr;
    if (js_ops != nullptr) {
        delete [] js_ops;
    }
    if (js_pct_ops != nullptr) {
        delete [] js_pct_ops;
    }
}

/**
 * js_selftest
 * -----------
 */
bool
RangeSpec::js_selftest()
{
    int err = 0;
    json_t *ops = json_object_get(js_data, "genOps");
    json_t *pct = json_object_get(js_data, "percentageOps");

    if (!json_is_array(ops) || !json_is_array(pct)) {
        err++;
        printf("Error: %s expects array type in "
               "'genOps' or 'percentageOps'\n", js_get_id());
    }
    if (js_ops_cnt <= 0) {
        err++;
        printf("Error: %s requires 'genOps' and 'percentageOps'.\n", js_get_id());
    }
    if (js_pod == nullptr) {
        err++;
        printf("Error: %s format is different from static template\n", js_get_id());
    }
    if (err == 0) {
        return true;
    }
    return false;
}

/**
 * js_gen_random
 * -------------
 */
uint64_t
RangeSpec::js_gen_random()
{
    return js_pod->min_value + (random() % js_range_val);
}

/**
 * js_gen_sequential
 * -----------------
 */
uint64_t
RangeSpec::js_gen_sequential()
{
    if (js_pod->min_value < js_gen_num && js_gen_num > js_pod->max_value) {
        js_gen_num = js_pod->min_value;
    }
    return js_gen_num++;
}

/**
 * js_gen_butterfy
 * ---------------
 */
uint64_t
RangeSpec::js_gen_butterfy()
{
    if (js_pod->min_value < js_gen_num && js_gen_num > js_pod->max_value) {
        js_gen_num = js_pod->min_value;
    }
    js_gen_num++;
    uint32_t half = js_range_val >> 1;
    if (js_gen_num > half) {
        js_gen_num = js_gen_num - half;
    } else if (js_gen_num < half) {
        js_gen_num = js_gen_num + half;
    }
    return js_gen_num;
}

/**
 * js_gen_min
 * ----------
 */
uint64_t
RangeSpec::js_gen_min()
{
    return js_pod->min_value;
}

/**
 * js_gen_max
 * ----------
 */
uint64_t
RangeSpec::js_gen_max()
{
    return js_pod->max_value;
}

/**
 * convert_or_gen_int
 * ------------------
 * Convert the string to number of gen a number based on spec.
 */
static uint64_t
convert_or_gen_int(const char *num, int order, const char *fname)
{
    uint64_t n = strtoull(num, nullptr, 0);
    if (n != 0) {
        return n;
    }
    auto ptr = num;
    for (; *ptr != '\0' && isspace(*ptr); ptr++);
    if (*ptr == '0') {
        return 0;
    }
    JsBase::ptr obj = JsManager::getInstance()->js_get_symb(num);
    RangeSpec::ptr range = dynamic_cast<RangeSpec *>(obj.get());

    if (range == nullptr) {
        printf("Invalid range-spec id: %s, return 0\n", num);
        return 0;
    }
    DataGenParam::ptr out = DataGenParam::alloc();
    out->out_put_num(order);
    out->gen_set_field_name(fname);
    range->js_exec(nullptr, out);

    return out->out_get_num();
}

/**
 * ---------------------------------------------------------------
 * Implement for JSON ContentSpec object.
 * ---------------------------------------------------------------
 */
const ContentSpecDecode
g_content_spec_decode("contentSpec", nullptr, &g_unit_test_def);

/**
 * js_exec
 * -------
 */
void
ContentSpec::js_exec(const char *verb, JsOutput::ptr out)
{
    if (out == nullptr) {
        return;
    }
    int idx = js_get_gen_op(js_ops, js_pct_ops, js_ops_cnt, &js_cur_op);
    if (idx < 0 || idx >= js_ops_cnt) {
        s_log.error("Invaid index range %d/%d to ContentSpec %s",
                    idx, js_ops_cnt, js_get_id());
        return;
    }
    DataGenParam::ptr args = dynamic_cast<DataGenParam *>(out.get());
    if (args == nullptr) {
        s_log.error("Wrong argument type to ContentSpec %s", js_get_id());
        return;
    }
    int order = args->out_get_num();
    auto name = args->gen_get_field_name();
    auto size = convert_or_gen_int(js_pod->data_size, order, name);

    if (strncmp(js_ops[idx], "random", sizeof("random")) == 0) {
        out->out_set_str(js_gen_rand_str(size));

    } else if (strncmp(js_ops[idx], "sequential", sizeof("sequential")) == 0) {
        out->out_set_str(js_gen_rand_str(size, true));

    } else if (strncmp(js_ops[idx], "dup", sizeof("dup")) == 0) {
        if (js_pod->src_file == nullptr) {
            return;
        }
        int len = strlen(js_pod->src_file);
        char *s = new char [size + 1];
        for (int i = 0; i < size; i++) {
            s[i] = js_pod->src_file[i % len];
        }
        s[size] = '\0';
        out->out_set_str(s);

    } else {
        char *s = new char [size + 1];
        auto obj = js_mgr->js_get_symb(js_ops[idx]);
        auto driver = dynamic_cast<TestDriver *>(obj.get());

        if (driver != nullptr) {
            auto sz = driver->gen_content_str(order, name, s, size);
            assert(sz <= size);
            if (sz == 0) {
                /* Don't want to generate any more string, terminate the clone. */
                out->out_set_str(nullptr);
                out->out_put_num(ULLONG_MAX);
                delete [] s;
                return;
            }
            size = sz;
        } else {
            if (obj == nullptr) {
                s_log.error("Unknown content op %s", js_ops[idx]);
            } else {
                s_log.error("Content spec %s must be TestDriver type", js_ops[idx]);
            }
            for (int i = 0; i < size; i++) {
                if (js_pod->src_file != nullptr) {
                    s[i] = js_pod->src_file[0];
                } else {
                    s[i] = 'A';
                }
            }
        }
        s[size] = '\0';
        out->out_set_str(s);
    }
}

/**
 * js_init
 * -------
 */
void
ContentSpec::js_init()
{
    const json_t *ops = json_object_get(js_data, "genOps");
    const json_t *pct = json_object_get(js_data, "percentageOps");

    js_mgr = JsManager::getInstance();
    js_ops_cnt = js_get_gen_ops(ops, pct, &js_ops, &js_pct_ops, &js_cur_op);
    js_pod = ContentSpecDecode::js_make_pod(nullptr, js_data);
}

void
ContentSpec::js_cleanup()
{
    js_mgr = nullptr;
    if (js_ops != nullptr) {
        delete [] js_ops;
    }
    if (js_pct_ops != nullptr) {
        delete [] js_pct_ops;
    }
}

/**
 * js_selftest
 * -----------
 */
bool
ContentSpec::js_selftest()
{
    const char *id = js_get_id();
    if (js_pod == nullptr) {
        printf("Error: %s format is different from the template.\n", id);
        return false;
    }
    if (js_ops_cnt <= 0) {
        printf("Error: %s requires 'genOps' and 'percentageOps' options.\n", id);
        return false;
    }
    return true;
}

/**
 * ---------------------------------------------------------------
 * Implement for JSON ObjData object.
 * ---------------------------------------------------------------
 */
const ObjDataDecode g_obj_data_decode("objData", nullptr, &g_unit_test_def);

/**
 * js_exec
 * -------
 */
void
ObjData::js_exec(const char *verb, JsOutput::ptr out)
{
    uint32_t cnt;
    json_t *val = nullptr;
    json_t *set = out->out_get_json();

    assert(set != nullptr);
    cnt = js_kv_int("arrayElm");
    if (js_content != nullptr) {
        if (cnt == 0) {    
            js_content->js_exec(verb, out);
            auto v = out->out_get_str();
            if (v != nullptr) {
                val = json_string(v);
            }
        } else {
            val = json_array();
            for (uint32_t i = 0; i < cnt; i++) {
                js_content->js_exec(verb, out);
                auto v = out->out_get_str();
                if (v != nullptr) {
                    json_array_append_new(val, json_string(v));
                } else {
                    json_decref(val);
                    return;
                }
            }
        }
        if (val != nullptr) {
            json_object_set_new(set, js_field_name, val);
            return;
        }
    }
    if (js_range != nullptr) {
        if (cnt == 0) {
            js_range->js_exec(verb, out);
            auto n = out->out_get_num();
            if (n == ULLONG_MAX) {
                return;
            }
            val = json_integer(out->out_get_num());
        } else {
            val = json_array();
            for (uint32_t i = 0; i < cnt; i++) {
                js_range->js_exec(verb, out);
                auto n = out->out_get_num();
                if (n != ULLONG_MAX) {
                    json_array_append_new(val, json_integer(n));
                } else {
                    json_decref(val);
                    return;
                }
            }
        }
        if (val != nullptr) {
            json_object_set_new(set, js_field_name, val);
        }
    }
}

/**
 * js_init
 * -------
 */
void
ObjData::js_init()
{
    js_field_name = js_kv_str("field");

    JsManager::ptr mgr = JsManager::getInstance();
    js_content = js_kv_obj("contentSpec", -1, mgr);
    js_range = js_kv_obj("rangeSpec", -1, mgr);
}

/**
 * js_selftest
 * -----------
 */
bool
ObjData::js_selftest()
{
    if (js_field_name == nullptr) {
        printf("ObjData %s must have 'field' name keyword\n", js_get_id());
        return false;
    }
    if ((js_content == nullptr) && (js_range == nullptr)) {
        printf("ObjData %s must have 'contentSpec' or 'rangeSpec'\n", js_get_id());
        return false;
    }
    return true;
}

/**
 * js_js_rand_str_json
 * -------------------
 */
static json_t *js_gen_rand_str_json(size_t len)
{
    char *s = js_gen_rand_str(len);
    json_t *ret = json_string(s);

    delete [] s;
    return ret;
}

/**
 * js_gen_rand_int_json
 * --------------------
 */
static json_t *js_gen_rand_int_json(uint64_t min, uint64_t max)
{
    if (max < min) {
        uint32_t tmp = max;
        max = min;
        min = tmp;
    }
    return json_integer(js_gen_rand_int(min, max));
}

/**
 * js_gen_rand_real
 * ----------------
 */
static json_t *js_gen_rand_real(double min, double max)
{
    if (max < min) {
        double tmp = max;
        max = min;
        min = tmp;
    }
    double factor = static_cast<double>(RAND_MAX / (max - min));
    return json_real(min + static_cast<double>(rand()) / factor);
}

/**
 * ---------------------------------------------------------------
 * Implement for JSON ObjSpec object.
 * ---------------------------------------------------------------
 */
const ObjSpecDecode g_obj_spec_decode("objSpec", nullptr, &g_unit_test_def);

/**
 * js_new_json
 * -----------
 */
static json_t *
js_clone_json(const char *id, int order, json_t *root,
              const json_t *ref, ObjData::ptr *fields, int fcnt, JsManager::ptr mgr)
{
    bool           skip;
    json_t        *gen, *val;
    const char    *key;
    DataGenParam::ptr  out = DataGenParam::alloc();

    out->out_put_mgr(mgr);
    json_object_foreach(const_cast<json_t *>(ref), key, val) {
        skip = false;
        for (int i = 0; i < fcnt; i++) {
            if (strcmp(key, fields[i]->js_field_name) == 0) {
                skip = true;
                out->out_put_json(root);
                out->out_put_num(order);
                out->gen_set_field_name(key);
                fields[i]->js_exec(nullptr, out);

                /* Signal termination of the clone. */
                if ((out->out_get_str() == nullptr) &&
                    (out->out_get_num() == ULLONG_MAX)) {
                    json_decref(root);
                    return nullptr;
                }
                break;
            }
        }
        if (skip == true) {
            continue;
        }
        gen = nullptr;
        switch (json_typeof(val)) {
        case JSON_STRING:
            gen = js_gen_rand_str_json(strlen(json_string_value(val)));
            break;

        case JSON_INTEGER:
            gen = js_gen_rand_int_json(0, json_integer_value(val));
            break;

        case JSON_REAL:
            gen = js_gen_rand_real(0.0, json_real_value(val));
            break;

        case JSON_TRUE:
        case JSON_FALSE:
            gen = val;
            break;

        default:
            break;
        }
        if (gen != nullptr) {
            json_object_set_new(root, key, gen);
        }
    }
    return root;
}

/**
 * js_exec
 * -------
 */
void
ObjSpec::js_exec(const char *verb, JsOutput::ptr out)
{
    const JsManager::ptr mgr = JsManager::getInstance();
    obj_spec_t mem, *spec;

    spec = ObjSpecDecode::js_make_pod(&mem, js_data);
    if (spec == nullptr) {
        printf("ObjSpec %s: can't parse json from known template.\n", js_get_id());
        return;
    }
    JsBase::ptr parent = js_kv_obj("objParent", -1, mgr);
    JsBase::ptr ref_obj = js_kv_obj("objType", -1, mgr);
    if ((ref_obj == nullptr) || (parent == nullptr)) {
        printf("Can not find reference object %s or %s\n",
               spec->obj_type, spec->obj_parent);
        return;
    }
    size_t len = strlen(spec->obj_id_fmt);
    if (len >= JsManager::name_size - 10) {
        printf("Template name %s is too long (%d max)\n",
               spec->obj_id_fmt, JsManager::name_size);
        return;
    }
    int i, count = js_kv_obj_count("objData");
    ObjData::ptr *fields = new ObjData::ptr[count + 1];

    for (i = 0; i < count; i++) {
        fields[i] = object_cast<ObjData>(js_kv_obj("objData", i, mgr));
    }
    fields[i] = nullptr;
    const json_t *ref = ref_obj->js_get_json();
    char id_templ[JsManager::name_size];

    auto lim = spec->id_end_seq;
    if (lim <= 0) {
        lim = spec->id_beg_seq + 0xffffff;
    } else if (lim < spec->id_beg_seq) {
        printf("Object spec %s: invalid range [%d %d]\n",
               js_get_id(), spec->id_beg_seq, lim);
        return;
    }
    for (uint32_t i = spec->id_beg_seq; i < lim; i++) {
        mgr->js_autogen_id(spec->obj_id_fmt, id_templ, i);
        json_t *js = js_clone_json(id_templ, i, json_object(), ref, fields, count, mgr);

        if (js == nullptr) {
            lim = i;
            break;
        }
        JsBase::ptr clone = ref_obj->js_clone(parent, js, id_templ);
        mgr->js_put_autogen(clone);
        json_decref(js);
    }
    for (uint32_t i = spec->id_beg_seq; i < lim; i++) {
        JsBase::ptr obj = mgr->js_get_autogen(spec->obj_id_fmt, i);
        verify(obj != nullptr);
    }
    for (i = 0; i < count; i++) {
        fields[i] = nullptr;
    }
    delete [] fields;
    ref_obj = nullptr;
    parent = nullptr;
}

/**
 * js_init
 * -------
 */
void
ObjSpec::js_init()
{
}

/**
 * js_selftest
 * -----------
 */
bool
ObjSpec::js_selftest()
{
    return true;
}

/**
 * ---------------------------------------------------------------
 * Implement for JSON Import object.
 * ---------------------------------------------------------------
 */
const ImportDecode g_import_decode("import", nullptr, &g_unit_test_def);

/**
 * js_import_iter
 * --------------
 */
bool
Import::js_import_iter(JsBase::ptr self, uint32_t idx, uint32_t all, const char *val)
{
    Import::ptr imp = object_cast<Import>(self);
    JsManager::ptr mgr = imp->js_mgr;
    const JsDecode *decode = imp->js_imp_decode;

    printf("Load import file %s\n", val);
    mgr->js_load_file(val, *decode, false);
    return true;
}

/**
 * js_exec
 * -------
 */
void
Import::js_exec(const char *verb, JsOutput::ptr out)
{
    if (js_imp_decode == nullptr) {
        /* already visited. */
        return;
    }
    js_array_foreach("json", Import::js_import_iter);
    js_imp_decode = nullptr;
}

/**
 * js_check_symbols
 * ----------------
 */
bool
Import::js_check_symbols(const JsManager::ptr mgr, const JsDecode &decode)
{
    if (js_mgr == nullptr) {
        js_mgr = mgr;
        js_imp_decode = &decode;
        mgr->js_unresolve_symb(this, nullptr, nullptr);
    }
    return true;
}

/**
 * js_init
 * -------
 */
void
Import::js_init()
{
    js_mgr = nullptr;
}

/**
 * js_cleanup
 * ----------
 */
void
Import::js_cleanup()
{
    js_mgr = nullptr;
}

/**
 * js_selftest
 * -----------
 */
bool
Import::js_selftest()
{
    return true;
}

/**
 * ---------------------------------------------------------------
 * Implement for JSON TestResource object.
 * ---------------------------------------------------------------
 */
const TestResourceDecode
g_test_resource_decode("testResource", nullptr, &g_unit_test_def);

/**
 * js_exec
 * -------
 */
void
TestResource::js_exec(const char *verb, JsOutput::ptr out)
{
    printf("------------- TestResource exec\n");
}

/**
 * js_init
 * -------
 */
void
TestResource::js_init()
{
}

/**
 * js_selftest
 * -----------
 */
bool
TestResource::js_selftest()
{
    return true;
}

/**
 * ---------------------------------------------------------------
 * Implement for JSON ExecRun object.
 * ---------------------------------------------------------------
 */
const ExecRunDecode g_exec_run_decode("execRun", nullptr, &g_unit_test_def);

/**
 * js_sequential_iter
 * ------------------
 */
bool
ExecRun::js_sequential_iter(JsBase::ptr self,
                            uint32_t idx, uint32_t all, const char *val)
{
    ExecRun::ptr exe = object_cast<ExecRun>(self);
    JsManager::ptr mgr = exe->js_mgr;
    char key[strlen(val) + 1], *verb;
    
    strcpy(key, val);
    for (verb = key; *verb != ':'; verb++) {
        if (*verb == '\0') {
            verb = nullptr;
            break;
        }
    }
    if (verb != nullptr) {
        *verb++ = '\0';
        for (; *verb != '\0' && isspace(*verb); verb++);
        if (*verb == '\0') {
            verb = nullptr;
        }
    }
    JsBase::ptr obj = mgr->js_get_symb(key);
    if (obj == nullptr) {
        printf("Don't have object id %s\n", key);
        return true;
    }
    obj->js_invoke(verb);
    return true;
}

/**
 * js_concurrent_iter
 * ------------------
 */
bool
ExecRun::js_concurrent_iter(JsBase::ptr self,
                            uint32_t idx, uint32_t all, const char *val)
{
    return true;
}

/**
 * js_exec
 * -------
 */
void
ExecRun::js_exec(const char *verb, JsOutput::ptr out)
{
    js_array_foreach("sequential", ExecRun::js_sequential_iter);
    js_array_foreach("concurrent", ExecRun::js_concurrent_iter);
}

/**
 * js_init
 * -------
 */
void
ExecRun::js_init()
{
    js_mgr = JsManager::getInstance();
}

/**
 * js_cleanup
 * ----------
 */
void
ExecRun::js_cleanup()
{
    js_mgr = nullptr;
}

/**
 * js_selftest
 * -----------
 */
bool
ExecRun::js_selftest()
{
    return true;
}

/**
 * ---------------------------------------------------------------
 * Implement for JSON Cpu object.
 * ---------------------------------------------------------------
 */
const CpuDecode g_cpu_decode("cpu", nullptr, &g_unit_test_def);

void
JsRequest::req_exec_task()
{
    js_run->js_invoke(js_verb);
}

/**
 * js_exec
 * -------
 */
void
Cpu::js_exec(const char *verb, JsOutput::ptr out)
{
    if (out == nullptr) {
        return;
    }
    JsBase::ptr obj = out->out_get_jobj();
    if (obj == nullptr) {
        return;
    }
    if (out->out_get_json_bool("barrier") == true) {
        char v[JsManager::name_size];

        snprintf(v, sizeof(v), "%s:%s", "end", verb);
        JsRequest::ptr req = JsRequest::alloc(obj, v, 0, 0);
        js_exe_pool->schedule_barrier(req, ThreadPool::fast_queue, 0);
    } else {
        JsRequest::ptr req = JsRequest::alloc(obj, verb, 0, 0);
        js_exe_pool->schedule(req, ThreadPool::fast_queue, 0);
    }
}

/**
 * js_init
 * -------
 */
void
Cpu::js_init()
{
    js_pod = CpuDecode::js_make_pod(nullptr, js_data);
    if (js_pod == nullptr) {
        return;
    }
    js_exe_pool = ThreadPool::alloc(js_get_id(),
            js_pod->min_thread, js_pod->max_thread, 0, -1);

    js_exe_pool->module_start();
    Program::singleton()->prog_reg_module(js_exe_pool);
}

/**
 * js_cleanup
 * ----------
 */
void
Cpu::js_cleanup()
{
    js_exe_pool = nullptr;
}

/**
 * js_selftest
 * -----------
 */
bool
Cpu::js_selftest()
{
    if (js_pod == nullptr) {
        printf("Cpu section %s data doesn't match with template\n", js_get_id());
        return false;
    }
    return true;
}

/**
 * ---------------------------------------------------------------
 * Implement for JSON RunSpec object.
 * ---------------------------------------------------------------
 */
const RunSpecDecode g_run_spec_decode("runSpec", nullptr, &g_unit_test_def);

/**
 * js_exec
 * -------
 */
void
RunSpec::js_exec(const char *verb, JsOutput::ptr out)
{
    if (out == nullptr) {
        return;
    }
    TestDriver::ptr driver = nullptr;
    JsManager::ptr mgr = JsManager::getInstance();

    if (js_pod->id_end_seq <= js_pod->id_beg_seq) {
        js_pod->id_end_seq = js_pod->id_beg_seq + 0xffffff;
    }
    if (js_obj_beg != nullptr) {
        driver = dynamic_cast<TestDriver *>(js_obj_beg.get());
        if (driver == nullptr) {
            s_log.error("Expect TestDriver type for id %s.  "
                        "Real type is %s, skip the test\n",
                        js_obj_beg->js_get_id(), js_obj_beg->obj_name());
            return;
        }
        driver->test_elm_exec = 0;
        driver->js_set_test_info(mgr,
                js_pod->obj_run, js_pod->id_beg_seq, js_pod->id_end_seq);

        char v[JsManager::name_size];
        snprintf(v, sizeof(v), "%s:%s", "begin", verb);
        js_obj_beg->js_exec(v, out);
    } else {
        s_log.warn("[%s] could not locate test driver %s, skip test.\n",
                   js_get_id(), js_kv_str("objRunBeg"));
        return;
    }
    for (int i = js_pod->id_beg_seq; i < js_pod->id_end_seq; i++) {
        JsBase::ptr obj = mgr->js_get_autogen(js_pod->obj_run, i);
        if (obj != nullptr) {
            TestElm::ptr elm = dynamic_cast<TestElm *>(obj.get());
            if ((elm != nullptr) && (driver != nullptr)) {
                elm->js_set_test_driver(driver);
            }
            driver->test_elm_exec++;
            if (js_cpu != nullptr) {
                JsOutput::ptr o = JsOutput::alloc()->out_put_jobj(obj);
                js_cpu->js_exec(verb, o);
            } else {
                obj->js_exec(verb, out);
            }
        } else {
            break;
        }
    }
    if (js_obj_end != nullptr) {
        if (js_cpu != nullptr) {
            out->out_put_jobj(js_obj_end)->out_put_json_field("barrier", true);
            js_cpu->js_exec(verb, out);
            js_obj_end->js_barrier();
        } else {
            char v[JsManager::name_size];

            snprintf(v, sizeof(v), "%s:%s", "end", verb);
            js_obj_end->js_exec(v, out);
        }
    }
}

/**
 * js_init
 * -------
 */
void
RunSpec::js_init()
{
    JsManager::ptr mgr = JsManager::getInstance();
    js_cpu = js_kv_obj("cpu", -1, mgr);
    js_obj_beg = js_kv_obj("objRunBeg", -1, mgr);
    js_obj_end = js_kv_obj("objRunEnd", -1, mgr);

    js_pod = RunSpecDecode::js_make_pod(nullptr, js_data);
}

/**
 * js_selftest
 * -----------
 */
bool
RunSpec::js_selftest()
{
    if (js_pod == nullptr) {
        printf("RunSpec %s has format different from the template\n", js_get_id());
        return false;
    }
    return true;
}

/**
 * js_cleanup
 * ----------
 */
void
RunSpec::js_cleanup()
{
    js_cpu = nullptr;
    js_obj_beg = nullptr;
    js_obj_end = nullptr;
}

/**
 * ---------------------------------------------------------------
 * Implement for JSON Memory object.
 * ---------------------------------------------------------------
 */
const MemoryDecode g_memory_decode("memory", nullptr, &g_unit_test_def);

/**
 * js_exec
 * -------
 */
void
Memory::js_exec(const char *verb, JsOutput::ptr out)
{
    printf("------------------- Memory exec\n");
}

/**
 * js_init
 * -------
 */
void
Memory::js_init()
{
}

/**
 * js_selftest
 * -----------
 */
bool
Memory::js_selftest()
{
    return true;
}

/**
 * ---------------------------------------------------------------
 * Implement for JSON Network object.
 * ---------------------------------------------------------------
 */
const NetworkDecode g_network_decode("network", nullptr, &g_unit_test_def);

/**
 * js_exec
 * -------
 */
void
Network::js_exec(const char *verb, JsOutput::ptr out)
{
    printf("------------------- Network exec\n");
}

/**
 * js_init
 * -------
 */
void
Network::js_init()
{
}

/**
 * js_selftest
 * -----------
 */
bool
Network::js_selftest()
{
    return true;
}

/**
 * ---------------------------------------------------------------
 * Implement for JSON Compare object.
 * ---------------------------------------------------------------
 */
const CompareDecode g_compare_decode("compare", nullptr, &g_unit_test_def);

/**
 * js_exec
 * -------
 */
void
Compare::js_exec(const char *verb, JsOutput::ptr out)
{
}

/**
 * js_init
 * -------
 */
void
Compare::js_init()
{
}

/**
 * js_selftest
 * -----------
 */
bool
Compare::js_selftest()
{
    return true;
}

/**
 * ---------------------------------------------------------------
 * Implement for JSON SourceJson object.
 * ---------------------------------------------------------------
 */
const SourceJsonDecode g_source_json_decode("sourceJson", nullptr, &g_unit_test_def);

/**
 * js_exec
 * -------
 */
void
SourceJson::js_exec(const char *verb, JsOutput::ptr out)
{
}

/**
 * js_init
 * -------
 */
void
SourceJson::js_init()
{
}

/**
 * js_selftest
 * -----------
 */
bool
SourceJson::js_selftest()
{
    return true;
}

/**
 * ---------------------------------------------------------------
 * Implement for TestElm, TestDriver
 * ---------------------------------------------------------------
 */
const TestElmDecode g_test_elm_decode("testElm", nullptr, &g_unit_test_def);
const TestDriverDecode g_test_driver_decode("testDriver", nullptr, &g_unit_test_def);

/**
 * js_exec
 * -------
 */
void
TestElm::js_exec(const char *verb, JsOutput::ptr out)
{
    TestDriver::ptr ctrl = dynamic_cast<TestDriver *>(js_parent.get());
    TestCase::ptr tc = js_get_test_case();

    assert(ctrl != nullptr);
    if (tc == nullptr) {
        tc = ctrl->js_get_test_case();
    }
    if (verb == nullptr) {
        if (tc != nullptr) {
            tc->run_def_verb(verb, this, out);
        } else {
            s_log.warn("Failed to find test case for [%s]\n", ctrl->js_get_id());
        }
        return;
    }
    const TestVerb *const exe = ctrl->js_get_verb(verb);
    if (exe != nullptr) {
        exe->run_verb(this, tc, out);
    } else {
        s_log.warn("Cannot find matching verb %s in %s\n", verb, js_id_name);
    }
}

/**
 * js_get_test_case
 * ----------------
 */
TestCase::ptr
TestElm::js_get_test_case()
{
    if (te_driver != nullptr) {
        return te_driver->js_get_test_case();
    }
    TestDriver::ptr ctrl = dynamic_cast<TestDriver *>(js_parent.get());
    if (ctrl != nullptr) {
        return ctrl->js_get_test_case();
    }
    return nullptr;
}

/**
 * obj_key64
 * ---------
 */
uint64_t
TestElm::obj_key64() const
{
    TestElm::ptr  ptr  = const_cast<TestElm *>(this);
    TestCase::ptr test = ptr->js_get_test_case();

    if (test != nullptr) {
        return test->obj_key64(ptr);
    }
    return reinterpret_cast<uint64_t>(this);
}

/**
 * obj_key_dlink
 * -------------
 * Wire up hash/compare functions to test case for customized plugins w/out changing
 * the base class.
 */
uint64_t
TestElm::obj_key_dlink(const ODlink *p) const
{
    TestElm::ptr  ptr  = const_cast<TestElm *>(this);
    TestCase::ptr test = ptr->js_get_test_case();

    if (test != nullptr) {
        return test->obj_key_dlink(ptr, p);
    }
    return 0;
}

/**
 * obj_hash_dlink
 * --------------
 */
int
TestElm::obj_hash_dlink(int size, const ODlink *p) const
{
    TestElm::ptr  ptr  = const_cast<TestElm *>(this);
    TestCase::ptr test = ptr->js_get_test_case();

    if (test != nullptr) {
        return test->obj_hash_dlink(ptr, size, p);
    }
    return 0;
}

/**
 * obj_compare_dlink
 * -----------------
 */
int
TestElm::obj_compare_dlink(const ODlink *p) const
{
    TestElm::ptr  ptr  = const_cast<TestElm *>(this);
    TestCase::ptr test = ptr->js_get_test_case();

    if (test != nullptr) {
        return test->obj_compare_dlink(ptr, p);
    }
    return 0;
}

/**
 * obj_key_slink
 * -------------
 */
uint64_t
TestElm::obj_key_slink(const OSlink *p) const
{
    TestElm::ptr  ptr  = const_cast<TestElm *>(this);
    TestCase::ptr test = ptr->js_get_test_case();

    if (test != nullptr) {
        return test->obj_key_slink(ptr, p);
    }
    return 0;
}

/**
 * obj_hash_slink
 * --------------
 */
int
TestElm::obj_hash_slink(int size, const OSlink *p) const
{
    TestElm::ptr  ptr  = const_cast<TestElm *>(this);
    TestCase::ptr test = ptr->js_get_test_case();

    if (test != nullptr) {
        return test->obj_hash_slink(ptr, size, p);
    }
    return 0;
}

/**
 * obj_compare_slink
 * -----------------
 */
int
TestElm::obj_compare_slink(const OSlink *p) const
{
    TestElm::ptr  ptr  = const_cast<TestElm *>(this);
    TestCase::ptr test = ptr->js_get_test_case();

    if (test != nullptr) {
        return test->obj_compare_slink(ptr, p);
    }
    return 0;
}

/**
 * js_exec
 * -------
 */
void
TestDriver::js_exec(const char *verb, JsOutput::ptr out)
{
    const char *v;

    if ((v = strstr(verb, "begin")) != nullptr) {
        if (test_inst != nullptr) {
            std::string hdr;
            Logger::color(&hdr, Logger::yellow,
                          "[ %s ...........]\n", test_inst->test_case);
            printf("%s", hdr.c_str());
            test_inst->begin_test_case(v, this, out);
            return;
        }
    } else if ((v = strstr(verb, "end")) != nullptr) {
        if (test_inst != nullptr) {
            test_inst->end_test_case(v, this, out);
            js_barrier();

            std::string hdr;
            Logger::color(&hdr, Logger::yellow,
                          "[ .......... %s ]\n", test_inst->test_case);
            printf("%s", hdr.c_str());
            return;
        }
    }
    s_log.warn("No test case for %s\n", verb);
}

/**
 * js_add_test_case
 * ----------------
 */
void
TestDriver::js_add_test_case(const TestVerb *const verbs[], TestCase::ptr inst)
{
    for (int i = 0; verbs[i] != nullptr; i++) {
        const void *rec = reinterpret_cast<const void *>(verbs[i]);
        verb_map.insert(verbs[i]->test_verb, const_cast<void *>(rec), false);
    }
}

/**
 * js_install_test
 * ---------------
 */
void
TestDriver::js_install_test(const TestVerb *const verbs[])
{
    for (int i = 0; test_cases[i] != nullptr; i++) {
        if (strcmp(js_id_name, test_cases[i]->test_case) == 0) {
            test_inst = test_cases[i];
            test_inst->setup_test_case(this);
            printf("Installed %s, %p\n", test_cases[i]->test_case, test_inst.get());
            break;
        }
    }
    js_add_test_case(verbs, nullptr);
}

/**
 * js_get_verb
 * -----------
 */
const TestVerb *const
TestDriver::js_get_verb(const char *verb)
{
    void *rec = verb_map.value(verb);
    if (rec != nullptr) {
        return reinterpret_cast<const TestVerb *const>(rec);
    }
    return nullptr;
}

/**
 * js_cleanup
 * ----------
 */
void
TestDriver::js_cleanup()
{
    if (test_inst != nullptr) {
        test_inst->cleanup_test_case(this);
    }
    test_inst = nullptr;
}

/**
 * js_iter_foreach_test_elm
 * ------------------------
 */
void
TestDriver::js_iter_foreach_test_elm()
{
    if (test_mgr == nullptr) {
        s_log.warn("[%s] need to call js_set_test_info first.\n", js_get_id());
        return;
    }
    for (int i = test_elm_beg; i < test_elm_end; i++) {
        if (js_foreach_call(test_elm_name, nullptr, i) == false) {
            break;
        }
    }
}

void
TestDriver::js_iter_foreach_test_elm(const char *driver_name)
{
    if (test_mgr == nullptr) {
        s_log.warn("[%s] need to call js_set_test_info first.\n", js_get_id());
        return;
    }
    JsBase::ptr obj = test_mgr->js_get_symb(driver_name);
    TestDriver::ptr driver = dynamic_cast<TestDriver *>(obj.get());
    if (driver == nullptr) {
        s_log.error("The type of %s must be TestDriver.  Skip iterator\n", driver_name);
        return;
    }
    for (int i = driver->test_elm_beg; i < driver->test_elm_end; i++) {
        if (js_foreach_call(test_elm_name, driver->test_elm_name, i) == false) {
            break;
        }
    }
}

bool
TestDriver::js_foreach_call(const char *mine, const char *other, int order)
{
    JsBase::ptr obj        = test_mgr->js_get_autogen(mine, order);
    TestElm::ptr mine_ptr  = dynamic_cast<TestElm *>(obj.get());
    TestElm::ptr other_ptr = nullptr;

    if (mine_ptr != nullptr) {
        if (other != nullptr) {
            obj       = test_mgr->js_get_autogen(other, order);
            other_ptr = dynamic_cast<TestElm *>(obj.get());
            if (other_ptr == mine_ptr) {
                other_ptr = nullptr;
                s_log.warn("Potential recursive call, iter over identical objects %s\n",
                           mine_ptr->js_get_id());
            }
        }
        return test_inst->apply_each_test_elm(this, mine_ptr, other_ptr);
    }
    return false;
}

/**
 * js_get_peer
 * -----------
 */
TestDriver::ptr
TestDriver::js_get_peer(const char *driver_name)
{
    if (test_mgr == nullptr) {
        test_mgr = JsManager::getInstance();
    }
    JsBase::ptr obj = test_mgr->js_get_symb(driver_name);
    return dynamic_cast<TestDriver *>(obj.get());
}

/**
 * js_set_test_info
 * ----------------
 */
void
TestDriver::js_set_test_info(JsManager::ptr mgr, const char *name, int beg, int end)
{
    test_mgr      = mgr;
    test_elm_name = name;
    test_elm_beg  = beg;
    test_elm_end  = end;
}

TestDriver::~TestDriver()
{
    test_mgr      = nullptr;
    test_elm_name = nullptr;
    verb_map.clear();
}

} /* namespace */
