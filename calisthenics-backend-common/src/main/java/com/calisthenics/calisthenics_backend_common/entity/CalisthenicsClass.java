package com.calisthenics.calisthenics_backend_common.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.Formula;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "[CLASSES]", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalisthenicsClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CLASS_ID")
    private Integer classId;

    @NotBlank(message = "Class name is required")
    @Size(max = 100, message = "Class name must not exceed 100 characters")
    @Column(name = "CLASS_NAME", nullable = false, length = 100)
    private String className;

    @Column(name = "CLASS_DESCRIPTION", columnDefinition = "NVARCHAR(MAX)")
    private String classDescription;

    @NotNull(message = "Class start time is required")
    @Column(name = "CLASS_START_TIME", nullable = false)
    private LocalTime classStartTime;

    @NotNull(message = "Class end time is required")
    @Column(name = "CLASS_END_TIME", nullable = false)
    private LocalTime classEndTime;

    /** Computed column: datediff(minute, CLASS_START_TIME, CLASS_END_TIME). Read-only. */
    @Formula("DATEDIFF(MINUTE, CLASS_START_TIME, CLASS_END_TIME)")
    private Integer classDuration;

    @NotNull(message = "Class date is required")
    @Column(name = "CLASS_DATE", nullable = false)
    private LocalDate classDate;

    @NotBlank(message = "Class day is required")
    @Size(max = 10)
    @Column(name = "CLASS_DAY", nullable = false, length = 10)
    private String classDay;

    @Lob
    @Column(name = "CLASS_IMAGE", columnDefinition = "VARBINARY(MAX)")
    private byte[] classImage;

    @NotBlank(message = "Class location is required")
    @Size(max = 100, message = "Class location must not exceed 100 characters")
    @Column(name = "CLASS_LOCATION", nullable = false, length = 100)
    private String classLocation;

    @Column(name = "CLASS_PRICE", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal classPrice = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
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

    // Relationships
    @OneToMany(mappedBy = "calisthenicsClass", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClassBooking> classBookings;

    @OneToMany(mappedBy = "calisthenicsClass", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments;

    // Enum — STATUS values: Y=Active, N=Inactive, C=Cancelled
    public enum Status {
        Active, Inactive, Cancelled
    }

    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        modifiedAt = LocalDateTime.now();
        if (status == null) {
            status = Status.Active;
        }
        if (classPrice == null) {
            classPrice = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        modifiedAt = LocalDateTime.now();
    }
}
