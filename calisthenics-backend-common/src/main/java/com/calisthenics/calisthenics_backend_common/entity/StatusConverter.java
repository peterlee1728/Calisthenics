package com.calisthenics.calisthenics_backend_common.entity;

import com.calisthenics.calisthenics_backend_common.entity.User;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class StatusConverter implements AttributeConverter<User.Status, String> {
    
    @Override
    public String convertToDatabaseColumn(User.Status status) {
        return status != null ? status.getDbValue() : null;
    }
    
    @Override
    public User.Status convertToEntityAttribute(String dbValue) {
        return dbValue != null ? User.Status.fromDbValue(dbValue) : null;
    }
}