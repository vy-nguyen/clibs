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
#ifndef _APP_KEY_SERVER_DB_H_
#define _APP_KEY_SERVER_DB_H_

#include <db/kv-db.h>

#define USER_KEY_DB              "UserKeyDb"

namespace crypto {
    class UserPrivKey;
}

class KeyServerDb : public Object
{
  public:
    OBJECT_COMMON_DEFS(KeyServerDb);

    bool
    save_account(uint64_t uuid, uint64_t key_ver, int max_keys,
                 std::string *given_privkey, std::string *given_pubkey);

    bool
    remove_account(uint64_t uuid, std::vector<crypto::UserPrivKey *> *records);

    /**
     * Iterator loop:
     * for (auto it = query_account(uuid, &max_keys); it->valid(); it->next()) {
     *     it->get_key_str(&key);
     *     it->get_value_str(&value);
     * }
     */
    KeyValIterator::ptr
    query_account(uint64_t uuid, int *max_keys);

    /**
     * Query to get public and private key matching uuid and key_ver.  The caller takes
     * owership of keys returned.
     *
     * @return null if can't find the record.
     */
    bool
    query_account_key(uint64_t uuid, uint64_t key_ver,
                      std::string **privkey, std::string **pubkey);

    /**
     * Query to get list of key versions matching the uuid.
     */
    bool
    query_key_vers(uint64_t uuid, std::vector<uint64_t> &key_ver);

    inline KeyValIterator::ptr get_db_iter() {
        return db_inst->alloc_iterator();
    }

  protected:
    const char *const db_name;
    KeyValDb::ptr     db_inst;

    KeyServerDb(const char *db);
};

#endif /* _APP_KEY_SERVER_DB_H_ */
