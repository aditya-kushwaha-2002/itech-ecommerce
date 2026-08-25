package com.itech.config;

import com.itech.entity.AppUser;
import com.itech.repository.AppUserRepository;
import com.itech.service.PasswordService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminBootstrap {
  
  @Bean
  CommandLineRunner createInitialAdmin(
      
    AppUserRepository users,

      PasswordService passwords,

      @Value("${app.admin.email}") 
      String email,

      @Value("${app.admin.password}") 
      String password) {

    return args -> {
      if (users.findByEmail(email.toLowerCase()).isEmpty()) {

        AppUser u = new AppUser();
        u.setName("Administrator");
        u.setEmail(email.toLowerCase());
        u.setPasswordHash(passwords.hash(password));
        u.setRole("ADMIN");
        users.save(u);
      }
    };
  }
}
