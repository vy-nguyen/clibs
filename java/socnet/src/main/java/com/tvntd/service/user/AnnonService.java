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

import java.util.Date;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.WebUtils;

import com.tvntd.dao.AnnonUserRepo;
import com.tvntd.lib.ObjectId;
import com.tvntd.models.AnnonUser;
import com.tvntd.security.ServiceUser;
import com.tvntd.service.api.IAnnonService;

@Service
@Transactional
public class AnnonService implements IAnnonService
{
    @Autowired
    protected AnnonUserRepo annonRepo;

    protected void updateAnnonVisit(AnnonUser user, String ip)
    {
        user.setRemoteIp(ip);
        user.setVisitSessions(user.getVisitSessions() + 1);
        user.setLastSession(new Date());
        annonRepo.save(user);
    }

    @Override
    public AnnonUserDTO getAnnonUser(HttpServletRequest reqt,
            HttpServletResponse resp, HttpSession session)
    {
        AnnonUser user;
        String ip = ServiceUser.getClientIP(reqt);
        Cookie cookie = WebUtils.getCookie(reqt, annonKey);
        AnnonUserDTO dto = (AnnonUserDTO) session.getAttribute(annonKey);

        if (dto != null) {
            user = dto.fetchAnnonUser();
            if (cookie != null && !cookie.getValue().equals(user.getUserUuid())) {
                user.setUserUuid(cookie.getValue());
                updateAnnonVisit(user, ip);
            }
            return dto;
        }
        if (cookie == null) {
            user = new AnnonUser();
            dto = new AnnonUserDTO(user);

            updateAnnonVisit(user, ip);
            session.setAttribute(annonKey, dto);

            cookie = new Cookie(annonKey, user.getUserUuid());
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(1000 * 24 * 60 * 60);
            resp.addCookie(cookie);
            return dto;
        }
        String uuid = cookie.getValue();
        user = annonRepo.findByUserUuid(uuid);
        if (user == null) {
            user = new AnnonUser(uuid);
        }
        updateAnnonVisit(user, ip);

        dto = new AnnonUserDTO(user);
        session.setAttribute(annonKey, dto);
        return dto;
    }

    @Override
    public void saveAnnonUser(AnnonUserDTO user)
    {
    }

    @Override
    public void saveAnnonUserImgUrl(AnnonUserDTO user, ObjectId oid, int index)
    {
    }

    @Override
    public AnnonUserDTO createAnnonUser() {
        return null;
    }

    @Override
    public void deleteAnnonUser(AnnonUserDTO user)
    {
    }

    @Override
    public void deleteAnnonUser(String uuid)
    {
    }
}
