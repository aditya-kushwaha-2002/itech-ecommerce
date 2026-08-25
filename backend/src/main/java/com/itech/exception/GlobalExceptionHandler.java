package com.itech.exception;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ProductNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Map<String, Object> handleProductNotFound(ProductNotFoundException ex) {

    return Map.of("status", 404, "message", ex.getMessage());
  }

  @ExceptionHandler(ApiException.class)
  public org.springframework.http.ResponseEntity<Map<String, Object>> handleApi(ApiException ex) {
    return org.springframework.http.ResponseEntity.status(ex.getStatus())
        .body(Map.of("status", ex.getStatus().value(), "message", ex.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, Object> handleValidation(MethodArgumentNotValidException ex) {
    String message =
        ex.getBindingResult().getFieldErrors().stream()
            .findFirst()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .orElse("Invalid request");
    return Map.of("status", 400, "message", message);
  }

  @ExceptionHandler(RuntimeException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, Object> handleBusinessRule(RuntimeException ex) {
    return Map.of(
        "status",
        400,
        "message",
        ex.getMessage() == null ? "Request could not be completed" : ex.getMessage());
  }
}
