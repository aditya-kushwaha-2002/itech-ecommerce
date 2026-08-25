package com.itech.service;

import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {
  private static final int ITERATIONS = 210000, KEY_LENGTH = 256;

  public String hash(String password) {

    byte[] salt = new byte[16];

    new SecureRandom().nextBytes(salt);

    return ITERATIONS
        + ":"
        + b64(salt)
        + ":"
        + b64(derive(password.toCharArray(), salt, ITERATIONS));

  }

  public boolean matches(String password, String stored) {

    try {
      String[] bits = stored.split(":");

      byte[] expected = Base64.getDecoder().decode(bits[2]);

      byte[] actual =
          derive(
              password.toCharArray(),
              Base64.getDecoder().decode(bits[1]),
              Integer.parseInt(bits[0]));

      return java.security.MessageDigest.isEqual(expected, actual);

    } catch (Exception e) {
      return false;
    }
  }

  private byte[] derive(char[] password, byte[] salt, int iterations) {

    try {
      return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
          .generateSecret(new PBEKeySpec(password, salt, iterations, KEY_LENGTH))
          .getEncoded();

    } catch (Exception e) {

      throw new IllegalStateException(e);
    }
  }

  private String b64(byte[] value) {
    
    return Base64.getEncoder().encodeToString(value);
  }
}
