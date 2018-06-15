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
package com.tvntd.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.PropertiesFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.
    authentication.builders.AuthenticationManagerBuilder;

import org.springframework.security.config.annotation.
    web.configuration.EnableWebSecurity;

import org.springframework.security.config.annotation.
    web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.tvntd.models.Role;
import com.tvntd.security.AuthenticationHandler;
import com.tvntd.security.ServiceUser;

@Configuration
@EnableWebSecurity
@Import({ TvntdWebConfig.class })
public class SecurityConfig extends WebSecurityConfigurerAdapter
{
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AuthenticationSuccessHandler urlAuthenticationSuccessHandler;

    @Autowired
    private AuthenticationFailureHandler authenticationFailureHandler;

    @Autowired
    public void configureGlobalSecurity(AuthenticationManagerBuilder auth)
        throws Exception
    {
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authProvider());
    }

    @Override
    public void configure(WebSecurity web) throws Exception
    {
        web.ignoring().antMatchers("/resources/**");
        web.ignoring().antMatchers("/client/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception
    {
        // @formatter:off
        http.authorizeRequests()
            .antMatchers("/",
                    "/rs/**",
                    "/login/**",
                    "/register/**",
                    "/public/**",
                    "/domain/**",
                    "/api/**",
                    "/help/**").permitAll()
            .antMatchers("/user/**").hasRole(Role.User)
            .antMatchers("/admin/**").hasRole(Role.Admin)
            .antMatchers("/sec-api/**").hasRole(Role.User)
            .antMatchers("/db/***").hasAnyRole(Role.Dba)
            .anyRequest().fullyAuthenticated()
            .anyRequest().authenticated()
            .and()
                .formLogin()
                    .loginPage("/login")
                    .successHandler(urlAuthenticationSuccessHandler)
                    .failureHandler(authenticationFailureHandler)
                    .usernameParameter("email").passwordParameter("password")
                .permitAll()
            .and()
                .sessionManagement()
                    .invalidSessionUrl("/")
                    .sessionFixation().none()
            .and()
                .logout()
                    .invalidateHttpSession(false)
                    .logoutSuccessUrl("/login?logout")
                    .deleteCookies("JSESSIONID")
                    .permitAll()
            .and()
                .exceptionHandling().accessDeniedPage("/403")
            .and()
                .rememberMe()
            .and()
                .csrf();
        // @formatter:on
    }

    @Bean
    public AuthenticationHandler authProvider()
    {
        final AuthenticationHandler authProvider = new AuthenticationHandler();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(encoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder(11);
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new ServiceUser();
    }

    @Bean
    public PropertiesFactoryBean socialAuthProperties()
    {
        PropertiesFactoryBean bean = new PropertiesFactoryBean();
        bean.setLocation(new ClassPathResource("oauth_consumer.properties"));
        return bean;
    }
}
