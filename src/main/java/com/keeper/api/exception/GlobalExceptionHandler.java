package com.keeper.api.exception;

import com.keeper.api.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Arrays;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({BadRequestException.class})
    public ResponseEntity<ApiResponse<?>> handleBadRequestException(BadRequestException exception){
        return ResponseEntity.badRequest().body(ApiResponse.error(exception.getMessage()));
    }

    @ExceptionHandler({RuntimeException.class})
    public ResponseEntity<ApiResponse<?>> handleRuntimeException(RuntimeException exception) {
        System.out.println(Arrays.toString(exception.getStackTrace()));
        System.out.println(exception.toString());
        return ResponseEntity.internalServerError().body(ApiResponse.error(exception.getMessage()));
    }
}
