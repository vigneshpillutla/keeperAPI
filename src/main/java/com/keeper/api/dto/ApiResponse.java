package com.keeper.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public ApiResponse(boolean success, String message, T data){
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public ApiResponse(boolean success, String message){
        this(success, message, null);
    }

    public static <T> ApiResponse<T> success(T data){
        return new ApiResponse<>(true, "", data);
    }

    public static  ApiResponse<?> success(String message){
        return new ApiResponse<>(true, message);
    }

    public static ApiResponse<?> error(String message) {
        return new ApiResponse<>(false, message);
    }

    public boolean isSuccess() {
        return success;
    }

    public T getData() {
        return data;
    }

    public String getMessage() {
        return message;
    }
}
