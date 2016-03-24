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
#include <json/json-app.h>

class CppJson : public JsBase
{
  public:
    OBJECT_COMMON_DEFS(CppJson);

    virtual void js_build_pod();
    virtual void js_exec(const char *verb, JsOutput::ptr out);

    const char *get_cpp_type() { return cpp_type_name; }
    const char *get_cpp_class() { return cpp_class_name; }

    void emit_class_guard(FILE *out);
    void emit_class_guard_end(FILE *out);

    void emit_struct(FILE *out);
    bool emit_struct_field(FILE *out, const char *key, const json_t *field);
    void emit_class(FILE *out);
    void emit_attr_fields(FILE *out, bool decl);
    void emit_class_impl(FILE *cpp, const char *parent);
    void emit_pod_code(FILE *out);
    void emit_pod_code_fmt(FILE *out, const json_t *val, int *cnt);
    void emit_pod_code_assign(FILE *out,
            const json_t *val, const char *key, int *cur, int end);

  protected:
    const char              *cpp_kw_name;
    bool                     cpp_has_pod;
    char                     cpp_type_name[JsManager::name_size];
    char                     cpp_class_name[JsManager::name_size];

    CppJson(JsBase::ptr parent, bool has_id, const char *id, int idx, json_t *json) :
        JsBase(parent, has_id, id, idx, json), cpp_kw_name(id), cpp_has_pod(false)
    {
        conv_field_name(js_id_name, cpp_type_name);
        conv_class_name(js_id_name, cpp_class_name);
    }

    static void conv_field_name(const char *in, char *out);
    static void conv_class_name(const char *in, char *out);

    inline void pad_space(FILE *out, int cur)
    {
        cur = cur > 35 ? 1 : 35 - cur;
        for (int i = 0; i < cur; i++) {
            fprintf(out, " ");
        }
    }
};

class CppDecode : public JsDecode
{
  public:
    CppDecode(const char *const key, const JsDecode *const *curr, const JsDecode *up) :
        JsDecode(key, curr, up) {}

    virtual JsBase::ptr
    js_alloc(JsBase::ptr pa, bool has_id, const char *id, int idx, json_t *json) const {
        return CppJson::alloc(pa, has_id, id, idx, json);
    }
};

static CppDecode s_cpp_base("*", nullptr, nullptr);

/**
 * js_exec
 * -------
 */
void
CppJson::js_exec(const char *verb, JsOutput::ptr out)
{
    JsBase::js_exec(verb, out);
}

/**
 * js_build_pod
 * ------------
 */
void
CppJson::js_build_pod()
{
}

/**
 * conv_field_name
 * ---------------
 */
void
CppJson::conv_field_name(const char *in, char *out)
{
    char       *dst;
    const char *src;

    /* Convert json name to C var. */
    for (src = in, dst = out; (*src != '\0') && (*src != ':'); src++) {
        if (*src == '-') {
            *dst++ = '_';
        } else {
            if (isupper(*src)) {
                *dst++ = '_';
            }
            *dst++ = tolower(*src);
        }
    }
    *dst = '\0';
    assert((dst - out) < JsManager::name_size);
}

/**
 * conv_class_name
 * ---------------
 */
void
CppJson::conv_class_name(const char *in, char *out)
{
    char       *dst;
    const char *src;

    /* Convert json name to C++ class name. */
    for (src = in, dst = out; (*src != '\0') && (*src != ':'); src++) {
        if ((*src == '-') || (*src == '_')) {
            for (; ((*src == '-') || (*src == '_')) && (*src != '\0'); src++);

            if (*src != '\0') {
                *dst++ = toupper(*src);
            }
        } else {
            if (src == in) {
                *dst++ = toupper(*src);
            } else {
                *dst++ = *src;
            }
        }
    }
    *dst = '\0';
    assert((dst - out) < JsManager::name_size);
}

/**
 * emit_class_guard
 * ----------------
 */
