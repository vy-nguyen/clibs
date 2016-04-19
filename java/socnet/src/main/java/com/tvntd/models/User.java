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
package com.tvntd.models;

import java.util.Collection;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

@Entity
public class User
{
    static private final Long userIdStart = 10000L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String email;
    private String firstName;
    private String lastName;
    private String locale;

    @Column(length = 60)
    private String password;

    private boolean enabled;
    private boolean tokenExpired;

    private Long   connections;
    private Long   followers;
    private Long   follows;
    private String creditEarned;
    private String creditIssued;
    private String moneyEarned;
    private String moneyIssued;

    //
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "UserRoles",
        joinColumns = @JoinColumn(name = "userId", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "RoleId",
            referencedColumnName = "id"))
    private Collection<Role> roles;

    public User()
    {
        super();
        this.connections = 0L;
        this.followers = 0L;
        this.follows = 0L;
        this.enabled = false;
        this.tokenExpired = false;
    }

    static public Long getUserIdStart() {
        return userIdStart;
    }

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(final String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(final String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(final String username) {
        this.email = username;
    }

    /**
     * @return the locale
     */
    public String getLocale() {
        return locale;
    }

    /**
     * @param locale the locale to set
     */
    public void setLocale(String locale) {
        this.locale = locale;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(final String password) {
        this.password = password;
    }

    /**
     * @return the connections
     */
    public Long getConnections() {
        return connections;
    }

    /**
     * @param connections the connections to set
     */
    public void setConnections(Long connections) {
        this.connections = connections;
    }

    /**
     * @return the followers
     */
    public Long getFollowers() {
        return followers;
    }

    /**
     * @param followers the followers to set
     */
    public void setFollowers(Long followers) {
        this.followers = followers;
    }

    /**
     * @return the follows
     */
    public Long getFollows() {
        return follows;
    }

    /**
     * @param follows the follows to set
     */
    public void setFollows(Long follows) {
        this.follows = follows;
    }

    /**
     * @return the creditEarned
     */
    public String getCreditEarned() {
        return creditEarned;
    }

    /**
     * @param creditEarned the creditEarned to set
     */
    public void setCreditEarned(String creditEarned) {
        this.creditEarned = creditEarned;
    }

    /**
     * @return the creditIssued
     */
    public String getCreditIssued() {
        return creditIssued;
    }

    /**
     * @param creditIssued the creditIssued to set
     */
    public void setCreditIssued(String creditIssued) {
        this.creditIssued = creditIssued;
    }

    /**
     * @return the moneyEarned
     */
    public String getMoneyEarned() {
        return moneyEarned;
    }

    /**
     * @param moneyEarned the moneyEarned to set
     */
    public void setMoneyEarned(String moneyEarned) {
        this.moneyEarned = moneyEarned;
    }

    /**
     * @return the moneyIssued
     */
    public String getMoneyIssued() {
        return moneyIssued;
    }

    /**
     * @param moneyIssued the moneyIssued to set
     */
    public void setMoneyIssued(String moneyIssued) {
        this.moneyIssued = moneyIssued;
    }

    public Collection<Role> getRoles() {
        return roles;
    }

    public void setRoles(final Collection<Role> roles) {
        this.roles = roles;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(final boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isTokenExpired() {
        return tokenExpired;
    }

    public void setTokenExpired(final boolean expired) {
        this.tokenExpired = expired;
    }

    @Override
    public int hashCode()
    {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((email == null) ? 0 : email.hashCode());
        return result;
    }

    @Override
    public boolean equals(final Object obj)
    {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final User user = (User) obj;
        if (!email.equals(user.email)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString()
    {
        StringBuilder sb = new StringBuilder();
        sb.append("First: ")
            .append(firstName)
            .append(", last: ")
            .append(lastName)
            .append(", email: ")
            .append(email)
            .append(", roles: ")
            .append(roles)
            .append(", id: ")
            .append(id)
            .append("\n");
        return sb.toString();
    }
}
