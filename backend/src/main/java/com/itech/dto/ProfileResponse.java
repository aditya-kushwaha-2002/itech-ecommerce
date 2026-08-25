package com.itech.dto;

public record ProfileResponse(
    Long id,
    String name,
    String email,
    String role,
    String phone,
    String addressLine1,
    String addressLine2,
    String city,
    String state,
    String postalCode,
    String country) {}
