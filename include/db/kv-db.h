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
#ifndef _DB_KV_DB_H_
#define _DB_KV_DB_H_

#include <string>
#include <vector>
#include <di/program.h>

/**
 * Key/value iterator.
 */
class KeyValIterator;

class KvIterPlugin
{
  public:
    OBJECT_PTR_DEFS(KvIterPlugin);

    virtual bool valid_key(const std::string &key) = 0;

  protected:
    INTRUSIVE_PTR_DECL(KvIterPlugin, m_refcnt);

    KvIterPlugin() : m_refcnt(0) {}
    virtual ~KvIterPlugin() {}
};

class KeyValIterator : public Object
{
  public:
    OBJECT_PTR_DEFS(KeyValIterator);

    virtual void seek(const std::string &key) = 0;
    virtual void seek_to_first() = 0;
    virtual void seek_to_last() = 0;
    virtual bool valid_key() = 0;
    virtual void next() = 0;
    virtual void prev() = 0;

    bool valid()
    {
        if (valid_key() == false) {
            return false;
        }
        if (kv_plugin == nullptr) {
            return true;
        }
        std::string key;
        get_key_str(&key);
        return kv_plugin->valid_key(key);
    }

    virtual bool get_key_str(std::string *key) const = 0;
    virtual int  get_key_ptr(const char **key) const = 0;

    virtual bool get_value_str(std::string *val) const = 0;
    virtual int  get_value_ptr(const char **val) const = 0;
    virtual int  get_value_size() const = 0;

    /**
     * Assign the plugin to intercept valid, next, and prev methods.
     */
    inline void assign_plugin(KvIterPlugin::ptr plugin) {
        kv_plugin = plugin;
    }

    template <typename K>
    bool get_key(K *key) const
    {
        std::string k;
        if ((get_key_str(&k) == true) && (key->ParseFromString(k) == true)) {
            return true;
        }
        return false;
    }

    template <typename V>
    bool get_value(V *val) const
    {
        std::string v;
        if ((get_value_str(&v) == true) && (val->ParseFromString(v) == true)) {
            return true;
        }
        return false;
    }

    template <typename K>
    int iter_foreach(const K &key,
                     std::function<bool(const K &, KeyValIterator::ptr)> fn)
    {
        int cnt = 0;
        std::string base;

        if (key.SerializeToString(&base) == false) {
            return cnt;
        }
        for (seek(base); valid(); next()) {
            if (fn(key, this) == false) {
                break;
            }
            cnt++;
        }
        return cnt;
    }

  protected:
    KvIterPlugin::ptr        kv_plugin;

    KeyValIterator() : kv_plugin(nullptr) {}
};

/**
 * Batch update or atomic updates.
 */
class KeyValBatch : public Object
{
  public:
    OBJECT_PTR_DEFS(KeyValBatch);

    virtual void kv_put(const std::string &key, const std::string &value) = 0;
    virtual void kv_delete(const std::string &key) = 0;
    virtual void kv_clear() = 0;

    template <typename K, typename V>
    void put(const K &key, const V &val)
    {
        std::string k, v;

        key.SerializeToString(&k);
        val.SerializeToString(&v);
        kv_put(k, v);
    }

    template <typename K>
    void erase(const K &key)
    {
        std::string k;

        key.SerializeToString(&k);
        kv_delete(k);
    }

    class MapFn
    {
      public:
        virtual ~MapFn() {}
        virtual void map_val(const std::string **key, const std::string **val) = 0;
    };

    /**
     * Pass nullptr to use internal vector.
     */
    virtual bool kv_apply(std::vector<MapFn *> *mapfn) = 0;

    inline KeyValBatch *kv_append_batch(MapFn *elm)
    {
        db_batch.push_back(elm);
        return this;
    }

  protected:
    std::vector<MapFn *>     db_batch;
};

/**
 * Snapshot for KV database.
 */
class KeyValDbSnap : public Object
{
  public:
    OBJECT_PTR_DEFS(KeyValDbSnap);
    typedef std::function<bool(const char *k,
            int kszie, const char *v, int vsize)> snap_filter;

    virtual bool detach_save(const std::string &dir) = 0;
    virtual bool detach_save_filter(const std::string &dir, snap_filter filter) = 0;
    virtual KeyValIterator::ptr alloc_iterator() = 0;

  protected:
    std::string              db_dir;
};

/**
 * Abstract interface for key-value database.
 */
class KeyValDb : public Module
{
  public:
    OBJECT_PTR_DEFS(KeyValDb);

    static inline KeyValDb::ptr getInstance(const char *mod) {
        return object_cast<KeyValDb>(Program::singleton()->module(mod));
    }

    template <typename K, typename V>
    bool read(const K &key, V *val) const
    {
        std::string k, v;

        key.SerializeToString(&k);
        bool ret = read_key(k, &v);
        if (ret == true) {
            return val->ParseFromString(v);
        }
        return ret;
    }

    template <typename K, typename V>
    bool write(const K &key, const V &val, bool sync)
    {
        std::string k, v;

        key.SerializeToString(&k);
        val.SerializeToString(&v);
        return write_key(k, v, sync);
    }

    template <typename K>
    bool exists(const K &key) const
    {
        std::string k;

        key.SerializeToString(&k);
        return find_key(key);
    }

    template <typename K>
    bool delete_key(const K &key, bool sync = false)
    {
        std::string k;

        key.SerializeToString(&k);
        return delete_key(k, sync);
    }

    virtual bool open_db(const std::string &dir, size_t cache_sz, bool mem) = 0;
    virtual bool find_key(const std::string &k) = 0;
    virtual bool read_key(const std::string &k, std::string *v) const = 0;
    virtual bool delete_key(const std::string &k, bool sync) = 0;
    virtual bool write_key(const std::string &k, const std::string &v, bool) = 0;
    virtual bool write_batch(KeyValBatch::ptr batch) = 0;

    virtual bool sync() = 0;
    virtual bool flush() = 0;

    virtual const std::vector<unsigned char> &get_masked_key() const = 0;
    virtual const std::string &get_masked_key_hex() const = 0;

    virtual KeyValBatch::ptr    alloc_batch() = 0;
    virtual KeyValIterator::ptr alloc_iterator() = 0;
    virtual KeyValDbSnap::ptr   take_snapshot() = 0;
};

#endif /* _DB_KV_DB_H_ */
