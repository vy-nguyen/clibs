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
#include <iostream>
#include <foss/leveldb/env.h>
#include <foss/leveldb/cache.h>
#include <foss/leveldb/filter_policy.h>

#include <util/fs.h>
#include <di/logger.h>
#include <db/leveldb.h>
#include <di/program.h>

LOGGER_STATIC_DECL(s_log);

/**
 * LdbIterator
 */
LdbIterator::~LdbIterator()
{
    delete db_iter;
}

void
LdbIterator::seek(const std::string &key)
{
    db_iter->Seek(key);
}

void
LdbIterator::seek_to_first()
{
    db_iter->SeekToFirst();
}

void
LdbIterator::seek_to_last()
{
    db_iter->SeekToLast();
}

bool
LdbIterator::valid_key()
{
    return db_iter->Valid();
}

void
LdbIterator::next()
{
    db_iter->Next();
}

void
LdbIterator::prev()
{
    db_iter->Prev();
}

/**
 * get_key_str
 * -----------
 */
bool
LdbIterator::get_key_str(std::string *key) const
{
    key->assign(db_iter->key().ToString());
    return true;
}

int
LdbIterator::get_key_ptr(const char **key) const
{
    auto curr = db_iter->key();
    *key = curr.data();
    return curr.size();
}

/**
 * get_value_str
 * -------------
 */
bool
LdbIterator::get_value_str(std::string *val) const
{
    val->assign(db_iter->value().ToString());
    return true;
}

int
LdbIterator::get_value_ptr(const char **val) const
{
    auto curr = db_iter->value();
    *val = curr.data();
    return curr.size();
}

/**
 * get_value_size
 * --------------
 */
int
LdbIterator::get_value_size() const
{
    return db_iter->value().size();
}

/**
 * LdbBatch
 */
void
LdbBatch::kv_put(const std::string &key, const std::string &val)
{
    db_batch.Put(key, val);
}

void
LdbBatch::kv_delete(const std::string &key)
{
    db_batch.Delete(key);
}

void
LdbBatch::kv_clear()
{
    db_batch.Clear();
}

/**
 * kv_apply
 * --------
 */
bool
LdbBatch::kv_apply(std::vector<KeyValBatch::MapFn *> *map)
{
    const std::string *key, *val;

    for (auto curr : *map) {
        val = nullptr;
        curr->map_val(&key, &val);
        if (key == nullptr) {
            break;
        }
        if (val != nullptr) {
            kv_put(*key, *val);
        } else {
            kv_delete(*key);
        }
    }
    return false;
}

/**
 * find_key
 * --------
 */
bool
LevelDb::find_key(const std::string &key)
{
    std::string val;
    auto ret = db_kv->Get(db_read_opts, key, &val);
    if (!ret.ok()) {
        if (ret.IsNotFound()) {
            return false;
        }
        s_log.error("DB %s read key error %s", db_dir, ret.ToString().c_str());
    }
    return true;
}

/**
 * read_key
 * --------
 */
bool
LevelDb::read_key(const std::string &k, std::string *v) const
{
    auto ret = db_kv->Get(db_read_opts, k, v);
    if (ret.ok()) {
        return true;
    }
    if (ret.IsNotFound()) {
        return false;
    }
    handle_error(ret);
    return false;
}

/**
 * delete_key
 * ----------
 */
bool
LevelDb::delete_key(const std::string &key, bool sync)
{
    auto ret = db_kv->Delete(ldb::WriteOptions(), key);
    if (ret.ok()) {
        return true;
    }
    return false;
}

/**
 * write_key
 * ---------
 */
bool
LevelDb::write_key(const std::string &key, const std::string &val, bool sync)
{
    auto ret = db_kv->Put(ldb::WriteOptions(), key, val);
    if (ret.ok()) {
        return true;
    }
    s_log.error("DB %s write key error %s", db_dir, ret.ToString().c_str());
    return false;
}

/**
 * write_batch
 * -----------
 */
bool
LevelDb::write_batch(KeyValBatch::ptr batch)
{
    LdbBatch::ptr ldb = object_cast<LdbBatch>(batch);
    auto ret = db_kv->Write(ldb::WriteOptions(), &ldb->db_batch);
    if (ret.ok()) {
        return true;
    }
    s_log.error("DB %s write batch error %s", db_dir, ret.ToString().c_str());
    return false;
}

/**
 * sync
 * ----
 */
bool
LevelDb::sync()
{
    return false;
}

/**
 * flush
 * -----
 */
bool
LevelDb::flush()
{
    return false;
}

/**
 * get_masked_key
 * --------------
 */
const std::vector<unsigned char> &
LevelDb::get_masked_key() const
{
    return db_mask_key;
}

/**
 * get_masked_key_hex
 * ------------------
 */
const std::string &
LevelDb::get_masked_key_hex() const
{
    return db_mask_key_hex;
}

