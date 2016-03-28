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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

public class Module
{
    protected final String        m_name;
    protected List<Module>        m_subs;
    protected Map<String, Module> m_modules;
    private int                   m_mask;

    protected static int mask_init     = 0x0001;
    protected static int mask_resolve  = 0x0002;
    protected static int mask_startup  = 0x0004;
    protected static int mask_service  = 0x0008;
    protected static int mask_disable  = 0x1000;
    protected static int mask_shutdown = 0x2004;
    protected static int mask_cleanup  = 0x4004;

    public Module(String name)
    {
        this.m_mask = 0;
        this.m_name = name;
    }

    public final String getName() {
        return m_name;
    }

    public Module registerSub(Module mod)
    {
        if (m_subs == null) {
            m_modules = new HashMap<>();
            m_subs = new ArrayList<>();
        }
        m_subs.add(mod);
        m_modules.put(mod.getName(), mod);
        return this;
    }

    public final Module getModule(String name) {
        return m_modules.get(name);
    }

    protected void moduleInit() {}
    protected final void moduleBaseInit()
    {
        if (((m_mask & mask_init) == 0) && (m_subs != null)) {
            m_mask |= mask_init;
            for (Module m : m_subs) {
                m.moduleInit();
                m.moduleBaseInit();
            }
        }
    }

    protected void moduleResolve() {}
    protected final void moduleBaseResolve()
    {
        if (((m_mask & mask_resolve) == 0) && (m_subs != null)) {
            m_mask |= mask_resolve;
            for (Module m : m_subs) {
                m.moduleResolve();
                m.moduleBaseResolve();
            }
        }
    }

    protected void moduleStartup() {}
    protected final void moduleBaseStartup()
    {
        if (((m_mask & mask_startup) == 0) && (m_subs != null)) {
            m_mask |= mask_startup;
            for (Module m : m_subs) {
                m.moduleStartup();
                m.moduleBaseStartup();
            }
        }
    }

    protected void moduleService() {}
    protected final void moduleBaseService()
    {
        if (((m_mask & mask_service) == 0) && (m_subs != null)) {
            m_mask |= mask_service;
            for (Module m : m_subs) {
                m.moduleService();
                m.moduleBaseService();
            }
        }
    }

    protected void moduleDisable() {}
    protected final void moduleBaseDisable()
    {
        if (((m_mask & mask_disable) == 0) && (m_subs != null)) {
            m_mask |= mask_disable;
            ListIterator<Module> li = m_subs.listIterator(m_subs.size());
            while (li.hasPrevious()) {
                Module m = li.previous();
                m.moduleDisable();
                m.moduleBaseDisable();
            }
        }
    }

    protected void moduleShutdown() {}
    protected final void moduleBaseShutdown()
    {
        if (((m_mask & mask_shutdown) == 0) && (m_subs != null)) {
            m_mask |= mask_shutdown;
            ListIterator<Module> li = m_subs.listIterator(m_subs.size());
            while (li.hasPrevious()) {
                Module m = li.previous();
                m.moduleShutdown();
                m.moduleBaseShutdown();
            }
        }
    }

    protected void moduleCleanup() {}
    protected final void moduleBaseCleanup()
    {
        if (((m_mask & mask_cleanup) == 0) && (m_subs != null)) {
            m_mask |= mask_cleanup;
            ListIterator<Module> li = m_subs.listIterator(m_subs.size());
            while (li.hasPrevious()) {
                Module m = li.previous();
                m.moduleCleanup();
                m.moduleBaseCleanup();
            }
        }
    }
}
