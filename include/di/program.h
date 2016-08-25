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
#ifndef _DI_PROGRAM_H_
#define _DI_PROGRAM_H_

#include <getopt.h>
#include <di/log.h>
#include <di/module.h>
#include <di/request.h>
#include <cpptype/hash-obj.h>

class Program;
class Trace;
class ThreadPool;
struct json_t;
extern Program *gl_program;

class Program
{
  public:
    enum {
        max_cpus = 32
    };
    virtual ~Program();
    Program(int argc, char **argv, Module::ptr mods[]);

    /**
     * Main method to run the program, called in main.
     */
    int prog_run();

    /**
     * Process command line arguments.
     */
    virtual void prog_reg_opt(const char *opt, const struct option *lopt);
    virtual void prog_opt_fn(const struct option *, void *, int, int, int);

    /**
     * Startup sequence.
     */
    virtual void prog_pre_init();
    virtual void prog_pre_startup();
    virtual void prog_pre_enable_services();
    virtual int  run() = 0;
    virtual void prog_pre_disable_services();
    virtual void prog_pre_shutdown();
    virtual void prog_pre_cleanup();
    virtual void prog_print_usage();

    /**
     * Return the module maching the id/name.  The index method is more efficient
     * and should be used in performance critical path.
     */
    Module::ptr prog_module_index(int idx) const;
    Module::ptr prog_module(uint32_t id) const;
    Module::ptr prog_module(const char *name) const;
    void        prog_reg_module(Module::ptr mod);
    void        prog_unreg_module(Module::ptr mod);

    /**
     * Global config key/values from json config file to the program.
     */
    void        prog_set_kv_root(json_t *json);
    int         prog_kv_int(const json_t *json, const char *key) const;
    inline int  prog_kv_int(const char *key) const {
        return prog_kv_int(prog_get_json_end(p_config, key), nullptr);
    }

    bool        prog_kv_bool(const json_t *json, const char *key) const;
    inline bool prog_kv_bool(const char *key) const {
        return prog_kv_bool(prog_get_json_end(p_config, key), nullptr);
    }

    uint64_t        prog_kv_int64(const json_t *json, const char *key) const;
    inline uint64_t prog_kv_int64(const char *key) const {
        return prog_kv_int64(prog_get_json_end(p_config, key), nullptr);
    }

    const char        *prog_kv_str(const json_t *json, const char *key) const;
    inline const char *prog_kv_str(const char *key) const {
        return prog_kv_str(prog_get_json_end(p_config, key), nullptr);
    }

    inline const json_t *prog_kv_sub_cfg(const char *key) const {
        return prog_get_json_end(p_config, key);
    }

    /**
     * Example call:
     * prog->setup_lockstep(3,
     *      { ModuleA::obj_id(), ModuleB::obj_id(), 0 },
     *      { ModuleD::obj_id(), ModuleF::obj_id(), ModuleG::obj_id(), 0 },
     *      { ModuleZ::obj_id(), ModuleX::obj_id(), ModuleY::obj_id(), 0 });
     */
    void setup_lockstep(int cnt, const uint32_t mod_ids[], ...);

    /**
     * Get well-known module or modules by name or id.
     */
    static inline Program *singleton() {
        return gl_program;
    }
    static inline char **prog_args(int *argc) {
        *argc = Program::singleton()->p_argc;
        return Program::singleton()->p_argv;
    }
    static inline Module::ptr module(const char *name) {
        return Program::singleton()->prog_module(name);
    }
    static inline Module::ptr module(uint32_t id) {
        return Program::singleton()->prog_module(id);
    }
    static inline Module::ptr module_idx(int idx) {
        return Program::singleton()->prog_module_index(idx);
    }
    static inline ThreadPool::ptr thpool() {
        return Program::singleton()->p_thpool;
    }
    static inline Trace::ptr trace() {
        return Program::singleton()->p_trace;
    }

    /**
     * Dump content of this object to the given char.
     */
    size_t to_string(char *str, size_t len) const;

    static int               p_verbose;
    static int               p_help_flag;
    static const char       *p_cfgfile;
    static const char       *p_logfile;

  protected:
    int                      p_argc;
    char                   **p_argv;
    const char              *p_sopt;
    const struct option     *p_lopt;
    
  private:
    Module::ptr              p_module;
    Trace::ptr               p_trace;
    ThreadPool::ptr          p_thpool;
    json_t                  *p_config;

    void prog_internal_init();
    void prog_process_opt();

    const json_t *prog_get_json_end(const json_t *root, const char *key) const;

    const json_t *
    prog_get_json_top(const json_t *, const char *, size_t, const char **next) const;
};

/**
 * Common command line arguments for getopt_long call
 */
extern const char         *gl_std_sopts;
extern const struct option gl_std_lopts[];

/**
 * Names of well-known modules.
 */
#define MOD_TRACE                "SysTrace"
#define MOD_SYS_THPOOL           "SysPool"

/**
 * Common command line arguments for getopt_long call
 */
#define STD_SOPTS                "l:d:c:h"
#define STD_LOPTS                                                          \
    { "log",            required_argument, nullptr,               'l' },   \
    { "config",         required_argument, nullptr,               'c' },   \
    { "debug",          required_argument, nullptr,               'd' },   \
    { "help",           no_argument,       &Program::p_help_flag,  1  },   \
    { "verbose",        no_argument,       &Program::p_verbose,    1  }

/**
 * -------------------------------------------------------------------------------------
 * Module Mixin, avoid multiple inheritance.
 * -------------------------------------------------------------------------------------
 */
#define MODULE_MIXIN_GET_INSTANCE(Type, name)                                          \
    static inline Type *getInstance() {                                                \
        return ModuleMixin::getInstance(name);                                         \
    }

template <class T>
class ModuleMixin : public Module
{
  public:
    OBJECT_COMMON_DEFS(ModuleMixin);

    static T *getInstance(const char *name)
    {
        auto mod = object_cast<ModuleMixin>(Program::singleton()->module(name));
        return &mod->mod_mixin;
    }

  protected:
    const char *const mod_name;
    T                 mod_mixin;

    ModuleMixin(const char *name) : mod_name(name) {}

    template <class... Args>
    ModuleMixin(const char *name, Args... args) : mod_name(name), mod_mixin(args...) {}

    const char *obj_keystr() const override {
        return mod_name;
    }
    /*
     * Wire up module's methods to the mixin type.
     */
    void mod_init() override            { mod_mixin.mod_init();    }
    void mod_startup() override         { mod_mixin.mod_startup(); }
    void mod_enable_service() override  { mod_mixin.mod_enable_service();  }
    void mod_disable_service() override { mod_mixin.mod_disable_service(); }
    void mod_shutdown() override        { mod_mixin.mod_shutdown(); }
    void mod_cleanup() override         { mod_mixin.mod_cleanup();  }
};

#endif  // _DI_PROGRAM_H_
