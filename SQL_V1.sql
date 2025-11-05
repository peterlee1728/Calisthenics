-- =====================================================
-- Create CALISTHENICS Database - SQL Server Version
-- =====================================================

-- Use the database
USE CALISTHENICS;

-- =====================================================
-- Drop existing tables if they exist (for clean setup)
-- =====================================================

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EXERCISE_PROGRESSION]') AND type in (N'U'))
DROP TABLE [dbo].[EXERCISE_PROGRESSION];

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[USER_PROGRESSION]') AND type in (N'U'))
DROP TABLE [dbo].[USER_PROGRESSION];

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PAYMENTS]') AND type in (N'U'))
DROP TABLE [dbo].[PAYMENTS];

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CLASS_BOOKING]') AND type in (N'U'))
DROP TABLE [dbo].[CLASS_BOOKING];

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CLASSES]') AND type in (N'U'))
DROP TABLE [dbo].[CLASSES];

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PROGRESSIONS]') AND type in (N'U'))
DROP TABLE [dbo].[PROGRESSIONS];

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EXERCISES]') AND type in (N'U'))
DROP TABLE [dbo].[EXERCISES];

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[USER]') AND type in (N'U'))
DROP TABLE [dbo].[USER];

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- USER Table
CREATE TABLE [dbo].[USER] (
    [USER_ID] INT IDENTITY(1,1) NOT NULL,
    [USER_FN] NVARCHAR(50) NOT NULL,
    [USER_LN] NVARCHAR(50) NOT NULL,
    [USER_GENDER] NVARCHAR(10) NOT NULL CHECK ([USER_GENDER] IN ('Male', 'Female', 'Other')),
    [USER_AGE] INT NOT NULL,
    [USER_EMAIL] NVARCHAR(100) NOT NULL,
    [USER_MOBILE] NVARCHAR(20) NOT NULL,
    [USER_EC_NAME] NVARCHAR(100),
    [USER_EC_PHNO] NVARCHAR(20),
    [USER_WEIGHT] DECIMAL(5,2),
    [USER_HEIGHT] DECIMAL(5,2),
    [USER_BMI] AS (CASE WHEN [USER_HEIGHT] > 0 THEN [USER_WEIGHT] / ([USER_HEIGHT] * [USER_HEIGHT]) ELSE NULL END) PERSISTED,
    [USER_IMAGE] VARBINARY(MAX),
    [USER_ROLE] NVARCHAR(20) DEFAULT 'Member' CHECK ([USER_ROLE] IN ('Admin', 'Instructor', 'Member')),
    [USER_JOIN_DATE] DATE NOT NULL,
    [USER_LAST_LOGIN] DATETIME2,
    [STATUS] NVARCHAR(20) DEFAULT 'Active' CHECK ([STATUS] IN ('Active', 'Inactive', 'Suspended')),
    [CREATED_AT] DATETIME2 DEFAULT GETDATE(),
    [CREATED_BY] INT,
    [MODIFIED_AT] DATETIME2 DEFAULT GETDATE(),
    [MODIFIED_BY] INT,
    CONSTRAINT [PK_USER] PRIMARY KEY ([USER_ID]),
    CONSTRAINT [UQ_USER_EMAIL] UNIQUE ([USER_EMAIL])
);

