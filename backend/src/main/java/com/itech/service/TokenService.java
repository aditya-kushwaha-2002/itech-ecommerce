package com.itech.service;

import com.itech.config.AuthUser;
import com.itech.entity.AppUser;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
  private final String secret;

  public TokenService(@Value("${app.auth.secret}") String secret) {
    this.secret = secret;
  }

  public String create(AppUser user) {

    String data =
        user.getId()
            + "|"
            + user.getEmail()
            + "|"
            + user.getRole()
            + "|"
            + (Instant.now().getEpochSecond() + 86400);

    return encode(data) + "." + sign(data);
  }

  public AuthUser verify(String token) {

    try {

      String[] parts = token.split("\\.");

      String data = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);

      if (!sign(data).equals(parts[1])) 
        return null;

      String[] fields = data.split("\\|");

      if (fields.length != 4 || Long.parseLong(fields[3]) < Instant.now().getEpochSecond())
        return null;

      return new AuthUser(Long.parseLong(fields[0]), fields[1], fields[2]);

    } catch (Exception e) {

      return null;
    }
  }

  private String encode(String data) {

    return Base64.getUrlEncoder()
        .withoutPadding()
        .encodeToString(data.getBytes(StandardCharsets.UTF_8));
  }

  private String sign(String data) {

    try {

      Mac mac = Mac.getInstance("HmacSHA256");

      mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));

      return Base64.getUrlEncoder()
          .withoutPadding()
          .encodeToString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));

    } catch (Exception e) {
      
      throw new IllegalStateException(e);
    }
  }
}
