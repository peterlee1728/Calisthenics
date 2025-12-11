package com.calisthenics.calisthenics_backend_common.dto;

import com.calisthenics.calisthenics_backend_common.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Integer userId;
    private String userFn;
    private String userLn;
    private User.Gender userGender;
    private Integer userAge;
    private String userEmail;
    private String userMobile;
    private String userEcName;
    private String userEcPhno;
    private BigDecimal userWeight;
    private BigDecimal userHeight;
    private BigDecimal userBmi; // Computed field
    private byte[] userImage;
    private User.Role userRole;
    private LocalDate userJoinDate;
    private LocalDateTime userLastLogin;
    private User.Status status;
    private LocalDateTime createdAt;
    private Integer createdBy;
    private LocalDateTime modifiedAt;
    private Integer modifiedBy;
}