void
CppJson::emit_class_guard(FILE *out)
{
    fprintf(out,
            "#ifndef _JSON_%s__\n"
            "#define _JSON_%s__\n\n", cpp_class_name, cpp_class_name);
}

/**
 * emit_class_guard_end
 * --------------------
 */
void
CppJson::emit_class_guard_end(FILE *out)
{
    fprintf(out, "#endif /* _JSON_%s__ */\n\n", cpp_class_name);
}

/**
 * emit_struct
 * -----------
 */
void
CppJson::emit_struct(FILE *out)
{
    fpos_t      pos;
    json_t     *val;
    const char *key;
    int         field_count;

    fgetpos(out, &pos);
    fprintf(out,
            "/**\n"
            " * ---------------------------------------------------------------\n"
            " * Implement POD structure for json's %s section\n"
            " * ---------------------------------------------------------------\n"
            " */\n"
            "typedef struct %s %s_t;\n"
            "struct %s\n"
            "{\n", cpp_type_name, cpp_type_name,
            cpp_type_name, cpp_type_name);

    field_count = 0;
    json_object_foreach(js_data, key, val) {
        if (!json_is_object(val)) {
            if (emit_struct_field(out, key, val) == true) {
                field_count++;
            }
        }
    }
    if (field_count == 0) {
        fsetpos(out, &pos);
    } else {
        cpp_has_pod = true;
        fprintf(out, "};\n\n");
    }
}

/**
 * emit_struct_field
 * -----------------
 */
bool
CppJson::emit_struct_field(FILE *out, const char *key, const json_t *field)
{
    int   cur;
    bool  arr = false, has_data = true;;
    char  var[JsManager::name_size];

    if (json_is_array(field)) {
        arr   = true;
        const json_t *elm = json_array_get(field, 0);
        if (elm != nullptr) {
            field = elm;
        }
    }
    if ((sscanf(key, "${%s}", var) == 1) || (strcmp(key, "inlineCode") == 0)) {
        return false;
    }
    conv_field_name(key, var);

    switch (json_typeof(field)) {
    case JSON_STRING:
        cur = fprintf(out, "    char");
        if (arr == true) {
            pad_space(out, cur + 2);
            fprintf(out, "**%s;\n", var);
        } else {
            pad_space(out, cur + 1);
            fprintf(out, "*%s;\n", var);
        }
        break;

    case JSON_TRUE:
    case JSON_FALSE:
        cur = fprintf(out, "    bool");
        if (arr == true) {
            pad_space(out, cur + 1);
            fprintf(out, "*%s;\n", var);
        } else {
            pad_space(out, cur);
            fprintf(out, "%s;\n", var);
        }
        break;

    case JSON_INTEGER:
        cur = fprintf(out, "    uint32_t");
        if (arr == true) {
            pad_space(out, cur + 1);
            fprintf(out, "*%s;\n", var);
        } else {
            pad_space(out, cur);
            fprintf(out, "%s;\n", var);
        }
        break;

    case JSON_REAL:
        cur = fprintf(out, "    double");
        if (arr == true) {
            pad_space(out, cur + 1);
            fprintf(out, "*%s;\n", var);
        } else {
            pad_space(out, cur);
            fprintf(out, "%s;\n", var);
        }
        break;

    default:
        has_data = false;
        break;
    }
    return has_data;
}

/**
 * emit_class
 * ----------
 */
