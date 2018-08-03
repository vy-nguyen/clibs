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
package com.tvntd.ether.config;

/*
 * Adopt work from:
 * https://github.com/eugenp/tutorials.git
 */
import java.util.Properties;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@ComponentScan(basePackages = {
    "com.tvntd.ether.service"
})
@EnableJpaRepositories(
    entityManagerFactoryRef = "etherEntityMgrFactory",
    transactionManagerRef = "etherTransManager",
    basePackages = {
        "com.tvntd.ether.dao"
    }
)
public class EtherJPAConfig
{
    @Bean(name = "etherEntityMgrFactory")
    public LocalContainerEntityManagerFactoryBean etherEntityMgrFactory()
    {
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        LocalContainerEntityManagerFactoryBean em =
            new LocalContainerEntityManagerFactoryBean();

        em.setDataSource(etherDataSource());
        em.setPackagesToScan(new String[] {
            "com.tvntd.ether.models"
        });

        em.setJpaVendorAdapter(vendorAdapter);
        em.setJpaProperties(additionalProperties());
        return em;
    }

    @Bean(name = "etherDataSource")
    public DataSource etherDataSource()
    {
        EtherRpcCfg cfg = new EtherRpcCfg();
        DriverManagerDataSource ds = new DriverManagerDataSource();

        ds.setDriverClassName("com.mysql.jdbc.Driver");
        ds.setUrl("jdbc:mysql://" + cfg.getDbHost() +
                  ":3306/keystore?createDatabaseIfNotExist=true");

        ds.setUsername(cfg.getDbUser());
        ds.setPassword(cfg.getDbPassword());
        return ds;
    }

    @Bean(name = "etherTransManager")
    public JpaTransactionManager etherTransManager()
    {
        JpaTransactionManager tm = new JpaTransactionManager();

        tm.setEntityManagerFactory(etherEntityMgrFactory().getObject());
        return tm;
    }

    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
        return new PersistenceExceptionTranslationPostProcessor();
    }

    final Properties additionalProperties()
    {
        Properties hbp = new Properties();

        hbp.setProperty("hibernate.hbm2ddl.auto", "update");
        hbp.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        hbp.setProperty("hibernate.connection.useUnicode", "true");
        return hbp;
    }

    public static class EtherRpcCfg
    {
        protected static final String s_prodDb      = "10.8.0.1";
        protected static final String s_prodKey     = "http://10.8.0.1:8545";
        protected static final String s_prodAccount = "http://10.8.0.1:8545";

        protected static final String s_devDb       = "10.1.10.13";
        protected static final String s_devKey      = "http://10.1.10.11:8545";
        protected static final String s_devAccount  = "http://10.1.10.11:8545";

        protected static final String s_extDb       = "localhost";
        protected static final String s_extKey      = "http://96.68.150.190:8545";
        protected static final String s_extAccount  = "http://96.68.150.190:8545";

        protected String accountUrl;
        protected String keyUrl;
        protected String dbHost;
        protected String dbUser;
        protected String dbPassword;

        public EtherRpcCfg()
        {
            String val = System.getenv("DEV_ENVIRONMENT");
            if (val == null) {
                dbHost     = s_prodDb;
                keyUrl     = s_prodKey;
                accountUrl = s_prodAccount;
            } else if (val.equals("external")) {
                dbHost     = s_extDb;
                keyUrl     = s_extKey;
                accountUrl = s_extAccount;
            } else {
                dbHost     = s_devDb;
                keyUrl     = s_devKey;
                accountUrl = s_devAccount;
            }
            val = System.getenv("KEY_DB_HOST");
            if (val != null) {
                dbHost = val;
            }
            val = System.getenv("KEY_DB_USER");
            if (val != null) {
                dbUser = val;
            } else {
                dbUser = "socnet";
            }
            val = System.getenv("KEY_DB_PASSWORD");
            if (val != null) {
                dbPassword = val;
            } else {
                dbPassword = "socnetsocnet";
            }
        }

        public String getAccountUrl() {
            return accountUrl;
        }

        /**
         * @return the keysUrl
         */
        public String getKeyUrl() {
            return keyUrl;
        }

        /**
         * @return the dbHost
         */
        public String getDbHost() {
            return dbHost;
        }

        /**
         * @return the dbUser
         */
        public String getDbUser() {
            return dbUser;
        }

        /**
         * @return the dbPassword
         */
        public String getDbPassword() {
            return dbPassword;
        }
    }
}
