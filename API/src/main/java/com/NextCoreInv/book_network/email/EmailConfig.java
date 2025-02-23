package com.NextCoreInv.book_network.email;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("localhost");  // MailHog host
        mailSender.setPort(1025);         // MailHog port

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "false");        // No auth for MailHog
        props.put("mail.smtp.starttls.enable", "false"); // No TLS for MailHog
        props.put("mail.debug", "true");             // Enable for debugging

        return mailSender;
    }
}
