package com.itech.service;

import com.itech.dto.*;
import com.itech.entity.AppUser;
import com.itech.exception.ApiException;
import com.itech.repository.AppUserRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
  private final AppUserRepository users;

  public ProfileService(AppUserRepository users) {
    this.users = users;
  }

  public ProfileResponse get(Long id) {
    return map(users.findById(id).orElseThrow(() -> new RuntimeException("User not found")));
  }

  public ProfileResponse update(Long id, ProfileRequest r) {

    AppUser u = users.
                  findById(id).
                  orElseThrow(() -> 
                      ApiException.notFound("User not found"));

    if (r.name == null || r.name.isBlank()) 
      throw ApiException.badRequest("Full name is required");

    if (r.phone != null && !r.phone.isBlank() && !r.phone.matches("[0-9+() -]{7,20}"))
      throw ApiException.badRequest("Enter a valid phone number");

    if (r.postalCode != null
        && !r.postalCode.isBlank()
        && !r.postalCode.matches("[A-Za-z0-9 -]{3,12}"))
      throw ApiException.badRequest("Enter a valid PIN or postal code");

    u.setName(r.name.trim());
    u.setPhone(r.phone);
    u.setAddressLine1(r.addressLine1);
    u.setAddressLine2(r.addressLine2);
    u.setCity(r.city);
    u.setState(r.state);
    u.setPostalCode(r.postalCode);
    u.setCountry(r.country);
    
    return map(users.save(u));
  }

  private ProfileResponse map(AppUser u) {
    return new ProfileResponse(
        u.getId(),
        u.getName(),
        u.getEmail(),
        u.getRole(),
        u.getPhone(),
        u.getAddressLine1(),
        u.getAddressLine2(),
        u.getCity(),
        u.getState(),
        u.getPostalCode(),
        u.getCountry());
  }
}