/**
 * alloc_batch
 * -----------
 */
KeyValBatch::ptr
LevelDb::alloc_batch()
{
    return LdbBatch::alloc();
}

/**
 * alloc_iterator
 * --------------
 */
KeyValIterator::ptr
LevelDb::alloc_iterator()
{
    return object_cast<KeyValIterator>(
            new LdbIterator(db_kv->NewIterator(db_iter_opts)));
}

KeyValDbSnap::ptr
LevelDb::take_snapshot()
{
    return nullptr;
}

/**
 * create_mask_key
 * ---------------
 */
void
LevelDb::create_mask_key()
{
}

/**
 * set_glob_opt
 * ------------
 */
void
LevelDb::set_glob_opt(ldb::Options *opt, size_t ncache_size)
{
    opt->block_cache       = ldb::NewLRUCache(ncache_size / 2);
    opt->write_buffer_size = ncache_size / 4;
    opt->filter_policy     = ldb::NewBloomFilterPolicy(10);
    opt->compression       = ldb::kNoCompression;
    opt->max_open_files    = 64;
}

LevelDb::LevelDb(const char *name, const char *const cfg) : mod_name(name),
    db_env(nullptr), db_kv(nullptr), db_cfg_key(cfg), db_dir(nullptr) {}

LevelDb::~LevelDb()
{
    delete db_opts.block_cache;
    delete db_opts.filter_policy;
}

/**
 * open_db
 * -------
 */
bool
LevelDb::open_db(const std::string &dir, size_t cache_sz, bool dbmem)
{
    if (db_opts.block_cache == nullptr) {
        set_glob_opt(&db_opts, cache_sz);
    }
    db_sync_opts.sync             = true;
    db_read_opts.verify_checksums = true;
    db_iter_opts.verify_checksums = true;
    db_iter_opts.fill_cache       = false;

    if (dbmem == true) {
        // db_env = ldb::NewMemEnv(ldb::Env::Default());
        db_opts.env = db_env;
    } else {
        FsUtil::create_dirs(dir);
    }
    auto status = ldb::DB::Open(db_opts, dir, &db_kv);
    s_log.info("Open db %s, status %s\n", dir.c_str(), status.ToString().c_str());

    db_env = db_opts.env;
    handle_error(status);
    return status.ok();
}

/**
 * mod_enable_service
 * ------------------
 */
void
LevelDb::mod_enable_service()
{
    auto *prog = Program::singleton();
    auto *conf = prog->prog_kv_sub_cfg(db_cfg_key);
    db_dir     = prog->prog_kv_str(conf, "db-dir");
    if (db_dir == nullptr) {
        printf("Missing db-dir entry in %s section.\n", db_cfg_key);
        exit(1);
    }
    auto dir   = std::string(db_dir);
    auto csize = prog->prog_kv_int(conf, "db-cache-size");
    auto dbmem = prog->prog_kv_bool(conf, "db-in-mem");
    auto wipe  = prog->prog_kv_bool(conf, "db-wipe");
    auto creat = prog->prog_kv_bool(conf, "db-create");

    set_glob_opt(&db_opts, csize);
    if (wipe == true) {
        auto ret = ldb::DestroyDB(dir, db_opts);
    }
    db_opts.create_if_missing = creat;
    open_db(dir, csize, dbmem);
}

/**
 * mod_disable_service
 * -------------------
 */
void
LevelDb::mod_disable_service()
{
    delete db_kv;
}

/**
 * handle_error
 * ------------
 */
void
LevelDb::handle_error(const ldb::Status &status) const
{
    if (status.ok()) {
        return;
    }
    const char *what = status.ToString().c_str();
    if (status.IsCorruption()) {
        printf("The database %s is corrupted! [%s]\n", db_dir, what);
    }
    if (status.IsIOError()) {
        printf("The database %s is having IO error! [%s]\n", db_dir, what);
    }
    if (status.IsNotFound()) {
        printf("The database %s isn't valid location [%s]\n", db_dir, what);
    }
    s_log.fatal("%s", what);
    exit(1);
}

/**
 * Snapshot
 */
LdbKvSnap::~LdbKvSnap()
{
}

LdbKvSnap::LdbKvSnap(LevelDb::ptr master)
{
}

/**
 * detach_save
 * -----------
 */
bool
LdbKvSnap::detach_save(const std::string &dir)
{
    return false;
}

/**
 * detach_save_filter
 * ------------------
 */
bool
LdbKvSnap::detach_save_filter(const std::string &dir, snap_filter filter)
{
    return false;
}

/**
 * alloc_iterator
 * --------------
 */
KeyValIterator::ptr
LdbKvSnap::alloc_iterator()
{
    return db_ref->alloc_iterator();
}

/**
 * Custom levelDB comparator
 */
int
BigIntComparator::Compare(const ldb::Slice &a, const ldb::Slice &b) const
{
    return 0;
}
