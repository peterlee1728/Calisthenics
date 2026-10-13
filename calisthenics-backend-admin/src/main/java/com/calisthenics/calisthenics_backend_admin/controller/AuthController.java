package com.calisthenics.calisthenics_backend_admin.controller;

import com.calisthenics.calisthenics_backend_common.dto.LoginRequestDto;
import com.calisthenics.calisthenics_backend_common.dto.LoginResponseDto;
import com.calisthenics.calisthenics_backend_admin.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/login
     * Body: { "email": "admin@example.com", "password": "plain" }
     * Returns: { "token": "eyJ...", "role": "Admin", "fullName": "John Doe", "email": "..." }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto request) {
        try {
            LoginResponseDto response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException exception) {
            return ResponseEntity.status(401)
                    .body(java.util.Map.of("error", "Invalid email or password"));
        }
    }
}
