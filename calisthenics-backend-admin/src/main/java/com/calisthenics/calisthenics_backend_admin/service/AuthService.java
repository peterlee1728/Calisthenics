package com.calisthenics.calisthenics_backend_admin.service;

import com.calisthenics.calisthenics_backend_common.dto.LoginRequestDto;
import com.calisthenics.calisthenics_backend_common.dto.LoginResponseDto;
import com.calisthenics.calisthenics_backend_common.entity.User;
import com.calisthenics.calisthenics_backend_common.repository.UserRepository;
import com.calisthenics.calisthenics_backend_admin.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    /**
     * Authenticates the admin user and returns a JWT token.
     * Throws AuthenticationException (→ 401) if credentials are invalid or role is Member.
     */
    public LoginResponseDto login(LoginRequestDto request) {
        // 1. Authenticate — throws BadCredentialsException / UsernameNotFoundException on failure
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        // 2. Load user and update last login timestamp
        User user = userRepository.findByUserEmail(request.getEmail())
                .orElseThrow();

        user.setUserLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // 3. Build JWT with role claim
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtService.generateToken(
                userDetails,
                Map.of("role", user.getUserRole().name()));

        // 4. Return response
        return LoginResponseDto.builder()
                .token(token)
                .role(user.getUserRole().name())
                .fullName(user.getUserFn() + " " + user.getUserLn())
                .email(user.getUserEmail())
                .build();
    }
}
