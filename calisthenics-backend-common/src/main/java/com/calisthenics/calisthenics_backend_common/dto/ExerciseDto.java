package com.calisthenics.calisthenics_backend_common.dto;

import com.calisthenics.calisthenics_backend_common.entity.Exercise;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseDto {

    private Integer exerciseId;
    private String exerciseName;
    private String exerciseDescription;
    private Exercise.Difficulty exerciseDifficulty;
    private byte[] exerciseImage;
    private Exercise.Status status;
    private LocalDateTime createdAt;
    private Integer createdBy;
    private LocalDateTime modifiedAt;
    private Integer modifiedBy;
}


