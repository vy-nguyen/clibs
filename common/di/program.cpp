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
#include <stdio.h>
#include <stdarg.h>
#include <janson/jansson.h>

#include <di/program.h>

int         Program::p_verbose;
int         Program::p_help_flag;
const char *Program::p_logfile;
const char *Program::p_cfgfile;

Program *gl_program;

/**
 * Common command line arguments for getopt_long call
 */
Program::Program(int argc, char **argv, Module::ptr *mods) :
    p_argc(argc), p_argv(argv), p_sopt(nullptr), p_lopt(nullptr),
    p_module(nullptr), p_trace(nullptr), p_thpool(nullptr), p_config(NULL)
{
    assert(gl_program == nullptr);
    p_module   = Module::alloc(mods);
    gl_program = this;
}

Program::~Program()
{
    assert(gl_program != nullptr);
    p_module   = nullptr;
    gl_program = nullptr;
    json_decref(p_config);
}

int
Program::prog_run()
{
    /* Process command line options. */
    prog_process_opt();

    prog_internal_init();
    prog_pre_init();
    p_module->mod_init();

    /* Resolve phase, inject dependencies using module id or name. */
    p_module->mod_resolve();

    /* Startup sequence. */
    prog_pre_startup();
    p_module->mod_startup();

    prog_pre_enable_services();
    p_module->mod_enable_service();

    int ret = run();

    /* Shutdown sequence. */
    prog_pre_disable_services();
    p_module->mod_disable_service();

    prog_pre_shutdown();
    p_module->mod_shutdown();

    prog_pre_cleanup();
    p_module->mod_cleanup();

    return ret;
}

void Program::prog_pre_init() {}
void Program::prog_pre_cleanup() {}
void Program::prog_pre_startup() {}
void Program::prog_pre_shutdown() {}

void Program::prog_pre_enable_services() {}
void Program::prog_pre_disable_services() {}

/**
 * prog_internal_init
 * ------------------
 */
void
Program::prog_internal_init()
{
    /* Index known modules. */
    int dep_cnt = p_module->m_dep_cnt;
    const Module::ptr *mods = p_module->m_dep_idx;
    for (int i = 0; i < dep_cnt; i++) {
        if (strcmp(mods[i]->obj_keystr(), MOD_TRACE) == 0) {
            p_trace = object_cast<Trace>(mods[i]);
            continue;
        }
        if (strcmp(mods[i]->obj_keystr(), MOD_SYS_THPOOL) == 0) {
            p_thpool = object_cast<ThreadPool>(mods[i]);
            continue;
        }
    }
    if (p_cfgfile != NULL) {
    }
}

/**
 * prog_process_opt
 * ----------------
 */
void
Program::prog_process_opt()
{
    int c;

    while (1) {
        int opt_idx = 0;
        c = getopt_long(p_argc, p_argv, p_sopt, p_lopt, &opt_idx);
        if (c == -1) {
            break;
        }
        switch (c) {
        case 0:
            if (p_lopt[opt_idx].flag != nullptr) {
                /* The option already sets a flag. */
                break;
            }
            prog_opt_fn(p_lopt + opt_idx, optarg, c, opt_idx, optind);
            break;

        case 'c':
            p_cfgfile = (const char *)optarg;
            break;

        case 'l':
            p_logfile = (const char *)optarg;
            break;

        default:
            prog_opt_fn(nullptr, optarg, c, opt_idx, optind);
            break;
        }
    }
    if (optind < p_argc) {
        prog_print_usage();
    }
    if (p_cfgfile != nullptr) {
        json_error_t err;
        size_t       flag = JSON_DECODE_ANY;

        p_config = json_load_file(p_cfgfile, flag, &err);
        if (p_config == nullptr) {
            printf("Error in config file: [line %d, col %d] %s\n",
                   err.line, err.column, err.text);
            exit(1);
        }
    }
}

/**
 * prog_opt_fn
 * -----------
 */
void
Program::prog_opt_fn(const struct option *opt,
                     void *optarg,
                     int   flag,
                     int   idx,
                     int   optidx)
{
    if (opt != nullptr) {
        printf("Flag %d: name %s value %p, idx %d, opt_idx %d\n",
               flag, opt->name, optarg, idx, optidx);
    } else {
        printf("Flag %c: value %p, idx %d, opt_idx %d\n", flag, optarg, idx, optidx);
    }
}

void
Program::prog_reg_opt(const char *opt, const struct option *lopt)
{
    p_sopt = opt;
    p_lopt = lopt;
}

