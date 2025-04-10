package com.keeper.api.controller;

import com.keeper.api.dto.ApiResponse;
import com.keeper.api.dto.UserDto;
import com.keeper.api.entity.User;
import com.keeper.api.service.UserService;
import com.keeper.api.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping(path = "/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    @PostMapping(path = "/login")
    public ResponseEntity<ApiResponse<?>> login(@RequestBody UserDto userDto){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDto.getUsername(), userDto.getPassword())
        );
        User user = userService.getUserByUsername(userDto.getUsername());
        String token = jwtUtil.createToken(user.getUsername());
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "createdAt", user.getCreatedAt(),
                "notes", user.getNotes(),
                "token", token
        )));
    }

    @PostMapping(path = "/signup")
    public ResponseEntity<ApiResponse<?>> signup(@RequestBody UserDto userDto){
        userDto.setPassword(
                passwordEncoder.encode(userDto.getPassword())
        );
        User newUser = userService.createUser(userDto);
        String token = jwtUtil.createToken(newUser.getUsername());
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "id", newUser.getId(),
                "username", newUser.getUsername(),
                "createdAt", newUser.getCreatedAt(),
                "notes", newUser.getNotes(),
                "token", token
        )));
    }

    @GetMapping(path = "/secure")
    public ResponseEntity<ApiResponse<?>> secured() {
        return ResponseEntity.ok(ApiResponse.success("user authorized"));
    }
}
