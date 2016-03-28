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
#ifndef _INCLUDE_JSON_JSON_PLUGIN_H_
#define _INCLUDE_JSON_JSON_PLUGIN_H_

#include <string>
#include <foss/janson/jansson.h>

#include <cpptype/object.h>
#include <cpptype/hash-obj.h>

class VarSubst;

/**
 * List of common plugin objects.
 */
class JsonVariables : public Object
{
  public:
    OBJECT_COMMON_DEFS(JsonVariables);

    void js_var_add(const char *var, const char *value);
    void js_process(json_t *root);
    void js_dump();

    inline const VarSubst *const js_var_lookup(const char *var) {
        return reinterpret_cast<const VarSubst *const>(js_var_map.value(var));
    }

  protected:
    StringKvMap js_var_map;

    virtual ~JsonVariables();
    explicit JsonVariables(int size = 1024) : js_var_map(size) {}

    void js_build_dict(const json_t *const root);
    void js_subst_dict(json_t *root, const char *key, json_t *elm);
    void js_subst_var(json_t *root, const char *key, json_t *elm);
};

class VarSubst
{
  public:
    ~VarSubst();
    explicit VarSubst(const json_t *const json);

    /**
     * Parse variable keyword.
     * id = "abc def ${a} ... "
     *               ^   ^
     *               |   |
     *              ret  +- end
     */
    static const char *
    js_var_kw(const char *id, const char **end);

    static json_t *
    js_subst_str(JsonVariables::ptr dict, const char *in);

    const char *to_string() const {
        return json_string_value(js_subst);
    }

  protected:
    const json_t *const js_subst;

    void js_append_val(std::string &str) const;
};

#endif /* _INCLUDE_JSON_JSON_PLUGIN_H_ */
