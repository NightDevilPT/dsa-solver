/*
  Warnings:

  - You are about to drop the `DailyQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyQuestionLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('PROBLEM_OF_THE_DAY', 'WEEKLY_CHALLENGE', 'CONTEST_PROBLEM', 'PRACTICE_PROBLEM', 'CUSTOM');

-- DropForeignKey
ALTER TABLE "DailyQuestionLog" DROP CONSTRAINT "DailyQuestionLog_dailyQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "DailyQuestionLog" DROP CONSTRAINT "DailyQuestionLog_providerConfigId_fkey";

-- DropForeignKey
ALTER TABLE "DailyQuestionLog" DROP CONSTRAINT "DailyQuestionLog_userId_fkey";

-- DropTable
DROP TABLE "DailyQuestion";

-- DropTable
DROP TABLE "DailyQuestionLog";

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "provider" "ProviderType" NOT NULL,
    "questionType" "QuestionType" NOT NULL DEFAULT 'PROBLEM_OF_THE_DAY',
    "problemId" TEXT NOT NULL,
    "problemSlug" TEXT NOT NULL,
    "problemUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "topics" TEXT[],
    "description" JSONB,
    "examples" JSONB,
    "constraints" JSONB,
    "solutions" JSONB,
    "explanations" JSONB,
    "hints" JSONB,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "problemDate" TIMESTAMP(3) NOT NULL,
    "formattedAt" TIMESTAMP(3),
    "aiModel" TEXT,
    "aiConfidence" DOUBLE PRECISION,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerConfigId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "codeSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "submissionResult" TEXT,
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Problem_provider_questionType_problemDate_idx" ON "Problem"("provider", "questionType", "problemDate");

-- CreateIndex
CREATE INDEX "Problem_provider_questionType_idx" ON "Problem"("provider", "questionType");

-- CreateIndex
CREATE INDEX "Problem_questionType_idx" ON "Problem"("questionType");

-- CreateIndex
CREATE INDEX "Problem_formattedAt_idx" ON "Problem"("formattedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_provider_questionType_problemDate_key" ON "Problem"("provider", "questionType", "problemDate");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemLog_userId_providerConfigId_problemId_key" ON "ProblemLog"("userId", "providerConfigId", "problemId");

-- AddForeignKey
ALTER TABLE "ProblemLog" ADD CONSTRAINT "ProblemLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemLog" ADD CONSTRAINT "ProblemLog_providerConfigId_fkey" FOREIGN KEY ("providerConfigId") REFERENCES "ProviderConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemLog" ADD CONSTRAINT "ProblemLog_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
