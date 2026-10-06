package com.calisthenics.calisthenics_backend_common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {

    /** JWT bearer token — include in Authorization header for protected requests. */
    private String token;

    /** User's role (e.g. Admin, Instructor). */
    private String role;

    /** Display name (first + last name). */
    private String fullName;

    /** Email of the logged-in user. */
    private String email;
}
