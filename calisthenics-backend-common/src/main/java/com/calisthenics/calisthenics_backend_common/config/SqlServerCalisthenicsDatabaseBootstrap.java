package com.calisthenics.calisthenics_backend_common.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Configuration
@ConditionalOnClass(name = "org.flywaydb.core.Flyway")
@ConditionalOnProperty(
        prefix = "calisthenics.db.bootstrap",
        name = "enabled",
        havingValue = "true",
        matchIfMissing = true)
@AutoConfigureBefore({DataSourceAutoConfiguration.class, FlywayAutoConfiguration.class})
public class SqlServerCalisthenicsDatabaseBootstrap {

    private static final Logger log =
            LoggerFactory.getLogger(SqlServerCalisthenicsDatabaseBootstrap.class);

    private static final Pattern DATABASE_NAME =
            Pattern.compile("databaseName=([^;]+)", Pattern.CASE_INSENSITIVE);

    @Bean
    static CalisthenicsDatabaseBootstrapMarker calisthenicsDatabaseBootstrap(
            DataSourceProperties dataSourceProperties) {
        ensureDatabaseExists(dataSourceProperties);
        return new CalisthenicsDatabaseBootstrapMarker();
    }

    static final class CalisthenicsDatabaseBootstrapMarker {}

    private static void ensureDatabaseExists(DataSourceProperties properties) {
        String url = properties.getUrl();
        if (!StringUtils.hasText(url) || !url.toLowerCase(Locale.ROOT).contains("sqlserver")) {
            return;
        }

        String databaseName = extractDatabaseName(url);
        if (!StringUtils.hasText(databaseName)) {
            log.warn("SQL Server JDBC URL has no databaseName; skipping database bootstrap");
            return;
        }

        String masterUrl = replaceDatabaseName(url, "master");
        String createSql =
                """
                IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = N'%s')
                BEGIN
                    CREATE DATABASE [%s];
                END
                """
                        .formatted(databaseName, databaseName);

        try (Connection connection =
                        DriverManager.getConnection(
                                masterUrl, properties.getUsername(), properties.getPassword());
                Statement statement = connection.createStatement()) {
            statement.execute(createSql);
            log.info("Ensured SQL Server database [{}] exists (connected via master)", databaseName);
        } catch (SQLException exception) {
            throw new IllegalStateException(
                    "Failed to create SQL Server database ["
                            + databaseName
                            + "] on master. Check CALISTHENICS_DB_* / spring.datasource settings.",
                    exception);
        }
    }

    private static String extractDatabaseName(String jdbcUrl) {
        Matcher matcher = DATABASE_NAME.matcher(jdbcUrl);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }

    private static String replaceDatabaseName(String jdbcUrl, String databaseName) {
        Matcher matcher = DATABASE_NAME.matcher(jdbcUrl);
        if (matcher.find()) {
            return matcher.replaceFirst("databaseName=" + databaseName);
        }
        return jdbcUrl + ";databaseName=" + databaseName;
    }
}
