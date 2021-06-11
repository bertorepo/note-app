package com.notetapp.noteapp.exception;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public class ApiException {

  private final String message;
  private final HttpStatus httpStatus;
  private final LocalDateTime localDateTime;
}
