package com.calisthenics.calisthenics_backend_common.repository;

import com.calisthenics.calisthenics_backend_common.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    /**
     * Find a user by email address (used as the login identifier).
     * Maps to the unique [USER_EMAIL] column.
     */
    Optional<User> findByUserEmail(String userEmail);

    /**
     * Check if an email is already registered (useful for validation).
     */
    boolean existsByUserEmail(String userEmail);
}
