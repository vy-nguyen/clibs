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
#include <sched.h>
#include <boost/filesystem.hpp>
#include <util/fs.h>
#include <di/logger.h>
#include <di/module.h>

auto const Logger::l_finner = "[FINNR]";
auto const Logger::l_info   = "[INFO ]";
auto const Logger::l_debug  = "[DEBUG]";
auto const Logger::l_warn   = "[WARN ]";
auto const Logger::l_error  = "[ERROR]";
auto const Logger::l_severe = "[SEVEV]";
auto const Logger::l_fatal  = "[FATAL]";

auto const Logger::norm     = "\x1B[0m";
auto const Logger::red      = "\x1B[31m";
auto const Logger::green    = "\x1B[32m";
auto const Logger::yellow   = "\x1B[33m";
auto const Logger::blue     = "\x1B[34m";
auto const Logger::magenta  = "\x1B[35m";
auto const Logger::cyan     = "\x1B[36m";
auto const Logger::white    = "\x1B[37m";
auto const Logger::reset    = "\033[0m";

static const char *const st_levels_map[] =
{
    Logger::l_finner, Logger::l_debug,   Logger::l_info,
    Logger::l_warn,   Logger::l_error,  Logger::l_severe,
    Logger::l_fatal,  nullptr
};

Logger::~Logger() {}

void
Logger::color(std::string *out, const char *const color, const char *fmt, ...)
{
    auto lim = LogModule::def_buf_size;
    auto off = out->length();

    out->resize(off + lim);
    va_list args;
    va_start(args, fmt);
    va_end(args);

    auto *buf = &(*out)[off];
    auto  ret = snprintf(buf, lim, "%s", color);

    off += ret;
    ret  = vsnprintf(buf + off, lim - ret - sizeof(Logger::reset) - 1, fmt, args);
    off += ret;
    ret  = snprintf(buf + off, sizeof(Logger::reset) + 1, "%s", Logger::reset);
    out->resize(off + ret);
}

/**
 * tag_prefix
 * ----------
 */
int
Logger::tag_prefix(char *buf, int lim, const char *const lvl)
{
    time_t     rt = time(nullptr);
    struct tm  tm;
    pthread_t  id = pthread_self();

    localtime_r(&rt, &tm);
    return snprintf(buf, lim, "%02d/%02d-%02d:%02d:%02d [%02d-%06x] [%-15.15s] %s ",
                    tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec,
                    sched_getcpu(), (uint32_t)id, l_file, lvl);
}

void
Logger::log(level l, const char *fmt, va_list args) 
{
    std::string   *buf;

    if (l_mod == nullptr) {
        l_mod = LogModule::getInstance();
    }
    if (l_mod != nullptr) {
        auto lvl = l_mod->get_log_level();
        if (l < lvl || l >= Logger::lvl_max) {
            return;
        }
        buf = l_mod->get_buffer();
    } else {
        if (l < Logger::lvl_info || l >= Logger::lvl_max) {
            return;
        }
        buf = new std::string(LogModule::def_buf_size, '\0');
        buf->resize(0);
    }
    format(st_levels_map[l], buf, fmt, args);

    if (l_mod != nullptr) {
        l_mod->log_buffer(buf);
    } else {
        printf("%s", buf->c_str());
    }
}

/**
 * format
 * ------
 */
void
Logger::format(const char *const l, std::string *out, const char *fmt, va_list args)
{
    int   len, off;
    int   lim = LogModule::def_buf_size;
    char *buf = &(*out)[0];

    out->resize(lim);
    len = tag_prefix(buf, lim, l);
    assert(len < lim);

    lim = lim - len;
    off = vsnprintf(buf + len, lim, fmt, args);
    if (off < lim) {
        len += off;
    } else {
        len += lim;
    }
    out->resize(len);
}

class LogTask : public Task
{
  public:
    OBJECT_COMMON_DEFS(LogTask);

    void task_handler() override {
        log_module->flush_logs();
    }

  protected:
    LogModule    *log_module;

    LogTask(ThreadPool::ptr pool, LogModule *mod) : Task(pool), log_module(mod) {}
};

LogModule::~LogModule()
{
    while (!l_freebuf.empty()) {
        auto *buf = l_freebuf.front();
        l_freebuf.pop();
        delete buf;
    }
}

/**
 * get_buffer
 * ----------
 */
std::string *
LogModule::get_buffer()
{
    std::string *buf = nullptr;

    pthread_mutex_lock(&l_mtx);
    if (!l_freebuf.empty()) {
        buf = l_freebuf.front();
        l_freebuf.pop();
    }
    pthread_mutex_unlock(&l_mtx);

    if (buf == nullptr) {
        buf = new std::string(LogModule::def_buf_size, '\0');
    }
    return buf;
}

