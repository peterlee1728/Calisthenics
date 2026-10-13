package com.calisthenics.calisthenics_backend_common.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "[USER_PROGRESSION]", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProgression {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_PROGRESSION_ID")
    private Integer userProgressionId;

    // Many-to-one: USER
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    // Many-to-one: PROGRESSIONS
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PROGRESSION_ID", nullable = false)
    private Progression progression;

    @Column(name = "CURRENT_LEVEL")
    @Builder.Default
    private Integer currentLevel = 1;

    @NotNull(message = "Started date is required")
    @Column(name = "STARTED_DATE", nullable = false)
    private LocalDate startedDate;

    @Column(name = "COMPLETED_DATE")
    private LocalDate completedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", length = 20)
    @Builder.Default
    private Status status = Status.In_Progress;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CREATED_BY")
    private Integer createdBy;

    @Column(name = "MODIFIED_AT", nullable = false)
    private LocalDateTime modifiedAt;

    @Column(name = "MODIFIED_BY")
    private Integer modifiedBy;

    // Enum — matches DB check: In Progress, Completed, Paused
    public enum Status {
        In_Progress, Completed, Paused
    }

    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        modifiedAt = LocalDateTime.now();
        if (status == null) {
            status = Status.In_Progress;
        }
        if (currentLevel == null) {
            currentLevel = 1;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        modifiedAt = LocalDateTime.now();
    }
}
