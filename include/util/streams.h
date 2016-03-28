/*
 * Copyright (c) 2009-2010 Satoshi Nakamoto
 * Copyright (c) 2009-2013 The Bitcoin Core developers 
 *
 * Adopted from Bitcoin project.
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
#ifndef _UTIL_STREAMS_H_
#define _UTIL_STREAMS_H_

#include <ios>
#include <util/pagelock.h>

/**
 *
 */
class SDStream
{
  public:
    typedef SecVector::allocator_type    allocator_type;
    typedef SecVector::size_type         size_type;
    typedef SecVector::difference_type   difference_type;
    typedef SecVector::reference         reference;
    typedef SecVector::const_reference   const_reference;
    typedef SecVector::value_type        value_type;
    typedef SecVector::iterator          iterator;
    typedef SecVector::const_iterator    const_iterator;
    typedef SecVector::reverse_iterator  reverse_iterator;

    SDStream(int ntype, int nver);
    SDStream(const char *pbeg, const char *pend, int ntype, int nver);
    SDStream(const SecVector &in, int ntype, int nver);
    SDStream(const std::vector<unsigned char> &in, int ntype, int nver);

    SDStream &operator +=(const SDStream &in);
    friend SDStream operator +(const SDStream &a, const SDStream &b);
    std::string toString() const;

    /**
     * Vector subset.
     */
    const_iterator  begin() const;
    const_iterator  end() const;
    iterator        begin();
    iterator        end();
    size_type       size() const;
    bool            empty() const;
    void            resize(size_type n, value_type c = 0);
    void            reserve(size_type n);
    const_reference operator[](size_type pos) const;
    reference       operator[](size_type pos);

    iterator insert(iterator it, const char &x = char());
    void     insert(iterator it, size_type n, const char &x);
    void     insert(iterator it,
                    std::vector<char>::const_iterator first,
                    std::vector<char>::const_iterator last);
    void     insert(iterator it, const char *first, const char *last);
    iterator erase(iterator first, iterator last);
    iterator erase(iterator it);
    void     clear();
    void     compact();
    bool     rewind(size_type n);

    /**
     * Stream subset.
     */
    inline void set_type(int type) { sds_ntype = type; }
    inline int  get_type()         { return sds_ntype; }
    inline void set_version(int v) { sds_nver = v; }
    inline int  get_version()      { return sds_nver; }
    inline void read_version()     { *this >> sds_nver; }
    inline void write_version()    { *this << sds_nver; }

    SDStream &read(char *pch, size_t size);
    SDStream &ignore(int size);
    SDStream &wrie(const char *pch, size_t size);
    void      xor_mask(const std::vector<unsigned char> &key);
    bool      eof() const;

    template <typename T>
    SDStream &operator<< (const T &obj)
    {
        obj.serialize(*this, sds_ntype, sds_nver);
        return *this;
    }

    template <typename T>
    SDStream &operator>> (const T &obj)
    {
        obj.deserialize(*this, sds_ntype, sds_nver);
        return *this;
    }

  protected:
    SecVector       sds_vec;
    uint32_t        sds_nrd_pos;
    int             sds_ntype;
    int             sds_nver;

    void sds_init(int ntype, int nver);
};

/**
 *
 */
class FileStream
{
  public:
    FileStream(FILE *fs, int ntype, int nver);
    ~FileStream();

    inline FILE *release() { FILE *rt = fs_file; fs_file = NULL; return rt; }
    inline FILE *get() const        { return fs_file; }
    inline bool  is_null() const    { return fs_file == NULL; }
    inline void  set_type(int n)    { fs_ntype = n; }
    inline void  set_version(int v) { fs_nver = v; }
    inline int   get_type()         { return fs_ntype; }
    inline int   get_version()      { return fs_nver; }
    inline void  read_version()     { *this >> fs_nver; }
    inline void  write_version()    { *this << fs_nver; }

    void fclose();
    FileStream &read(char *pch, size_t size);
    FileStream &write(const char *pch, size_t size);

    template <typename T>
    FileStream &operator <<(const T &obj)
    {
        if (fs_file == NULL) {
            throw std::ios_base::failure("FileStream << has NULL file handle");
        }
        obj.serialize(*this, fs_ntype, fs_nver);
        return *this;
    }

    template <typename T>
    FileStream &operator >>(const T &obj)
    {
        if (fs_file == NULL) {
            throw std::ios_base::failure("FileStream >> has NULL file handle");
        }
        obj.deserialize(*this, fs_ntype, fs_nver);
        return *this;
    }

  protected:
    FILE            *fs_file;
    int              fs_ntype;
    int              fs_nver;

    FileStream(const FileStream &);
    FileStream &operator =(const FileStream &);
};

/**
 *
 */
class BufferFileStream
{
  public:
    BufferFileStream(FILE *in, uint64_t buf_size, uint64_t rewind_in, int type, int ver);
    ~BufferFileStream();

    void fclose();
    void find_byte(char ch);
    BufferFileStream &read(char *pch, size_t size);

    bool eof() const;
    bool set_pos(uint64_t pos);
    bool set_limit(uint64_t lim = -1L);
    bool seek(uint64_t pos);

    inline uint64_t get_pos()       { return fs_rd_pos; }

    template <typename T>
    BufferFileStream &operator >>(T &obj)
    {
        if (fs_file == NULL) {
            throw std::ios_base::failure("BufferFileStream >> has NULL file handle");
        }
        obj.serialize(*this, fs_ntype, fs_nver);
        return *this;
    }

  protected:
    FILE              *fs_file;
    int                fs_ntype;
    int                fs_nver;
    uint64_t           fs_src_pos;
    uint64_t           fs_rd_pos;
    uint64_t           fs_rd_limit;
    uint64_t           fs_rewind;
    std::vector<char>  fs_buf;

    BufferFileStream(const BufferFileStream &);
    BufferFileStream &operator =(const BufferFileStream &);

    bool fill();
};

#endif /* _UTIL_STREAMS_H_ */