/**
 * log_buffer
 * ----------
 */
void
LogModule::log_buffer(std::string *buf)
{
    pthread_mutex_lock(&l_mtx);
    l_pending.push(buf);
    pthread_mutex_unlock(&l_mtx);

    l_task->task_submit();
}

/**
 * flush_logs
 * ----------
 */
void
LogModule::flush_logs()
{
    std::queue<std::string *> local;
    std::queue<std::string *> frbuf;

    pthread_mutex_lock(&l_mtx);
    l_pending.swap(local);
    pthread_mutex_unlock(&l_mtx);

    while (!local.empty()) {
        auto *buf = local.front();
        local.pop();
        flush_buffer(buf);
        frbuf.push(buf);
    }
    if (!frbuf.empty()) {
        pthread_mutex_lock(&l_mtx);
        while (!frbuf.empty()) {
            auto *buf = frbuf.front();
            frbuf.pop();
            assert(buf != nullptr);
            assert(buf->capacity() == LogModule::def_buf_size);

            l_freebuf.push(buf);
        }
        pthread_mutex_unlock(&l_mtx);
    }
}

/**
 * flush_buffer
 * ------------
 */
void
LogModule::flush_buffer(std::string *buf)
{
    if (l_io != nullptr) {
        fprintf(l_io, "%s\n", buf->c_str());
        fflush(l_io);
    } else {
        printf("%s%s%s\n", Logger::red, buf->c_str(), Logger::reset);
    }
}

namespace bfs = boost::filesystem;

/**
 * mod_init
 * --------
 */
void
LogModule::mod_init()
{
    pthread_mutexattr_t attr;

    pthread_mutexattr_init(&attr);
    pthread_mutexattr_settype(&attr, PTHREAD_MUTEX_ADAPTIVE_NP);
    pthread_mutex_init(&l_mtx, &attr);

    auto pool = Program::thpool();
    l_task = LogTask::alloc(pool, this);

    auto *prog = Program::singleton();
    auto *conf = prog->prog_kv_sub_cfg("log-config");
    auto *ldir = prog->prog_kv_str(conf, "log-dir");
    auto *llvl = prog->prog_kv_str(conf, "log-level");

    if (llvl == nullptr) {
        l_level = Logger::lvl_debug;

    } else if (strcmp(llvl, "info") == 0) {
        l_level = Logger::lvl_info;

    } else if (strcmp(llvl, "debug") == 0) {
        l_level = Logger::lvl_debug;

    } else if (strcmp(llvl, "finner") == 0) {
        l_level = Logger::lvl_finner;

    } else if (strcmp(llvl, "warn") == 0) {
        l_level = Logger::lvl_warn;

    } else if (strcmp(llvl, "error") == 0) {
        l_level = Logger::lvl_error;

    } else if (strcmp(llvl, "severe") == 0) {
        l_level = Logger::lvl_severe;

    } else {
        l_level = Logger::lvl_fatal;
    }
    if (ldir == nullptr) {
        ldir = "/tmp/logs";
    }
    FsUtil::create_dirs(ldir);

    char       log_ext[256];
    int        argc;
    auto       argv = prog_args(&argc);
    time_t     rt = time(nullptr);
    struct tm  tm;
    bfs::path  exe_path(argv[0]);
    bfs::path  log_path(ldir);

    localtime_r(&rt, &tm);
    snprintf(log_ext, sizeof(log_ext), "-%02d-%02d.%02d-%02d.log",
             tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min);

    log_path /= exe_path.filename();
    log_path += log_ext;

    auto log_file = log_path.string().c_str();
    l_io = fopen(log_file, "w");

    if (l_io == nullptr) {
        printf("%sWarning:%s failed to open logfile %s\n",
               Logger::red, Logger::reset, log_file);
    }
}

/**
 * mod_enable_service
 * ------------------
 */
void
LogModule::mod_enable_service()
{
    auto  lim  = 2048;
    auto *prog = Program::singleton();
    auto *buf  = new std::string(lim, '\0');
    auto *str  = &(*buf)[0];
    auto  len  = prog->to_string(str, lim);

    if (len < lim) {
        len += snprintf(str + len, lim - len, "Log level %s\n", st_levels_map[l_level]);
    }
    buf->resize(len);
    flush_buffer(buf);
    delete buf;
}

/**
 * mod_cleanup
 * -----------
 */
void
LogModule::mod_cleanup()
{
    l_task = nullptr;

    flush_logs();
    if (l_io != nullptr) {
        fclose(l_io);
    }
    l_io = nullptr;

}
