/*
 *--------1---------2---------3---------4---------5---------6---------7---------8--------
 * Copyright (c) 2018 by Vy Nguyen
 * BSD License
 *
 * @author vynguyen
 */
package com.tvntd.ether.util;

import com.tvntd.ether.dto.AccountInfoDTO;

public class Constants
{
    static public final String ACCT_RESERVED = "reserved";
    static public final String ACCT_VNTD = "vntd";

    public static final AccountInfoDTO[] KnownAccounts = {
        new AccountInfoDTO("0x4702058fe8468ab5a6985ff366a6bd64d165566b", "Reserved"),
        new AccountInfoDTO("0xdfe4e2f4b0332f07ff34365b28d67cf2e4c85335", "Vy Nguyen"),
        new AccountInfoDTO("0xf39702756d8fb81a578fbd40ce71e534342936e9", "Micropay"),
        new AccountInfoDTO("0x4bf42dbba6a249267a869cd55bbb7bdf8baacd4f", "Equity Pool"),
        new AccountInfoDTO("0x18046279402d5cbe4ba95f62da3ceff309f83ea2", "Prefered"),
        new AccountInfoDTO("0x154841d32ef6456ffe107f19c67b23e0cec784e8", "Annon"),
        new AccountInfoDTO("0x3e869518aabdbb1805bd467847b402f9e567b27b", "USD Backing")
    };
}