void
CppJson::emit_class(FILE *out)
{
    fprintf(out,
            "/**\n"
            " * Implement C++ object for json section %s\n"
            " */\n"
            "class %s : public JsBase\n"
            "{\n"
            "  public:\n"
            "    OBJECT_COMMON_DEFS(%s);\n\n"
            "    /**\n"
            "     * Provide implementation for these methods.\n"
            "     */\n"
            "    virtual void js_exec(const char *verb, JsOutput::ptr out) override;\n"
            "    virtual void js_init() override;\n"
            "    virtual bool js_selftest() override;\n\n",
            cpp_type_name, cpp_class_name, cpp_class_name);

    fprintf(out,
            "    virtual JsBase::ptr\n"
            "    js_clone(JsBase::ptr p, json_t *js, const char *id) const override\n"
            "    {\n"
            "        JsBase::ptr obj = %s::alloc(p, true, id, -1, js);\n"
            "        obj->js_init();\n"
            "        return obj;\n"
            "    }\n\n",
            cpp_class_name);

    emit_attr_fields(out, false);
    emit_attr_fields(out, true);

    fprintf(out, "  protected:\n");

    if (cpp_has_pod == true) {
        fprintf(out,
                "    %s_t *js_pod;\n\n"
                "    ~%s() {\n"
                "        if (js_pod != nullptr) {\n"
                "            free(js_pod);\n"
                "        }\n"
                "    }", cpp_type_name, cpp_class_name);
    }
    fprintf(out,
            "\n"
            "    %s(JsBase::ptr parent, bool has_id, const char *id, "
            "int idx, json_t *json) :\n"
            "        JsBase(parent, has_id, id, idx, json)",
            cpp_class_name);

    if (cpp_has_pod == true) {
        fprintf(out, ", js_pod(nullptr)");
    }
    fprintf(out, " {}\n\n");

    json_t *code = json_object_get(js_data, "inlineCode");
    if ((code != nullptr) && json_is_string(code)) {
        fprintf(out, "    %s\n", json_string_value(code));
    }

    fprintf(out,
            "};\n\n"
            "class %sDecode : public JsDecode\n"
            "{\n"
            "  public:\n"
            "    %sDecode(const char *const key, const JsDecode *const *curr,\n"
            "        const JsDecode *up) : "
            "JsDecode(key, typeid(%s).name(), curr, up) {}\n\n"
            "    virtual JsBase::ptr\n"
            "    js_alloc(JsBase::ptr pa, bool has_id,\n"
            "             const char *id, int idx, json_t *js) const override {\n"
            "        return %s::alloc(pa, has_id, id, idx, js);\n"
            "    }\n",
            cpp_class_name, cpp_class_name, cpp_class_name, cpp_class_name);

    if (cpp_has_pod == true) {
        emit_pod_code(out);
    }
    fprintf(out,
            "};\n\n"
            "extern const %sDecode g_%s_decode;\n\n",
            cpp_class_name, cpp_type_name);
}

/**
 * emit_attr_fields
 * ----------------
 */
void
CppJson::emit_attr_fields(FILE *out, bool decl)
{
#if 0
    bool        reset = true;
    fpos_t      pos;
    json_t     *cval;
    const char *ckey;

    fgetpos(out, &pos);
    if (decl == true) {
        fprintf(out, "    JsBase::ptr  js_attrs[0];\n");
    } else {
        fprintf(out,
                "    void js_deref_all() override\n"
                "    {\n"
                "        JsBase::js_deref_all();\n");
    }
    json_object_foreach(js_data, ckey, cval) {
        if (json_is_object(cval)) {
            reset = false;
            if (decl == true) {
                fprintf(out, "    JsBase::ptr  %s;\n", ckey);
            } else {
                fprintf(out, "        %s = nullptr;\n", ckey);
            }
        }
        if (!json_is_array(cval)) {
            continue;
        }
        if (json_is_object(json_array_get(cval, 0))) {
            reset = false;
            if (decl == true) {
                fprintf(out,
                        "    int          %s_cnt;\n"
                        "    JsBase::ptr *%s;\n", ckey, ckey);
            } else {
                fprintf(out,
                        "        if (%s != nullptr) {\n"
                        "            for (int i = 0; i < %s_cnt; i++) {\n"
                        "                %s[i] = nullptr;\n"
                        "            }\n"
                        "            delete [] %s;\n"
                        "            %s = nullptr;\n"
                        "        }\n",
                        ckey, ckey, ckey, ckey, ckey);
            }
        }
    }
    if (decl == true) {
        fprintf(out, "    JsBase::ptr  js_attrs_end[0];\n\n");
    } else {
        fprintf(out, "    }\n\n");
    }
    if (reset == true) {
        fsetpos(out, &pos);
    }
#endif
}

