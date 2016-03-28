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
#ifndef _INCLUDE_UTIL_LOGGER_H_
#define _INCLUDE_UTIL_LOGGER_H_

#include <string>
#include <queue>
#include <stdarg.h>
#include <di/program.h>
#include <cpptype/intrusive-ptr.h>

class LogModule;

#define LOGGER_ATTR(s, i)          __attribute__((format(__printf__, s, i)))
#define LOGGER_STATIC_DECL(id)     static Logger id(__FILE__)
#define LOG_MODULE                 "LoggerMain"

class Logger
{
  public:
    enum level {
        lvl_finner  = 0,
        lvl_debug   = 1,
        lvl_info    = 2,
        lvl_warn    = 3,
        lvl_error   = 4,
        lvl_severe  = 5,
        lvl_fatal   = 6,
        lvl_max
    };
    static const char *const l_finner;
    static const char *const l_info;
    static const char *const l_debug;
    static const char *const l_warn;
    static const char *const l_error;
    static const char *const l_severe;
    static const char *const l_fatal;

    static const char *const norm;
    static const char *const red;
    static const char *const green;
    static const char *const yellow;
    static const char *const blue;
    static const char *const magenta;
    static const char *const cyan;
    static const char *const white;
    static const char *const reset;

    ~Logger();
    Logger(const char *const file) : l_file(file), l_mod(nullptr) {}

    /**
     * Append the color and fmt to existing *out string.
     */
    static void color(std::string *out, const char *const color,
                      const char *fmt, ...) LOGGER_ATTR(3,4);

    /**
     * log info event.
     */
    void info(const char *fmt, ...) LOGGER_ATTR(2,3)
    {
        va_list args;
        va_start(args, fmt);
        log(lvl_info, fmt, args);
        va_end(args);
    }

    /**
     * log debug/finner event.
     */
    void debug(const char *fmt, ...) LOGGER_ATTR(2,3)
    {
        va_list args;
        va_start(args, fmt);
        log(lvl_debug, fmt, args);
        va_end(args);
    }
    void finner(const char *fmt, ...) LOGGER_ATTR(2,3)
    {
        va_list args;
        va_start(args, fmt);
        log(lvl_finner, fmt, args);
        va_end(args);
    }

    /**
     * log warning event.
     */
    void warn(const char *fmt, ...) LOGGER_ATTR(2,3)
    {
        va_list args;
        va_start(args, fmt);
        log(lvl_warn, fmt, args);
        va_end(args);
    }

    /**
     * log error event.
     */
    void error(const char *fmt, ...) LOGGER_ATTR(2,3)
    {
        va_list args;
        va_start(args, fmt);
        log(lvl_error, fmt, args);
        va_end(args);
    }

    /**
     * log severe event.
     */
    void severe(const char *fmt, ...) LOGGER_ATTR(2,3)
    {
        va_list args;
        va_start(args, fmt);
        log(lvl_severe, fmt, args);
        va_end(args);
    }

    /**
     * log fatal event.
     */
    void fatal(const char *fmt, ...) LOGGER_ATTR(2,3)
    {
        va_list args;
        va_start(args, fmt);
        log(lvl_fatal, fmt, args);
        va_end(args);
    }

  protected:
    const char *const             l_file;
    bo::intrusive_ptr<LogModule>  l_mod;

    int  tag_prefix(char *buf, int lim, const char *const lvl);
    void log(level l, const char *fmt, va_list args);
    void format(const char *const l, std::string *out, const char *fmt,va_list args);
};

class LogModule : public Module
{
  public:
    OBJECT_COMMON_DEFS(LogModule);
    MODULE_COMMON_DEFS(LogModule, LOG_MODULE);

    static const int def_buf_size = 256;

    Logger::level get_log_level() {
        return l_level;
    }
    std::string *get_buffer();
    void         log_buffer(std::string *buff);

  protected:
    friend class Logger;
    friend class LogTask;

    FILE                        *l_io;
    Logger::level                l_level;
    Task::ptr                    l_task;
    std::queue<std::string *>    l_freebuf;
    std::queue<std::string *>    l_pending;
    pthread_mutex_t              l_mtx;

    LogModule(const char *mod) :
        mod_name(mod), l_io(nullptr), l_level(Logger::lvl_debug), l_task(nullptr) {}
    ~LogModule();

    void flush_logs();
    void flush_buffer(std::string *buf);
    void mod_init() override;
    void mod_enable_service() override;
    void mod_cleanup() override;
};

#endif /* _INCLUDE_UTIL_LOGGER_H_ */