-- EXERCISES Table
CREATE TABLE [dbo].[EXERCISES] (
    [EXERCISE_ID] INT IDENTITY(1,1) NOT NULL,
    [EXERCISE_NAME] NVARCHAR(100) NOT NULL,
    [EXERCISE_DESCRIPTION] NVARCHAR(MAX),
    [EXERCISE_DIFFICULTY] NVARCHAR(20) NOT NULL CHECK ([EXERCISE_DIFFICULTY] IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    [EXERCISE_IMAGE] VARBINARY(MAX),
    [STATUS] NVARCHAR(20) DEFAULT 'Active' CHECK ([STATUS] IN ('Active', 'Inactive')),
    [CREATED_AT] DATETIME2 DEFAULT GETDATE(),
    [CREATED_BY] INT,
    [MODIFIED_AT] DATETIME2 DEFAULT GETDATE(),
    [MODIFIED_BY] INT,
    CONSTRAINT [PK_EXERCISES] PRIMARY KEY ([EXERCISE_ID])
);

-- PROGRESSIONS Table
CREATE TABLE [dbo].[PROGRESSIONS] (
    [PROGRESSION_ID] INT IDENTITY(1,1) NOT NULL,
    [PROGRESSION_NAME] NVARCHAR(100) NOT NULL,
    [PROGRESSION_DESCRIPTION] NVARCHAR(MAX),
    [PROGRESSION_IMAGE] VARBINARY(MAX),
    [COMPLETED] BIT DEFAULT 0,
    [STATUS] NVARCHAR(20) DEFAULT 'Active' CHECK ([STATUS] IN ('Active', 'Inactive')),
    [CREATED_AT] DATETIME2 DEFAULT GETDATE(),
    [CREATED_BY] INT,
    [MODIFIED_AT] DATETIME2 DEFAULT GETDATE(),
    [MODIFIED_BY] INT,
    CONSTRAINT [PK_PROGRESSIONS] PRIMARY KEY ([PROGRESSION_ID])
);

-- CLASSES Table
CREATE TABLE [dbo].[CLASSES] (
    [CLASS_ID] INT IDENTITY(1,1) NOT NULL,
    [CLASS_NAME] NVARCHAR(100) NOT NULL,
    [CLASS_DESCRIPTION] NVARCHAR(MAX),
    [CLASS_START_TIME] TIME NOT NULL,
    [CLASS_END_TIME] TIME NOT NULL,
    [CLASS_DURATION] AS (DATEDIFF(MINUTE, [CLASS_START_TIME], [CLASS_END_TIME])) PERSISTED,
    [CLASS_DATE] DATE NOT NULL,
    [CLASS_DAY] NVARCHAR(10) NOT NULL CHECK ([CLASS_DAY] IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    [CLASS_IMAGE] VARBINARY(MAX),
    [CLASS_LOCATION] NVARCHAR(100) NOT NULL,
    [CLASS_PRICE] DECIMAL(10,2) DEFAULT 0.00,
    [STATUS] NVARCHAR(20) DEFAULT 'Active' CHECK ([STATUS] IN ('Active', 'Inactive', 'Cancelled')),
    [CREATED_AT] DATETIME2 DEFAULT GETDATE(),
    [CREATED_BY] INT,
    [MODIFIED_AT] DATETIME2 DEFAULT GETDATE(),
    [MODIFIED_BY] INT,
    CONSTRAINT [PK_CLASSES] PRIMARY KEY ([CLASS_ID])
);

-- CLASS_BOOKING Table
CREATE TABLE [dbo].[CLASS_BOOKING] (
    [CLASS_BOOKING_ID] INT IDENTITY(1,1) NOT NULL,
    [BOOKING_STATUS] NVARCHAR(20) DEFAULT 'Pending' CHECK ([BOOKING_STATUS] IN ('Pending', 'Confirmed', 'Cancelled', 'Completed')),
    [BOOKING_DATE] DATETIME2 DEFAULT GETDATE(),
    [USER_ID] INT NOT NULL,
    [CLASS_ID] INT NOT NULL,
    CONSTRAINT [PK_CLASS_BOOKING] PRIMARY KEY ([CLASS_BOOKING_ID]),
    CONSTRAINT [FK_CLASS_BOOKING_USER] FOREIGN KEY ([USER_ID]) REFERENCES [dbo].[USER]([USER_ID]) ON DELETE CASCADE,
    CONSTRAINT [FK_CLASS_BOOKING_CLASS] FOREIGN KEY ([CLASS_ID]) REFERENCES [dbo].[CLASSES]([CLASS_ID]) ON DELETE CASCADE
);

-- PAYMENTS Table
CREATE TABLE [dbo].[PAYMENTS] (
    [PAYMENT_ID] INT IDENTITY(1,1) NOT NULL,
    [USER_ID] INT NOT NULL,
    [CLASS_ID] INT NOT NULL,
    [AMOUNT] DECIMAL(10,2) NOT NULL,
    [PAYMENT_METHOD] NVARCHAR(20) NOT NULL CHECK ([PAYMENT_METHOD] IN ('Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet')),
    [PAYMENT_STATUS] NVARCHAR(20) DEFAULT 'Pending' CHECK ([PAYMENT_STATUS] IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    [PAYMENT_DATE] DATETIME2 DEFAULT GETDATE(),
    [TRANSACTION_ID] NVARCHAR(100),
    [CREATED_AT] DATETIME2 DEFAULT GETDATE(),
    [CREATED_BY] INT,
    [MODIFIED_AT] DATETIME2 DEFAULT GETDATE(),
    [MODIFIED_BY] INT,
    CONSTRAINT [PK_PAYMENTS] PRIMARY KEY ([PAYMENT_ID]),
    CONSTRAINT [FK_PAYMENTS_USER] FOREIGN KEY ([USER_ID]) REFERENCES [dbo].[USER]([USER_ID]) ON DELETE CASCADE,
    CONSTRAINT [FK_PAYMENTS_CLASS] FOREIGN KEY ([CLASS_ID]) REFERENCES [dbo].[CLASSES]([CLASS_ID]) ON DELETE CASCADE
);

-- USER_PROGRESSION Table
CREATE TABLE [dbo].[USER_PROGRESSION] (
    [USER_PROGRESSION_ID] INT IDENTITY(1,1) NOT NULL,
    [USER_ID] INT NOT NULL,
    [PROGRESSION_ID] INT NOT NULL,
    [CURRENT_LEVEL] INT DEFAULT 1,
    [STARTED_DATE] DATE NOT NULL,
    [COMPLETED_DATE] DATE,
    [STATUS] NVARCHAR(20) DEFAULT 'In Progress' CHECK ([STATUS] IN ('In Progress', 'Completed', 'Paused')),
    [CREATED_AT] DATETIME2 DEFAULT GETDATE(),
    [CREATED_BY] INT,
    [MODIFIED_AT] DATETIME2 DEFAULT GETDATE(),
    [MODIFIED_BY] INT,
    CONSTRAINT [PK_USER_PROGRESSION] PRIMARY KEY ([USER_PROGRESSION_ID]),
    CONSTRAINT [FK_USER_PROGRESSION_USER] FOREIGN KEY ([USER_ID]) REFERENCES [dbo].[USER]([USER_ID]) ON DELETE CASCADE,
    CONSTRAINT [FK_USER_PROGRESSION_PROGRESSION] FOREIGN KEY ([PROGRESSION_ID]) REFERENCES [dbo].[PROGRESSIONS]([PROGRESSION_ID]) ON DELETE CASCADE
);

-- EXERCISE_PROGRESSION Table
CREATE TABLE [dbo].[EXERCISE_PROGRESSION] (
    [EXERCISE_PROGRESSION_ID] INT IDENTITY(1,1) NOT NULL,
    [EXERCISE_ID] INT NOT NULL,
    [PROGRESSION_ID] INT NOT NULL,
    [SEQUENCE_ORDER] INT NOT NULL,
    [STATUS] NVARCHAR(20) DEFAULT 'Active' CHECK ([STATUS] IN ('Active', 'Inactive')),
    [CREATED_AT] DATETIME2 DEFAULT GETDATE(),
    [CREATED_BY] INT,
    [MODIFIED_AT] DATETIME2 DEFAULT GETDATE(),
    [MODIFIED_BY] INT,
    CONSTRAINT [PK_EXERCISE_PROGRESSION] PRIMARY KEY ([EXERCISE_PROGRESSION_ID]),
    CONSTRAINT [FK_EXERCISE_PROGRESSION_EXERCISE] FOREIGN KEY ([EXERCISE_ID]) REFERENCES [dbo].[EXERCISES]([EXERCISE_ID]) ON DELETE CASCADE,
    CONSTRAINT [FK_EXERCISE_PROGRESSION_PROGRESSION] FOREIGN KEY ([PROGRESSION_ID]) REFERENCES [dbo].[PROGRESSIONS]([PROGRESSION_ID]) ON DELETE CASCADE
);

-- =====================================================
-- CREATE INDEXES
-- =====================================================

-- User table indexes
CREATE INDEX [IX_USER_EMAIL] ON [dbo].[USER]([USER_EMAIL]);
CREATE INDEX [IX_USER_ROLE] ON [dbo].[USER]([USER_ROLE]);
CREATE INDEX [IX_USER_STATUS] ON [dbo].[USER]([STATUS]);

-- Classes table indexes
CREATE INDEX [IX_CLASS_DATE] ON [dbo].[CLASSES]([CLASS_DATE]);
CREATE INDEX [IX_CLASS_DAY] ON [dbo].[CLASSES]([CLASS_DAY]);
CREATE INDEX [IX_CLASS_STATUS] ON [dbo].[CLASSES]([STATUS]);

-- Booking table indexes
CREATE INDEX [IX_BOOKING_USER] ON [dbo].[CLASS_BOOKING]([USER_ID]);
CREATE INDEX [IX_BOOKING_CLASS] ON [dbo].[CLASS_BOOKING]([CLASS_ID]);
CREATE INDEX [IX_BOOKING_STATUS] ON [dbo].[CLASS_BOOKING]([BOOKING_STATUS]);

-- Payment table indexes
CREATE INDEX [IX_PAYMENT_USER] ON [dbo].[PAYMENTS]([USER_ID]);
CREATE INDEX [IX_PAYMENT_CLASS] ON [dbo].[PAYMENTS]([CLASS_ID]);
CREATE INDEX [IX_PAYMENT_STATUS] ON [dbo].[PAYMENTS]([PAYMENT_STATUS]);

-- User progression indexes
CREATE INDEX [IX_USER_PROGRESSION_USER] ON [dbo].[USER_PROGRESSION]([USER_ID]);
CREATE INDEX [IX_USER_PROGRESSION_PROGRESSION] ON [dbo].[USER_PROGRESSION]([PROGRESSION_ID]);

-- Exercise progression indexes
CREATE INDEX [IX_EXERCISE_PROGRESSION_EXERCISE] ON [dbo].[EXERCISE_PROGRESSION]([EXERCISE_ID]);
CREATE INDEX [IX_EXERCISE_PROGRESSION_PROGRESSION] ON [dbo].[EXERCISE_PROGRESSION]([PROGRESSION_ID]);

-- =====================================================
-- INSERT DUMMY DATA
-- =====================================================

-- Insert Users
INSERT INTO [dbo].[USER] ([USER_FN], [USER_LN], [USER_GENDER], [USER_AGE], [USER_EMAIL], [USER_MOBILE], [USER_EC_NAME], [USER_EC_PHNO], [USER_WEIGHT], [USER_HEIGHT], [USER_ROLE], [USER_JOIN_DATE], [USER_LAST_LOGIN], [STATUS], [CREATED_BY]) VALUES
('John', 'Smith', 'Male', 28, 'john.smith@email.com', '+1234567890', 'Jane Smith', '+1234567891', 75.5, 1.80, 'Admin', '2024-01-15', '2024-01-20 10:30:00', 'Active', 1),
('Sarah', 'Johnson', 'Female', 25, 'sarah.johnson@email.com', '+1234567892', 'Mike Johnson', '+1234567893', 65.0, 1.65, 'Instructor', '2024-01-16', '2024-01-20 09:15:00', 'Active', 1),
('Mike', 'Wilson', 'Male', 32, 'mike.wilson@email.com', '+1234567894', 'Lisa Wilson', '+1234567895', 80.2, 1.85, 'Member', '2024-01-17', '2024-01-19 14:20:00', 'Active', 1),
('Emma', 'Brown', 'Female', 29, 'emma.brown@email.com', '+1234567896', 'Tom Brown', '+1234567897', 58.3, 1.60, 'Member', '2024-01-18', '2024-01-20 16:45:00', 'Active', 1),
('David', 'Davis', 'Male', 35, 'david.davis@email.com', '+1234567898', 'Anna Davis', '+1234567899', 88.7, 1.90, 'Member', '2024-01-19', '2024-01-20 08:30:00', 'Active', 1);

-- Insert Exercises
INSERT INTO [dbo].[EXERCISES] ([EXERCISE_NAME], [EXERCISE_DESCRIPTION], [EXERCISE_DIFFICULTY], [STATUS], [CREATED_BY]) VALUES
('Push-ups', 'Basic bodyweight exercise for chest, shoulders, and triceps', 'Beginner', 'Active', 1),
('Pull-ups', 'Upper body strength exercise using a pull-up bar', 'Intermediate', 'Active', 1),
('Handstand', 'Advanced bodyweight exercise requiring balance and strength', 'Advanced', 'Active', 1),
('Muscle-up', 'Combination of pull-up and dip movement', 'Expert', 'Active', 1),
('Plank', 'Core strengthening exercise', 'Beginner', 'Active', 1),
('L-sit', 'Core and shoulder strength exercise', 'Intermediate', 'Active', 1),
('Planche', 'Extreme upper body strength exercise', 'Expert', 'Active', 1),
('Human Flag', 'Advanced side strength exercise', 'Expert', 'Active', 1);

-- Insert Progressions
INSERT INTO [dbo].[PROGRESSIONS] ([PROGRESSION_NAME], [PROGRESSION_DESCRIPTION], [COMPLETED], [STATUS], [CREATED_BY]) VALUES
('Push-up Progression', 'From knee push-ups to one-arm push-ups', 0, 'Active', 1),
('Pull-up Progression', 'From assisted pull-ups to weighted pull-ups', 0, 'Active', 1),
('Handstand Progression', 'From wall handstand to freestanding handstand', 0, 'Active', 1),
('Core Strength Progression', 'From basic planks to advanced core exercises', 0, 'Active', 1),
('Upper Body Progression', 'Complete upper body strength development', 0, 'Active', 1);

-- Insert Classes
INSERT INTO [dbo].[CLASSES] ([CLASS_NAME], [CLASS_DESCRIPTION], [CLASS_START_TIME], [CLASS_END_TIME], [CLASS_DATE], [CLASS_DAY], [CLASS_LOCATION], [CLASS_PRICE], [STATUS], [CREATED_BY]) VALUES
('Beginner Calisthenics', 'Introduction to basic bodyweight exercises', '09:00:00', '10:00:00', '2024-01-22', 'Monday', 'Main Gym', 25.00, 'Active', 1),
('Intermediate Strength', 'Advanced bodyweight training for experienced practitioners', '18:00:00', '19:30:00', '2024-01-22', 'Monday', 'Main Gym', 35.00, 'Active', 1),
('Handstand Workshop', 'Learn proper handstand technique and progression', '10:00:00', '12:00:00', '2024-01-23', 'Tuesday', 'Training Room A', 50.00, 'Active', 1),
('Core Conditioning', 'Intensive core strengthening session', '19:00:00', '20:00:00', '2024-01-23', 'Tuesday', 'Main Gym', 30.00, 'Active', 1),
('Advanced Skills', 'Expert-level calisthenics skills training', '17:00:00', '19:00:00', '2024-01-24', 'Wednesday', 'Training Room B', 60.00, 'Active', 1);

-- Insert Class Bookings
INSERT INTO [dbo].[CLASS_BOOKING] ([BOOKING_STATUS], [USER_ID], [CLASS_ID]) VALUES
('Confirmed', 3, 1),
('Confirmed', 4, 1),
('Confirmed', 5, 1),
('Confirmed', 3, 2),
('Pending', 4, 3),
('Confirmed', 5, 3),
('Confirmed', 3, 4),
('Confirmed', 4, 4);

-- Insert Payments
INSERT INTO [dbo].[PAYMENTS] ([USER_ID], [CLASS_ID], [AMOUNT], [PAYMENT_METHOD], [PAYMENT_STATUS], [TRANSACTION_ID], [CREATED_BY]) VALUES
(3, 1, 25.00, 'Credit Card', 'Completed', 'TXN001', 1),
(4, 1, 25.00, 'Debit Card', 'Completed', 'TXN002', 1),
(5, 1, 25.00, 'Digital Wallet', 'Completed', 'TXN003', 1),
(3, 2, 35.00, 'Credit Card', 'Completed', 'TXN004', 1),
(4, 3, 50.00, 'Bank Transfer', 'Pending', 'TXN005', 1),
(5, 3, 50.00, 'Credit Card', 'Completed', 'TXN006', 1),
(3, 4, 30.00, 'Debit Card', 'Completed', 'TXN007', 1),
(4, 4, 30.00, 'Digital Wallet', 'Completed', 'TXN008', 1);

-- Insert User Progressions
INSERT INTO [dbo].[USER_PROGRESSION] ([USER_ID], [PROGRESSION_ID], [CURRENT_LEVEL], [STARTED_DATE], [STATUS], [CREATED_BY]) VALUES
(3, 1, 2, '2024-01-15', 'In Progress', 1),
(3, 2, 1, '2024-01-16', 'In Progress', 1),
(4, 1, 3, '2024-01-10', 'In Progress', 1),
(4, 4, 2, '2024-01-12', 'In Progress', 1),
(5, 1, 4, '2024-01-05', 'In Progress', 1),
(5, 2, 3, '2024-01-08', 'In Progress', 1),
(5, 3, 1, '2024-01-18', 'In Progress', 1);

-- Insert Exercise Progressions
INSERT INTO [dbo].[EXERCISE_PROGRESSION] ([EXERCISE_ID], [PROGRESSION_ID], [SEQUENCE_ORDER], [CREATED_BY]) VALUES
(1, 1, 1, 1),  -- Push-ups in Push-up Progression
(5, 1, 2, 1),  -- Plank in Push-up Progression
(2, 2, 1, 1),  -- Pull-ups in Pull-up Progression
(6, 2, 2, 1),  -- L-sit in Pull-up Progression
(3, 3, 1, 1),  -- Handstand in Handstand Progression
(5, 4, 1, 1),  -- Plank in Core Progression
(6, 4, 2, 1),  -- L-sit in Core Progression
(1, 5, 1, 1),  -- Push-ups in Upper Body Progression
(2, 5, 2, 1),  -- Pull-ups in Upper Body Progression
(3, 5, 3, 1);  -- Handstand in Upper Body Progression

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check data insertion
SELECT 'USER' as Table_Name, COUNT(*) as Record_Count FROM [dbo].[USER]
UNION ALL
SELECT 'EXERCISES', COUNT(*) FROM [dbo].[EXERCISES]
UNION ALL
SELECT 'PROGRESSIONS', COUNT(*) FROM [dbo].[PROGRESSIONS]
UNION ALL
SELECT 'CLASSES', COUNT(*) FROM [dbo].[CLASSES]
UNION ALL
SELECT 'CLASS_BOOKING', COUNT(*) FROM [dbo].[CLASS_BOOKING]
UNION ALL
SELECT 'PAYMENTS', COUNT(*) FROM [dbo].[PAYMENTS]
UNION ALL
SELECT 'USER_PROGRESSION', COUNT(*) FROM [dbo].[USER_PROGRESSION]
UNION ALL
SELECT 'EXERCISE_PROGRESSION', COUNT(*) FROM [dbo].[EXERCISE_PROGRESSION];

PRINT 'CALISTHENICS database created successfully with sample data!';