package com.calisthenics.calisthenics_backend_common.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "[EXERCISES]", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exercise {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "EXERCISE_ID")
	private Integer exerciseId;
	
	@NotBlank(message = "Exercise name is required")
	@Size(max = 100, message = "Exercise name must not exceed 100 characters")
	@Column(name = "EXERCISE_NAME", nullable = false, length = 100)
	private String exerciseName;

	@Column(name = "EXERCISE_DESCRIPTION", columnDefinition = "NVARCHAR(MAX)")
	private String exerciseDescription;
	
	@NotNull(message = "Exercise difficulty is required")
	@Enumerated(EnumType.STRING)
	@Column(name = "EXERCISE_DIFFICULTY", nullable = false, length = 20)
	private Difficulty exerciseDifficulty;

	@Lob
	@Column(name = "EXERCISE_IMAGE", columnDefinition = "VARBINARY(MAX)")
	private byte[] exerciseImage;

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

	// Relationships (One-to-Many)
	@OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ExerciseProgression> exerciseProgressions;

	// Enums
	public enum Difficulty {
		Beginner, Intermediate, Advanced, Expert
	}

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
