package com.calisthenics.calisthenics_backend_common.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.Formula;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "[USER]", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID")
    private Integer userId;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    @Column(name = "USER_FN", nullable = false, length = 50)
    private String userFn;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    @Column(name = "USER_LN", nullable = false, length = 50)
    private String userLn;

    @NotBlank(message = "Gender is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "USER_GENDER", nullable = false, length = 10)
    private Gender userGender;

    @NotNull(message = "Age is required")
    @Min(value = 1, message = "Age must be at least 1")
    @Max(value = 150, message = "Age must not exceed 150")
    @Column(name = "USER_AGE", nullable = false)
    private Integer userAge;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    @Column(name = "USER_EMAIL", nullable = false, unique = true, length = 100)
    private String userEmail;

    @NotBlank(message = "Mobile number is required")
    @Size(max = 20, message = "Mobile number must not exceed 20 characters")
    @Column(name = "USER_MOBILE", nullable = false, length = 20)
    private String userMobile;

    @NotBlank(message = "Emergency contact name is required")
    @Size(max = 100, message = "Emergency contact name must not exceed 100 characters")
    @Column(name = "USER_EC_NAME", nullable = false, length = 100)
    private String userEcName;

    @NotBlank(message = "Emergency contact phone is required")
    @Size(max = 20, message = "Emergency contact phone must not exceed 20 characters")
    @Column(name = "USER_EC_PHNO", nullable = false, length = 20)
    private String userEcPhno;

    @DecimalMin(value = "0.0", message = "Weight must be positive")
    @Column(name = "USER_WEIGHT", precision = 5, scale = 2)
    private BigDecimal userWeight;

    @DecimalMin(value = "0.0", message = "Height must be positive")
    @Column(name = "USER_HEIGHT", precision = 5, scale = 2)
    private BigDecimal userHeight;

    // Computed column - BMI calculation
    @Formula("CASE WHEN USER_HEIGHT > 0 THEN USER_WEIGHT / (USER_HEIGHT * USER_HEIGHT) ELSE NULL END")
    @Column(name = "USER_BMI", insertable = false, updatable = false)
    private BigDecimal userBmi;

    @Lob
    @Column(name = "USER_IMAGE", columnDefinition = "VARBINARY(MAX)")
    private byte[] userImage;

    @Enumerated(EnumType.STRING)
    @Column(name = "USER_ROLE", nullable = false, length = 20)
    @Builder.Default
    private Role userRole = Role.Member;

    @NotNull(message = "Join date is required")
    @Column(name = "USER_JOIN_DATE", nullable = false)
    private LocalDate userJoinDate;

    @Column(name = "USER_LAST_LOGIN")
    private LocalDateTime userLastLogin;

    @Convert(converter = StatusConverter.class)
    @Column(name = "STATUS", nullable = false, length = 20)
    @Builder.Default
    private Status status = Status.Active;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private Integer createdBy;

    @Column(name = "MODIFIED_AT", nullable = false)
    private LocalDateTime modifiedAt;

    @Column(name = "MODIFIED_BY")
    private Integer modifiedBy;

    // Relationships (One-to-Many)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClassBooking> classBookings;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserProgression> userProgressions;

    // Enums
    public enum Gender {
        Male, Female, Other
    }

    public enum Role {
        Admin, Instructor, Member
    }

    public enum Status {
    Active("Y"),
    Inactive("N"),
    Suspended("S");
    
    private final String dbValue;
    
    Status(String dbValue) {
        this.dbValue = dbValue;
    }
    
    public String getDbValue() {
        return dbValue;
    }
    
    public static Status fromDbValue(String dbValue) {
        for (Status status : Status.values()) {
            if (status.dbValue.equals(dbValue)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown status: " + dbValue);
    }
}

    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        modifiedAt = LocalDateTime.now();
        if (userRole == null) {
            userRole = Role.Member;
        }
        if (status == null) {
            status = Status.Active;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        modifiedAt = LocalDateTime.now();
    }
}