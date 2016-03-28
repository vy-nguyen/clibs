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
#ifndef _UTIL_SERIALIZE_H_
#define _UTIL_SERIALIZE_H_

#include <string>
#include <iostream>

#define SERIALIZE_PROTO_FIELD(field)                                        \
    inline bool SerializeToString(std::string *out) const {                 \
        return field.SerializeToString(out);                                \
    }                                                                       \
    inline bool SerializeToOstream(std::ostream *output) const {            \
        return field.SerializeToOstream(output);                            \
    }                                                                       \
    inline bool ParseFromString(const std::string &data) {                  \
        return field.ParseFromString(data);                                 \
    }                                                                       \
    inline bool ParseFromIstream(std::istream *input) {                     \
        return field.ParseFromIstream(input);                               \
    }

#define SERIALIZE_METHODS                                                   \
    bool SerializeToString(std::string *out) const;                         \
    bool SerializeToOstream(std::ostream *output) const;                    \
    bool ParseFromString(const std::string &data);                          \
    bool ParseFromIstream(std::istream *input)
    
#endif /* _UTIL_SERIALIZE_H_ */
