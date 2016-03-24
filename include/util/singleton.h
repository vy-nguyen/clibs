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
#ifndef _UTIL_SINGLETON_H_
#define _UTIL_SINGLETON_H_

#include <boost/thread/once.hpp>
#include <boost/intrusive_ptr.hpp>

#define SINGLETON_DEF(Type)                                                          \
  private:                                                                           \
    static boost::intrusive_ptr<Type> m_singleton;                                   \
    static boost::once_flag m_init_flag;                                             \
                                                                                     \
    static void create_instance() {                                                  \
        m_singleton = Type::alloc();                                                 \
    }                                                                                \
  public:                                                                            \
    static boost::intrusive_ptr<Type> getInstance()                                  \
    {                                                                                \
        boost::call_once(Type::create_instance, Type::m_init_flag);                  \
        return Type::m_singleton;                                                    \
    }                                                                                \
    static void deleteSingleton() {                                                  \
        Type::m_singleton = NULL;                                                    \
    }

#endif /* _UTIL_SINGLETON_H_ */
