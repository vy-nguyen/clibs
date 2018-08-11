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
package com.tvntd.service.user;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvntd.dao.AdminTaskRepo;
import com.tvntd.ether.api.IAccountSvc;
import com.tvntd.ether.dto.AccountInfoDTO;
import com.tvntd.ether.dto.TransactionDTO;
import com.tvntd.ether.dto.TransactionDTO.TransactionDTOResp;
import com.tvntd.models.AdminTask;
import com.tvntd.service.api.IAdminTaskSvc;

@Service
@Transactional
public class AdminTaskSvc implements IAdminTaskSvc
{
    @Autowired
    protected AdminTaskRepo taskRepo;

    @Autowired
    protected IAccountSvc accountSvc;

    @Override
    public void addMicroPayTask(String userUuid, String value)
    {
        taskRepo.save(new AdminTask(userUuid, AdminTask.FUND_MICROPAY, value));
    }

    @Override
    public void addMicroPayTask(List<AccountInfoDTO> accounts)
    {
        Map<String, AccountInfoDTO> hasBalance = new HashMap<>();

        for (AccountInfoDTO a : accounts) {
            if (a.getXuBalance() != 0L) {
                hasBalance.put(a.getOwnerUuid(), a);
            }
        }
        for (AccountInfoDTO a : accounts) {
            if (hasBalance.get(a.getOwnerUuid()) != null) {
                continue;
            }
            System.out.println("Add micropay for " + a.getOwnerUuid() + ", account " +
                    a.getAccount());

            taskRepo.save(new AdminTask(a.getOwnerUuid(),
                        AdminTask.FUND_MICROPAY, a.getAccount()));
        }
    }

    @Override
    public void addTask(String userUuid, Long code, String value)
    {
    }

    @Override
    public TransactionDTOResp processMicroPay(Long maxVal)
    {
        List<TransactionDTO> trans = new LinkedList<>();
        TransactionDTOResp resp = new TransactionDTOResp("ok", trans);
        List<AdminTask> tasks = taskRepo.findAllByTaskCode(AdminTask.FUND_MICROPAY);

        for (AdminTask t : tasks) {
            TransactionDTOResp out = accountSvc.payAccount(
                    "a7a43c49-1cb3-452c-b0bc-6b21b93f1f66", t.getUserUuid(),
                    "0xbEdE105D2C0B250c5EE678AE3A651B84Fb14dfc8", t.getTaskValue(),
                    500000L, null);

            System.out.println("Fund uuid " + t.getUserUuid() + " account " +
                    t.getTaskValue());
            List<TransactionDTO> txout = out.getTransactions();
            if (txout != null) {
                trans.addAll(txout);
            }
        }
        return resp;
    }

    @Override
    public void
    processSendEmail(String from, String header, String content, String footer)
    {
    }
}
