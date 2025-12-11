package com.calisthenics.calisthenics_backend_common.dto;

import com.calisthenics.calisthenics_backend_common.entity.Exercise;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateExerciseDto {

    @NotBlank(message = "Exercise name is required")
    @Size(max = 100, message = "Exercise name must not exceed 100 characters")
    private String exerciseName;

    private String exerciseDescription;

    @NotNull(message = "Exercise difficulty is required")
    private Exercise.Difficulty exerciseDifficulty;

    private byte[] exerciseImage;

    private Exercise.Status status; // Optional, defaults to Active in entity
}

