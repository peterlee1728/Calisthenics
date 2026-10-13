package com.calisthenics.calisthenics_backend_common.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "[PROGRESSIONS]", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Progression {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PROGRESSION_ID")
    private Integer progressionId;

    @NotBlank(message = "Progression name is required")
    @Size(max = 100, message = "Progression name must not exceed 100 characters")
    @Column(name = "PROGRESSION_NAME", nullable = false, length = 100)
    private String progressionName;

    @Column(name = "PROGRESSION_DESCRIPTION", columnDefinition = "NVARCHAR(MAX)")
    private String progressionDescription;

    @Lob
    @Column(name = "PROGRESSION_IMAGE", columnDefinition = "VARBINARY(MAX)")
    private byte[] progressionImage;

    /** Catalog-level completion flag (default false). */
    @Column(name = "COMPLETED")
    @Builder.Default
    private Boolean completed = false;

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
    @OneToMany(mappedBy = "progression", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExerciseProgression> exerciseProgressions;

    @OneToMany(mappedBy = "progression", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserProgression> userProgressions;

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
        if (completed == null) {
            completed = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        modifiedAt = LocalDateTime.now();
    }
}