/**
 * emit_class_impl
 * ---------------
 */
void
CppJson::emit_class_impl(FILE *cpp, const char *parent)
{
    fprintf(cpp,
            "/**\n"
            " * ---------------------------------------------------------------\n"
            " * Implement for JSON %s object.\n"
            " * ---------------------------------------------------------------\n"
            " */\n", cpp_class_name);

    fprintf(cpp,
            "const %sDecode g_%s_decode(\"%s\", nullptr, &g_%s);\n\n",
            cpp_class_name, cpp_type_name, cpp_kw_name, parent);

    fprintf(cpp,
            "/**\n"
            " * js_exec\n"
            " * -------\n"
            " */\n"
            "void\n"
            "%s::js_exec(const char *verb, JsOutput::ptr out)\n"
            "{\n"
            "}\n\n"
            "/**\n"
            " * js_init\n"
            " * -------\n"
            " */\n"
            "void\n"
            "%s::js_init()\n"
            "{\n"
            "}\n\n"
            "/**\n"
            " * js_selftest\n"
            " * -----------\n"
            " */\n"
            "bool\n"
            "%s::js_selftest()\n"
            "{\n",
        cpp_class_name, cpp_class_name, cpp_class_name);

    if (cpp_has_pod == true) {
        fprintf(cpp,
                "    js_pod = %sDecode::js_make_pod(nullptr, js_data);\n"
                "    if (js_pod == nullptr) {\n"
                "        return false;\n"
                "    }\n",
                cpp_class_name);
    }
    fprintf(cpp,
            "    return true;\n"
            "}\n\n");
}

/**
 * emit_pod_code
 * -------------
 */
void
CppJson::emit_pod_code(FILE *out)
{
    int         end, cur;
    fpos_t      pos;
    json_t     *val;
    const char *key;

    fgetpos(out, &pos);
    fprintf(out,
            "\n"
            "    static %s_t *\n"
            "    js_make_pod(void *mem, json_t *json)\n"
            "    {\n"
            "        %s_t *pod = reinterpret_cast<%s_t *>\n"
            "                ((mem == nullptr) ? malloc(sizeof(*pod)) : mem);\n"
            "        memset(pod, 0, sizeof(*pod));\n"
            "        if (json_unpack(json, \"{\"\n",
            cpp_type_name, cpp_type_name, cpp_type_name);

    end = 0;
    json_object_foreach(js_data, key, val) {
        if (strcmp(key, "inlineCode") == 0) {
            continue;
        }
        emit_pod_code_fmt(out, val, &end);
    }
    if (end == 0) {
        fsetpos(out, &pos);
        return;
    }
    fprintf(out, "                             \"}\",\n");

    cur = 0;
    json_object_foreach(js_data, key, val) {
        if (strcmp(key, "inlineCode") == 0) {
            continue;
        }
        emit_pod_code_assign(out, val, key, &cur, end);
    }
    fprintf(out,
            "            if (mem == nullptr) {\n"
            "                free(pod);\n"
            "            }\n" 
            "            return nullptr;\n"
            "        }\n"
            "        return pod;\n"
            "    }\n");
}

/**
 * emit_pod_code_fmt
 * -----------------
 */
void
CppJson::emit_pod_code_fmt(FILE *out, const json_t *val, int *cnt)
{
    (*cnt)++;
    switch (json_typeof(val)) {
    case JSON_STRING:
        fprintf(out, "                             \"s:s \"\n");
        break;

    case JSON_TRUE:
    case JSON_FALSE:
        fprintf(out, "                             \"s:b \"\n");
        break;

    case JSON_INTEGER:
        fprintf(out, "                             \"s:i \"\n");
        break;

    case JSON_REAL:
        fprintf(out, "                             \"s:f \"\n");
        break;

    default:
        (*cnt)--;
        break;
    }
}

/**
 * emit_pod_code_assign
 * --------------------
 */
