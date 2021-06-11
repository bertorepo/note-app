package com.notetapp.noteapp.exception;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.NoSuchElementException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(value = { ApiRequestException.class })
  public ResponseEntity<Object> handleApiRequestException(
    ApiRequestException e
  ) {
    // 1. Create a payload containing exception details
    HttpStatus badRequest = HttpStatus.NO_CONTENT;

    ApiException apiException = new ApiException(
      e.getMessage(),
      badRequest,
      LocalDateTime.now(ZoneId.of("Z"))
    );

    //2. return the Response Entity.
    return new ResponseEntity<>(apiException, badRequest);
  }

  @ExceptionHandler(value = { NoSuchElementException.class })
  public ResponseEntity<Object> handleNoSuchElementException(
    NoSuchElementException e
  ) {
    // 1. Create a payload containing exception details
    HttpStatus request = HttpStatus.NOT_FOUND;

    HashMap<String, String> noSuchElementException = new HashMap<>();
    noSuchElementException.put("message", e.getMessage());
    noSuchElementException.put("status", request.toString());

    //2. return the Response Entity.
    return new ResponseEntity<>(noSuchElementException, request);
  }
}
