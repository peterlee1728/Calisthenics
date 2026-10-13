package com.calisthenics.calisthenics_backend_admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {
    "com.calisthenics.calisthenics_backend_admin",
    "com.calisthenics.calisthenics_backend_common.entity"
})
@EnableJpaRepositories(basePackages = {
    "com.calisthenics.calisthenics_backend_admin",
    "com.calisthenics.calisthenics_backend_common.repository"
})
public class CalisthenicsBackendAdminApplication {

    public static void main(String[] args) {
        SpringApplication.run(CalisthenicsBackendAdminApplication.class, args);
    }
}