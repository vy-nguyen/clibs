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
    public static final AccountInfoDTO[] KnownAccounts = {
        new AccountInfoDTO("0x4702058fe8468ab5a6985ff366a6bd64d165566b", "Reserved"),
        new AccountInfoDTO("0x4bf42dbba6a249267a869cd55bbb7bdf8baacd4f", "Equity Pool"),
        new AccountInfoDTO("0x354996225132aa46053ee9a9a5942d7e22efc6da", "Micropay"),
        new AccountInfoDTO("0x3e869518aabdbb1805bd467847b402f9e567b27b", "USD Backing")
    };
}