void
CppJson::emit_pod_code_assign(FILE *out,
        const json_t *val, const char *key, int *cur, int end)
{
    char var[JsManager::name_size];

    conv_field_name(key, var);
    switch(json_typeof(val)) {
    case JSON_STRING:
    case JSON_TRUE:
    case JSON_FALSE:
    case JSON_INTEGER:
    case JSON_REAL:
        (*cur)++;
        fprintf(out, "                             \"%s\", &pod->%s", key, var);

        if (*cur == end) {
            fprintf(out, ")) {\n");
        } else {
            fprintf(out, ",\n");
        }
        break;

    default:
        break;
    }
}

/**
 *
 */
class CppMgr : public JsManager
{
  public:
    OBJECT_COMMON_DEFS(CppMgr);
    MODULE_GET_INSTANCE(CppMgr, JSMANAGER_MOD);

    void cpp_translate(const char *file);

  protected:
    FILE                   *js_file;
    FILE                   *js_cpp;
    char                    cpp_hdr[JsManager::name_size];
    char                    cpp_src[JsManager::name_size];
    char                    cpp_incl[JsManager::name_size];
    char                    cpp_hdr_guard[JsManager::name_size];

    explicit CppMgr(const char *mod) : JsManager(mod), js_file(nullptr), js_cpp(nullptr) {}

    void emit_file(const char *in);
    void emit_header();
    void emit_forward_decl();
    void emit_root_decode();
    void emit_footer();
};

/**
 * cpp_translate
 * -------------
 */
void
CppMgr::cpp_translate(const char *file)
{
    emit_file(file);
    js_file = fopen(file, "w");
    js_cpp = fopen(cpp_src, "w");

    if ((js_file == nullptr) || (js_cpp == nullptr)) {
        printf("Failed to open file %s for output\n", file);
        perror("Reason: ");
        exit(255);
    }
    emit_header();
    emit_root_decode();
    emit_forward_decl();
    for (auto it : js_symbol) {
        CppJson::ptr obj = object_cast<CppJson>(it);
        obj->emit_class_guard(js_file);
        obj->emit_struct(js_file);
        obj->emit_class(js_file);
        obj->emit_class_impl(js_cpp, cpp_hdr);
        obj->emit_class_guard_end(js_file);
    }
    emit_footer();
    fclose(js_cpp);
    fclose(js_file);
}

/**
 * emit_file
 * ---------
 */
void
CppMgr::emit_file(const char *in)
{
    char *f = cpp_hdr;
    char *s = cpp_src;
    char *h = cpp_incl;
    char *g = cpp_hdr_guard;

    *g++ = '_';
    for (; *in != '\0'; in++) {
        *s++ = *in;
        switch (*in) {
        case '/':
            f = cpp_hdr;
            h = cpp_incl;
            /* fall through */

        case '.':
        case '-':
            if (*(g - 1) != '_') {
                *g++ = '_';
            }
            if (*in != '/') {
                *h++ = *in;
                if (*in == '.') {
                    *f++ = '\0';
                }  else {
                    *f++ = '_';
                }
            }
            break;

        default:
            *f++ = *in;
            *h++ = *in;
            *g++ = toupper(*in);
            break;
        }
    }
    for (; s != cpp_src && *s != '.'; s--);
    s++;
    *s++ = 'c';
    *s++ = 'p';
    *s++ = 'p';
    *g++ = '_';
    *f = *g = *s = *h = '\0';

    assert((s - cpp_src) < JsManager::name_size);
    assert((f - cpp_hdr) < JsManager::name_size);
    assert((g - cpp_hdr_guard) < JsManager::name_size);
}

/**
 * emit_header
 * -----------
 */
