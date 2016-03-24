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
#ifndef _UTIL_BIGINT_H_
#define _UTIL_BIGINT_H_

#include <string>
#include <cpptype/object.h>
#include <util/bigint.pb.h>
#include <util/serialize.h>

/**
 *
 */
class BaseBlob
{
  public:
    OBJECT_COMMON_DEFS(BaseBlob);
    BaseBlob(int bits, const char *str);

    inline uint8_t *begin() {
        return const_cast<uint8_t *>(bl_get_data());
    }
    inline const uint8_t *begin() const {
        return bl_get_data();
    }
    inline uint8_t *end() {
        return const_cast<uint8_t *>(bl_get_data() + bl_data->ByteSize());
    }
    inline const uint8_t *end() const {
        return bl_get_data() + bl_data->ByteSize();
    }
    friend inline bool operator ==(const BaseBlob &a, const BaseBlob &b) {
        return memcmp(a.bl_get_data(), b.bl_get_data(), a.bl_data->ByteSize()) == 0;
    }
    friend inline bool operator !=(const BaseBlob &a, const BaseBlob &b) {
        return memcmp(a.bl_get_data(), b.bl_get_data(), a.bl_data->ByteSize()) != 0;
    }
    friend inline bool operator <(const BaseBlob &a, const BaseBlob &b) {
        return memcmp(a.bl_get_data(), b.bl_get_data(), a.bl_data->ByteSize()) < 0;
    }
    SERIALIZE_PROTO_FIELD((*bl_data));

    void bl_set_null();
    bool bl_is_null() const;
    void bl_set_hex(const char *hex);
    void bl_set_hex(const std::string &str);

    std::string bl_get_hex() const;
    inline std::string toString() const {
        return bl_get_hex();
    }

    /**
     * Arithmetic operators.
     */
    bool operator !() const;
    BaseBlob operator ~() const;
    BaseBlob &operator =(const BaseBlob &rhs);
    BaseBlob &operator |=(uint64_t mask);
    BaseBlob &operator |=(const BaseBlob &mask);
    BaseBlob &operator ^=(uint64_t mask);
    BaseBlob &operator ^=(const BaseBlob &mask);
    BaseBlob &operator <<=(int shift);
    BaseBlob &operator >>=(int shift);
    BaseBlob &operator +=(uint64_t num);
    BaseBlob &operator +=(const BaseBlob &rhs);
    BaseBlob &operator -=(uint64_t num);
    BaseBlob &operator -=(const BaseBlob &rhs);
    BaseBlob &operator *=(uint64_t num);
    BaseBlob &operator *=(const BaseBlob &rhs);
    BaseBlob &operator /=(uint64_t num);
    BaseBlob &operator /=(const BaseBlob &rhs);
    BaseBlob &operator ++();
    BaseBlob &operator --();
    const BaseBlob operator ++(int);
    const BaseBlob operator --(int);

    int  compareTo(const BaseBlob &b) const;
    bool equals(uint64_t a) const;

    inline bool is_valid() const {
        return bl_data != NULL;
    }

  protected:
    INTRUSIVE_PTR_DECL(BaseBlob, m_refcnt);
    bool              bl_ref;
    bit::Blob        *bl_data;

    virtual ~BaseBlob();
    BaseBlob(int bits, const char *str, bool stack = false);
    BaseBlob(bit::Blob *in, bool stack = false);
    BaseBlob(std::istream *in, bool stack = false);
    BaseBlob(const std::string &in, bool stack = false);
    BaseBlob(const BaseBlob &a, bool stack = false);

    inline const uint8_t *bl_get_data() {
        return reinterpret_cast<const uint8_t *>(bl_data->mutable_blob()->data());
    }
    inline const uint8_t *bl_get_data() const {
        return reinterpret_cast<const uint8_t *>(bl_data->blob().data());
    }

    inline uint32_t *bl_data_ptr(size_t *len)
    {
        const std::string &data = bl_data->blob();
        *len = data.size() / sizeof(uint32_t);
        return reinterpret_cast<uint32_t *>(const_cast<char *>(data.data()));
    }
    inline const uint32_t *bl_data_ptr(size_t *len) const
    {
        const std::string &data = bl_data->blob();
        *len = data.size() / sizeof(uint32_t);
        return reinterpret_cast<const uint32_t *>(data.data());
    }
};

/**
 *
 */
class Uint160 : public BaseBlob
{
  public:
    OBJECT_COMMON_DEFS(Uint160);

  protected:
    Uint160();
    explicit Uint160(const char *str);
    explicit Uint160(const std::string &str);
};

/**
 *
 */
class Uint256 : public BaseBlob
{
  public:
    OBJECT_COMMON_DEFS(Uint256);

    uint64_t get_cheap_hash() const;
    uint64_t get_hash(const Uint256 &salt) const;

  protected:
    Uint256();
    explicit Uint256(const char *str);
    explicit Uint256(const std::string &str);
};

#endif /* _UTIL_BIGINT_H_ */
