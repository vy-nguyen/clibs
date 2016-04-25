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
package com.tvntd.forms;

public class UserConnectionForm
{
    private String[] block;
    private String[] remove;
    private String[] connect;
    private String[] follow;

    /**
     * @return the block
     */
    public String[] getBlock() {
        return block;
    }

    /**
     * @param block the block to set
     */
    public void setBlock(String[] block) {
        this.block = block;
    }

    /**
     * @return the remove
     */
    public String[] getRemove() {
        return remove;
    }

    /**
     * @param remove the remove to set
     */
    public void setRemove(String[] remove) {
        this.remove = remove;
    }

    /**
     * @return the connect
     */
    public String[] getConnect() {
        return connect;
    }

    /**
     * @param connect the connect to set
     */
    public void setConnect(String[] connect) {
        this.connect = connect;
    }

    /**
     * @return the follow
     */
    public String[] getFollow() {
        return follow;
    }

    /**
     * @param follow the follow to set
     */
    public void setFollow(String[] follow) {
        this.follow = follow;
    }
}
