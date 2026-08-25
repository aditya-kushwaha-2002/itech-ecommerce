package com.itech.controller;

import com.itech.config.AuthUser;
import com.itech.dto.*;
import com.itech.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me")
public class ProfileController {
  private final ProfileService profiles;

  public ProfileController(ProfileService profiles) {
    this.profiles = profiles;
  }

  private Long id(HttpServletRequest r) {

    return ((AuthUser) r.getAttribute("authUser")).id();
  }

  @GetMapping
  public ProfileResponse get(HttpServletRequest r) {

    return profiles.get(id(r));
  }

  @PutMapping
  public ProfileResponse update(HttpServletRequest r, @RequestBody ProfileRequest body) {
    
    return profiles.update(id(r), body);
  }
}
