package com.keeper.api.exception;

public class UserAlreadyExistsException extends BadRequestException{
    public UserAlreadyExistsException() {
        super("User already exists");
    }
}
