-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('OTP', 'REFRESH_TOKEN');

-- CreateEnum
CREATE TYPE "TokenPurpose" AS ENUM ('LOGIN');

-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('LEETCODE', 'GFG');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'RETRYING');

-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('DAILY', 'WEEKLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ProblemSelection" AS ENUM ('RANDOM', 'DAILY_CHALLENGE', 'FILTER_BASED', 'SPECIFIC_PROBLEM');
