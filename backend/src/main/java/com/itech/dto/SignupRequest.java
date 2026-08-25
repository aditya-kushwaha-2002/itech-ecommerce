package com.itech.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SignupRequest {
  
  @NotBlank 
  public String name;

  @NotBlank 
  @Email 
  public String email;

  @NotBlank
  @Size(min = 8)
  public String password;
  
}