void
CppMgr::emit_header()
{
    FILE *out[] = { js_file, js_cpp, nullptr };

    for (int i = 0; out[i] != nullptr; i++) {
        fprintf(out[i],
    "/*\n"
    " * Copyright (C) 2014-2015 Vy Nguyen\n"
    " * Github https://github.com/vy-nguyen/c-libraries\n"
    " *\n"
    " * Redistribution and use in source and binary forms, with or without\n"
    " * modification, are permitted provided that the following conditions\n"
    " * are met:\n"
    " *\n"
    " * 1. Redistributions of source code must retain the above copyright\n"
    " *    notice, this list of conditions and the following disclaimer.\n"
    " * 2. Redistributions in binary form must reproduce the above copyright\n"
    " *    notice, this list of conditions and the following disclaimer in the\n"
    " *    documentation and/or other materials provided with the distribution.\n"
    " *\n"
    " * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND\n"
    " * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\n"
    " * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE\n"
    " * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE\n"
    " * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\n"
    " * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS\n"
    " * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)\n"
    " * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT\n"
    " * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY\n"
    " * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF\n"
    " * SUCH DAMAGE.\n"
    " *\n"
    " * !!! DO NOT EDIT !!! This code is auto generate  !!! DO NOT EDIT !!!\n"
    " */\n");
    }
    fprintf(js_file,
            "#ifndef _JSON%s\n"
            "#define _JSON%s\n\n"
            "#include <json/json-unit.h>\n\n"
            "namespace jsunit {\n\n",
            cpp_hdr_guard, cpp_hdr_guard);

    fprintf(js_cpp,
            "#include <%s>\n\n"
            "namespace jsunit {\n\n", cpp_incl);
}

/**
 * emit_footer
 * -----------
 */
void
CppMgr::emit_footer()
{
    char pad[1024];

    memset(pad, ' ', sizeof(pad));
    pad[sizeof(pad) - 1] = '\0';
    fprintf(js_file,
            "extern const JsDecode g_%s;\n\n"
            "} /* namespace */\n"
            "#endif /* _JSON%s */\n%s", cpp_hdr, cpp_hdr_guard, pad);

    fprintf(js_cpp, "\n} /* namespace */\n");
}

/**
 * emit_root_decode
 * ----------------
 */
void
CppMgr::emit_root_decode()
{
    fprintf(js_cpp,
            "const JsDecode *const gl_%s[] = \n"
            "{\n", cpp_hdr);

    for (auto it : js_symbol) {
        CppJson::ptr clazz = object_cast<CppJson>(it);
        fprintf(js_cpp, "    &g_%s_decode,\n", clazz->get_cpp_type());
    }
    fprintf(js_cpp,
            "    nullptr\n"
            "};\n\n"
            "const JsDecode g_%s(\"*\", gl_%s, &JsManager::js_def_decode());\n\n",
            cpp_hdr, cpp_hdr);
}

/**
 * emit_forward_decl
 * -----------------
 */
void
CppMgr::emit_forward_decl()
{
    for (auto it : js_symbol) {
        CppJson::ptr clazz = object_cast<CppJson>(it);
        fprintf(js_file, "class %s;\n", clazz->get_cpp_class());
    }
    fprintf(js_file, "\n");
}

/**
 * App obj
 */
class App : public JsonApp
{
  public:
    App(int argc, char **argv, Module::ptr mods[]) : JsonApp(argc, argv, mods) {}

    int run() override;
};

int
App::run()
{
    CppMgr::ptr mgr = CppMgr::getInstance();

    mgr->js_load_file(in_file, s_cpp_base, false);
    mgr->cpp_translate(out_file);
    return 0;
}

int main(int argc, char **argv)
{
    Module::ptr mods[] = {
        ThreadPool::alloc("SysPool", 2, 8, 3, -1),
        Trace::alloc(2048),
        CppMgr::alloc(JSMANAGER_MOD),
        nullptr
    };
    App app(argc, argv, mods);
    const struct option app_opts[] = {
        STD_LOPTS,
        { "in",                required_argument, nullptr,     'i' },
        { "out",               required_argument, nullptr,     'o' },
        { nullptr,                0,                 nullptr,     0 }
    };
    app.prog_reg_opt(STD_SOPTS "vi:o:", app_opts);
    return app.prog_run();
}
