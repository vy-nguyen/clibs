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
#ifndef _DB_LEVEL_DB_H_
#define _DB_LEVEL_DB_H_

#include <db/kv-db.h>
#include <foss/leveldb/db.h>
#include <foss/leveldb/comparator.h>
#include <foss/leveldb/write_batch.h>

class LevelDb;
namespace ldb = leveldb;

/**
 *
 */
class LdbIterator : public KeyValIterator
{
  public:
    OBJECT_COMMON_DEFS(LdbIterator);

    void seek(const std::string &key) override;
    void seek_to_first() override;
    void seek_to_last() override;
    bool valid_key() override;
    void next() override;
    void prev() override;

    bool get_key_str(std::string *key) const override;
    int  get_key_ptr(const char **key) const override;

    bool get_value_str(std::string *val) const override;
    int  get_value_ptr(const char **val) const override;
    int  get_value_size() const override;

  protected:
    friend class LevelDb;
    ldb::Iterator      *db_iter;

    ~LdbIterator();
    LdbIterator(ldb::Iterator *iter) : db_iter(iter) {}
};

/**
 *
 */
class LdbBatch : public KeyValBatch
{
  public:
    OBJECT_COMMON_DEFS(LdbBatch);

    void kv_put(const std::string &key, const std::string &val) override;
    void kv_delete(const std::string &key) override;
    void kv_clear() override;
    bool kv_apply(std::vector<MapFn *> *mapfn) override;

  protected:
    friend class LevelDb;
    ldb::WriteBatch     db_batch;
};

/**
 *
 */
class LevelDb : public KeyValDb
{
  public:
    OBJECT_COMMON_DEFS(LevelDb);
    MODULE_COMMON_DEFS(LevelDb, "GenericDb");

    bool open_db(const std::string &dir, size_t cache_sz, bool mem) override;
    bool find_key(const std::string &k) override;
    bool read_key(const std::string &k, std::string *v) const override;
    bool delete_key(const std::string &k, bool snc) override;
    bool write_key(const std::string &k, const std::string &v, bool) override;
    bool write_batch(KeyValBatch::ptr batch) override;

    bool sync() override;
    bool flush() override;
    const std::vector<unsigned char> &get_masked_key() const override;
    const std::string &get_masked_key_hex() const override;

    KeyValBatch::ptr    alloc_batch() override;
    KeyValIterator::ptr alloc_iterator() override;
    KeyValDbSnap::ptr   take_snapshot() override;

  protected:
    ldb::Env           *db_env;
    ldb::Options        db_opts;
    ldb::ReadOptions    db_read_opts;
    ldb::ReadOptions    db_iter_opts;
    ldb::WriteOptions   db_write_opts;
    ldb::WriteOptions   db_sync_opts;
    ldb::DB            *db_kv;
    const char *const   db_cfg_key;
    const char *        db_dir;

    static const uint32_t      db_mask_klen;
    std::vector<unsigned char> db_mask_key;
    std::string                db_mask_key_hex;

    explicit LevelDb(const char *name, const char *const cfg);
    ~LevelDb();

    void create_mask_key();
    void mod_enable_service() override;
    void mod_disable_service() override;

    void set_glob_opt(ldb::Options *opt, size_t ncache_size);
    void handle_error(const ldb::Status &status) const;
};

/**
 * LevelDb snapshot.
 */
class LdbKvSnap : public KeyValDbSnap
{
  public:
    OBJECT_PTR_DEFS(LdbKvSnap);

    bool detach_save(const std::string &dir) override;
    bool detach_save_filter(const std::string &, snap_filter filter) override;
    KeyValIterator::ptr alloc_iterator() override;

  protected:
    friend class LevelDb;

    ldb::Snapshot      *db_snap;
    ldb::DB            *db_kv;
    ldb::WriteOptions   db_write_opts;
    LevelDb::ptr        db_ref;

    LdbKvSnap(LevelDb::ptr master);
    ~LdbKvSnap();
};

/**
 * Custom ldb comparator
 */
class BigIntComparator : public ldb::Comparator
{
  public:
    int Compare(const ldb::Slice &a, const ldb::Slice &b) const override;

    const char *Name() const override { return "BigIntComparator"; }

    void
    FindShortestSeparator(std::string *start, const ldb::Slice &limit) const override {}

    void
    FindShortSuccessor(std::string *key) const override {}
};

#endif /* _DB_LEVEL_DB_H_ */