/**
 * prog_print_usage
 * ----------------
 */
void
Program::prog_print_usage()
{
    printf("Usage: %s [--log|-l log-file] [--config|-c conf-file] [--debug|-d]\n"
           "       [--help|-h] [--verbose|-v]\n", p_argv[0]);
}

/**
 * prog_module
 * -----------
 */
Module::ptr
Program::prog_module(const char *name) const
{
    if (p_module != nullptr) {
        return p_module->mod_get(name);
    }
    return nullptr;
}

Module::ptr
Program::prog_module(uint32_t id) const
{
    if (p_module != nullptr) {
        return p_module->mod_get(id);
    }
    return nullptr;
}

Module::ptr
Program::prog_module_index(int idx) const
{
    if (p_module != nullptr) {
        return p_module->mod_get_index(idx);
    }
    return nullptr;
}

/**
 * prog_reg_module
 * ---------------
 */
void
Program::prog_reg_module(Module::ptr mod)
{
    if (p_module != nullptr) {
        p_module->mod_register(mod);
    }
}

void
Program::prog_unreg_module(Module::ptr mod)
{
    if (p_module != nullptr) {
        p_module->mod_unregister(mod);
    }
}

/**
 * to_string
 * ---------
 */
size_t
Program::to_string(char *str, size_t len) const
{
    size_t off = 0;

    for (int i = 0; i < p_argc; i++) {
        auto lim = len - off;
        auto ret = snprintf(str + off, lim, "%s ", p_argv[i]);

        off += ret;
        if (ret >= lim) {
            return len;
        }
    }
    auto lim = len - off;
    auto ret = snprintf(str + off, lim, "\nModule list\n");

    off += ret;
    if (ret >= lim) {
        return len;
    }
    off += p_module->to_string(str + off, len - off);
    return off;
}

/**
 * prog_set_kv_root
 * ----------------
 */
void
Program::prog_set_kv_root(json_t *json)
{
    if (p_config != nullptr) {
        json_decref(p_config);
    }
    p_config = json;
    json_incref(p_config);
}

/**
 * prog_kv_str
 * -----------
 */
const char *
Program::prog_kv_str(const json_t *json, const char *key) const
{
    if (key != nullptr) {
        auto *sub = json_object_get(json, key);
        if (sub == nullptr) {
            return nullptr;
        }
        json = sub;
    }
    if (json_is_string(json)) {
        return json_string_value(json);
    }
    return nullptr;
}

/**
 * prog_kv_int
 * -----------
 */
int
Program::prog_kv_int(const json_t *json, const char *key) const
{
    if (key != nullptr) {
        auto *sub = json_object_get(json, key);
        if (sub == nullptr) {
            return 0;
        }
        json = sub;
    }
    if (json_is_integer(json)) {
        return json_integer_value(json);
    }
    return 0;
}

/**
 * prog_kv_bool
 * ------------
 */
bool
Program::prog_kv_bool(const json_t *json, const char *key) const
{
    if (key != nullptr) {
        auto *sub = json_object_get(json, key);
        if (sub == nullptr) {
            return false;
        }
        json = sub;
    }
    if (json_is_boolean(json)) {
        return json_boolean_value(json);
    }
    return false;
}

/**
 * prog_kv_int64
 * -------------
 */
uint64_t
Program::prog_kv_int64(const json_t *json, const char *key) const
{
    if (key != nullptr) {
        auto *sub = json_object_get(json, key);
        if (sub == nullptr) {
            return 0;
        }
        json = sub;
    }
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
 * prog_get_json_top
 * -----------------
 */
const json_t *
Program::prog_get_json_top(const json_t *root,
        const char *key, size_t size, const char **next) const
{
    const char *s = key;
    char *p, query[size + 1];

    for (p = query; *s != '\0' && *s != '.'; *p++ = *s++);
    *p = '\0';

    *next = (*s == '.') ? s + 1: nullptr;
    return json_object_get(root, query);
}

/**
 * prog_get_json_end
 * -----------------
 */
const json_t *
Program::prog_get_json_end(const json_t *root, const char *key) const
{
    size_t       size = strlen(key);
    const char   *next_key;
    const json_t *next_json;

    while (true) {
        next_json = prog_get_json_top(root, key, size, &next_key);
        if (next_key == nullptr) {
            return next_json;
        }
        root = next_json;
        key  = next_key;
    }
}

/**
 * setup_lockstep
 * --------------
 */
void
Program::setup_lockstep(int cnt, const uint32_t mod_ids[], ...)
{
}
