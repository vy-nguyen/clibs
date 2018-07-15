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
package com.tvntd.lib;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

public class LRUCache<K, I, V> extends LinkedHashMap<K, V>
{
    static final long serialVersionUID = 123456789L;
    protected int cacheEntries;
    protected Map<I, V> cacheIndex;

    public LRUCache(int initSize, int maxSize)
    {
        super(initSize, 0.75f, true);
        this.cacheEntries = maxSize;
    }

    public LRUCache<K, I, V> createIndex()
    {
        if (cacheIndex == null) {
            cacheIndex = new HashMap<>();
        }
        return this;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest)
    {
        boolean rm = (size() >= cacheEntries);

        if (rm == true && cacheIndex != null) {
            I idx = getIndexKey(eldest.getValue());
            if (idx != null) {
                cacheIndex.remove(idx);
            }
        }
        return rm;
    }

    @Override
    public V get(Object key)
    {
        synchronized(this) {
            return super.get(key);
        }
    }

    @Override
    public V put(K key, V val)
    {
        synchronized(this) {
            if (cacheIndex != null) {
                I idx = getIndexKey(val);
                if (idx != null) {
                    cacheIndex.put(idx, val);
                }
            }
            return super.put(key, val);
        }
    }

    public V getIndex(Object index)
    {
        if (cacheIndex != null) {
            synchronized(this) {
                return cacheIndex.get(index);
            }
        }
        return null;
    }

    public I getIndexKey(V val) {
        return null;
    }
}
