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
#include <util/bigint.h>

/**
 * Constructors.
 */
BaseBlob::~BaseBlob()
{
    if (bl_ref == false) {
        delete bl_data;
    }
}

BaseBlob::BaseBlob(int bits, const char *str) : BaseBlob(bits, str, true) {}
BaseBlob::BaseBlob(int bits, const char *str, bool stack) :
    m_refcnt(0), bl_ref(false), bl_data(new bit::Blob())
{
    bl_data->set_blob(str, bits / 8);
    bl_data->set_byte(bl_data->blob().size());
    intrusive_stack_alloc(stack, this);
}

BaseBlob::BaseBlob(bit::Blob *in, bool stack) :
    m_refcnt(0), bl_ref(true), bl_data(in)
{
    intrusive_stack_alloc(stack, this);
}

BaseBlob::BaseBlob(const std::string &in, bool stack) :
    m_refcnt(0), bl_ref(false), bl_data(new bit::Blob())
{
    intrusive_stack_alloc(stack, this);
    if (bl_data->ParseFromString(in) == false) {
        delete bl_data;
        bl_data = nullptr;
    }
}

BaseBlob::BaseBlob(std::istream *in, bool stack) :
    m_refcnt(0), bl_ref(false), bl_data(new bit::Blob())
{
    intrusive_stack_alloc(stack, this);
    if (bl_data->ParseFromIstream(in)) {
        delete bl_data;
        bl_data = nullptr;
    }
}

BaseBlob::BaseBlob(const BaseBlob &cpy, bool stack) :
    m_refcnt(0), bl_ref(false), bl_data(new bit::Blob())
{
    intrusive_stack_alloc(stack, this);
    *bl_data = *cpy.bl_data;
}

/**
 * bl_set_null
 * -----------
 */
void
BaseBlob::bl_set_null()
{
    size_t    len;
    uint32_t *ptr  = bl_data_ptr(&len);

    for (int i = 0; i < len; i++) {
        ptr[i] = '\0';
    }
}

/**
 * bl_is_null
 * ----------
 */
bool
BaseBlob::bl_is_null() const
{
    size_t          len;
    const uint32_t *ptr = bl_data_ptr(&len);

    for (int i = 0; i < len; i++) {
        if (ptr[i] != '\0') {
            return false;
        }
    }
    return true;
}

/**
 * bl_get_hex
 * ----------
 */
std::string
BaseBlob::bl_get_hex() const
{
    return std::string("");
}

/**
 * bl_set_hex
 * ----------
 */
void
BaseBlob::bl_set_hex(const char *hex)
{
}

void
BaseBlob::bl_set_hex(const std::string &str)
{
}

/**
 * Arithmetic operators.
 */
bool
BaseBlob::operator !() const
{
    return false;
}

BaseBlob
BaseBlob::operator ~() const
{
    if (is_valid()) {
        BaseBlob        ret(*this, true);
        size_t          len, l;
        uint32_t       *dst = ret.bl_data_ptr(&l);
        const uint32_t *src = bl_data_ptr(&len);

        for (int i = 0; i < len; i++) {
            dst[i] = ~src[i];
        }
        return ret;
    }
    return BaseBlob(0, nullptr, true);
}

BaseBlob &
BaseBlob::operator =(const BaseBlob &rhs)
{
    return *this;
}

BaseBlob &
BaseBlob::operator |=(uint64_t mask)
{
    return *this;
}

BaseBlob &
BaseBlob::operator |=(const BaseBlob &mask)
{
    return *this;
}

BaseBlob &
BaseBlob::operator ^=(uint64_t mask)
{
    return *this;
}

BaseBlob &
BaseBlob::operator ^=(const BaseBlob &mask)
{
    return *this;
}

BaseBlob &
BaseBlob::operator <<=(int shift)
{
    return *this;
}

BaseBlob &
BaseBlob::operator >>=(int shift)
{
    return *this;
}

BaseBlob &
BaseBlob::operator +=(uint64_t num)
{
    return *this;
}

BaseBlob &
BaseBlob::operator +=(const BaseBlob &rhs)
{
    return *this;
}

BaseBlob &
BaseBlob::operator -=(uint64_t num)
{
    return *this;
}

BaseBlob &
BaseBlob::operator -=(const BaseBlob &rhs)
{
    return *this;
}

BaseBlob &
BaseBlob::operator *=(uint64_t num)
{
    return *this;
}

BaseBlob &
BaseBlob::operator *=(const BaseBlob &rhs)
{
    return *this;
}

BaseBlob &
BaseBlob::operator /=(uint64_t num)
{
    return *this;
}

BaseBlob &
BaseBlob::operator /=(const BaseBlob &rhs)
{
    return *this;
}

BaseBlob &
BaseBlob::operator ++()
{
    return *this;
}

BaseBlob &
BaseBlob::operator --()
{
    return *this;
}

const BaseBlob
BaseBlob::operator ++(int)
{
    const BaseBlob ret(*this, true);
    return ret;
}

const BaseBlob
BaseBlob::operator --(int)
{
    const BaseBlob ret(*this, true);
    return ret;
}

int
BaseBlob::compareTo(const BaseBlob &b) const
{
    return 0;
}

bool
BaseBlob::equals(uint64_t a) const
{
    return false;
}
