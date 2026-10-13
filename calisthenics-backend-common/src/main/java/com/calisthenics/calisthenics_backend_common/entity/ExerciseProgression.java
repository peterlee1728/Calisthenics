package com.calisthenics.calisthenics_backend_common.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "[EXERCISE_PROGRESSION]", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseProgression {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EXERCISE_PROGRESSION_ID")
    private Integer exerciseProgressionId;

    // Many-to-one: EXERCISES
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EXERCISE_ID", nullable = false)
    private Exercise exercise;

    // Many-to-one: PROGRESSIONS
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PROGRESSION_ID", nullable = false)
    private Progression progression;

    @NotNull(message = "Sequence order is required")
    @Column(name = "SEQUENCE_ORDER", nullable = false)
    private Integer sequenceOrder;

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

    // Enum
    public enum Status {
        Active, Inactive
    }

    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        modifiedAt = LocalDateTime.now();
        if (status == null) {
            status = Status.Active;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        modifiedAt = LocalDateTime.now();
    }
}
