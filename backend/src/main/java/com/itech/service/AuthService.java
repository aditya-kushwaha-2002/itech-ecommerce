package com.itech.service;

import com.itech.dto.*;
import com.itech.entity.AppUser;
import com.itech.exception.ApiException;
import com.itech.repository.AppUserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final AppUserRepository users;
  private final PasswordService passwords;
  private final TokenService tokens;

  public AuthService(AppUserRepository users, PasswordService passwords, TokenService tokens) {

    this.users = users;
    this.passwords = passwords;
    this.tokens = tokens;
  }

  public AuthResponse signup(SignupRequest request) {

    String email = request.email.trim().toLowerCase();

    if (users.findByEmail(email).isPresent())
      throw ApiException.conflict("An account already exists for this email");

    AppUser user = new AppUser();

    user.setName(request.name.trim());
    user.setEmail(email);
    user.setPasswordHash(passwords.hash(request.password));
    user.setRole("USER");

    return response(users.save(user));
  }

  public AuthResponse login(LoginRequest request) {

    AppUser user =
        users
            .findByEmail(request.email.trim().toLowerCase())
            .orElseThrow(() -> ApiException.badRequest("Invalid email or password"));

    if (!passwords.matches(request.password, user.getPasswordHash()))
      throw ApiException.badRequest("Invalid email or password");

    return response(user);
  }

  private AuthResponse response(AppUser u) {

    return new AuthResponse(tokens.create(u), 
                                  u.getId(), 
                                  u.getName(), 
                                  u.getEmail(), 
                                  u.getRole()
                              );
  }
}
