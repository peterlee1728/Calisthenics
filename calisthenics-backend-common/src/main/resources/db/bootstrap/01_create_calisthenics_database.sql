/*
 * Optional manual bootstrap (same logic as SqlServerCalisthenicsDatabaseBootstrap on app startup).
 * Use when you cannot run Spring Boot but need to create CALISTHENICS on [master].
 *
 * Table DDL is applied by Flyway from classpath:db/migration when admin or portal starts.
 */

USE [master];
GO

IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = N'CALISTHENICS')
BEGIN
    CREATE DATABASE [CALISTHENICS];
END
GO
