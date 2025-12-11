package com.calisthenics.calisthenics_backend_common.dto;

import com.calisthenics.calisthenics_backend_common.entity.User;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserDto {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String userFn;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String userLn;

    @NotNull(message = "Gender is required")
    private User.Gender userGender;

    @NotNull(message = "Age is required")
    @Min(value = 1, message = "Age must be at least 1")
    @Max(value = 150, message = "Age must not exceed 150")
    private Integer userAge;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String userEmail;

    @NotBlank(message = "Mobile number is required")
    @Size(max = 20, message = "Mobile number must not exceed 20 characters")
    private String userMobile;

    @Size(max = 100, message = "Emergency contact name must not exceed 100 characters")
    private String userEcName;

    @Size(max = 20, message = "Emergency contact phone must not exceed 20 characters")
    private String userEcPhno;

    @DecimalMin(value = "0.0", message = "Weight must be positive")
    private BigDecimal userWeight;

    @DecimalMin(value = "0.0", message = "Height must be positive")
    private BigDecimal userHeight;

    private byte[] userImage;

    private User.Role userRole; // Optional, defaults to Member in entity

    @NotNull(message = "Join date is required")
    private LocalDate userJoinDate;

    private User.Status status; // Optional, defaults to Active in entity
}

