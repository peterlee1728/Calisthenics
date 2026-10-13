package com.calisthenics.calisthenics_backend_admin.security;

import com.calisthenics.calisthenics_backend_common.entity.User;
import com.calisthenics.calisthenics_backend_common.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Loads a User from the database by email for Spring Security authentication.
 * Only Admin and Instructor roles are permitted to access the admin backend.
 */
@Service
@RequiredArgsConstructor
public class AdminUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByUserEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "No user found with email: " + email));

        if (user.getUserRole() == User.Role.Member) {
            throw new UsernameNotFoundException(
                    "Access denied: Members cannot log into the admin panel.");
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUserEmail())
                .password(user.getUserPasswordHash() != null ? user.getUserPasswordHash() : "")
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + user.getUserRole().name())))
                .build();
    }
}
