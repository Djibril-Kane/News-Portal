package com.example.backend.Auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private ResponseEntity<String> handleException(Exception e, HttpStatus status) {
        return ResponseEntity.status(status).body(e.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleBadException(BadRequestException e) {
        return handleException(e, HttpStatus.BAD_REQUEST);
    }
    
}
