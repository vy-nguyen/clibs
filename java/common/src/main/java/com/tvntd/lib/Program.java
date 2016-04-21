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

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Program
{
    private static Program m_singleton;

    protected String[]  m_args;
    protected Module    m_module;

    protected int             m_numThreads;
    protected ExecutorService m_thrPool;

    protected Program(String[] args, Module[] mods)
    {
        if (Program.m_singleton == null) {
            this.m_args = args;
            this.m_module = new Module("main");
            for (Module m : mods) {
                this.m_module.registerSub(m);
            }
            Program.m_singleton = this;
        }
    }

    public static final Program getInstance() {
        return m_singleton;
    }

    /**
     * Wrapper to cast the module's real type.
     */
    @SuppressWarnings("unchecked")
    public <T extends Module> T getModule(String name) {
        return (T) m_module.getModule(name);
    }

    public static ExecutorService getExecutorService() {
        return getInstance().m_thrPool;
    }

    protected void progPreInit() {}
    protected void progPreStartup() {}
    protected void progPreService() {}
    protected void progPreStop() {}
    protected void progPreShutdown() {}
    protected void progPreCleanup() {}
    protected void progRun() {}
    protected void parseCmdArgs() {}

    public void initialize()
    {
        m_numThreads = Runtime.getRuntime().availableProcessors() * 2;
        if (m_thrPool == null) {
            m_thrPool = Executors.newFixedThreadPool(m_numThreads);
        }
        progPreInit();
        m_module.moduleBaseInit();

        progPreStartup();
        m_module.moduleStartup();

        progPreService();
        m_module.moduleService();
    }

    public void shutdown()
    {
        progPreStop();
        m_module.moduleDisable();

        progPreShutdown();
        m_module.moduleShutdown();

        progPreCleanup();
        m_module.moduleCleanup();

        if (m_thrPool != null) {
            m_thrPool.shutdown();
        }
    }

    public void runMain()
    {
        parseCmdArgs();
        initialize();
        progRun();
        shutdown();
    }
}
