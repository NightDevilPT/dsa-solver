/*
  Warnings:

  - You are about to drop the column `providerConfigId` on the `EncryptedCredentials` table. All the data in the column will be lost.
  - You are about to drop the column `includeExplanation` on the `NotificationConfig` table. All the data in the column will be lost.
  - You are about to drop the column `includeHints` on the `NotificationConfig` table. All the data in the column will be lost.
  - You are about to drop the column `providerConfigId` on the `NotificationConfig` table. All the data in the column will be lost.
  - You are about to drop the column `providerConfigId` on the `ProblemLog` table. All the data in the column will be lost.
  - You are about to drop the column `providerConfigId` on the `ScheduledTask` table. All the data in the column will be lost.
  - You are about to drop the `ProviderConfig` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userProviderServiceId]` on the table `EncryptedCredentials` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userProviderServiceId]` on the table `NotificationConfig` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,userProviderServiceId,problemId]` on the table `ProblemLog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userProviderServiceId` to the `EncryptedCredentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userProviderServiceId` to the `NotificationConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userProviderServiceId` to the `ProblemLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userProviderServiceId` to the `ScheduledTask` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EncryptedCredentials" DROP CONSTRAINT "EncryptedCredentials_providerConfigId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationConfig" DROP CONSTRAINT "NotificationConfig_providerConfigId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemLog" DROP CONSTRAINT "ProblemLog_providerConfigId_fkey";

-- DropForeignKey
ALTER TABLE "ProviderConfig" DROP CONSTRAINT "ProviderConfig_userId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduledTask" DROP CONSTRAINT "ScheduledTask_providerConfigId_fkey";

-- DropIndex
DROP INDEX "EncryptedCredentials_providerConfigId_key";

-- DropIndex
DROP INDEX "NotificationConfig_providerConfigId_key";

-- DropIndex
DROP INDEX "ProblemLog_userId_providerConfigId_problemId_key";

-- AlterTable
ALTER TABLE "EncryptedCredentials" DROP COLUMN "providerConfigId",
ADD COLUMN     "userProviderServiceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NotificationConfig" DROP COLUMN "includeExplanation",
DROP COLUMN "includeHints",
DROP COLUMN "providerConfigId",
ADD COLUMN     "autoSubmitConfirmationSubject" TEXT,
ADD COLUMN     "autoSubmitOnlyIfSolved" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "autoSubmitSendConfirmation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailFrequency" TEXT NOT NULL DEFAULT 'DAILY',
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeAlternative" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeBestPractice" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeCommonMistakes" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeExplanationApproach" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeExplanationOverview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeHintsAlgorithm" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeHintsApproach" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeHintsDataStructure" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeHintsProgressive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeKeyInsights" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeRelatedProblems" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "includeStepByStep" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mailSubject" TEXT,
ADD COLUMN     "preferredTime" TEXT,
ADD COLUMN     "userProviderServiceId" TEXT NOT NULL,
ALTER COLUMN "preferredLanguage" SET DEFAULT 'python';

-- AlterTable
ALTER TABLE "ProblemLog" DROP COLUMN "providerConfigId",
ADD COLUMN     "userProviderServiceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ScheduledTask" DROP COLUMN "providerConfigId",
ADD COLUMN     "userProviderServiceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProviderConfig";

-- CreateTable
CREATE TABLE "ProviderService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "providerType" "ProviderType" NOT NULL,
    "serviceType" TEXT NOT NULL,
    "serviceConfigSchema" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isComingSoon" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProviderService" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerServiceId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "serviceConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProviderService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProviderService_providerType_idx" ON "ProviderService"("providerType");

-- CreateIndex
CREATE INDEX "ProviderService_isActive_idx" ON "ProviderService"("isActive");

-- CreateIndex
CREATE INDEX "ProviderService_serviceType_idx" ON "ProviderService"("serviceType");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderService_name_providerType_key" ON "ProviderService"("name", "providerType");

-- CreateIndex
CREATE INDEX "UserProviderService_userId_idx" ON "UserProviderService"("userId");

-- CreateIndex
CREATE INDEX "UserProviderService_providerServiceId_idx" ON "UserProviderService"("providerServiceId");

-- CreateIndex
CREATE INDEX "UserProviderService_isEnabled_idx" ON "UserProviderService"("isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "UserProviderService_userId_providerServiceId_key" ON "UserProviderService"("userId", "providerServiceId");

-- CreateIndex
CREATE UNIQUE INDEX "EncryptedCredentials_userProviderServiceId_key" ON "EncryptedCredentials"("userProviderServiceId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationConfig_userProviderServiceId_key" ON "NotificationConfig"("userProviderServiceId");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemLog_userId_userProviderServiceId_problemId_key" ON "ProblemLog"("userId", "userProviderServiceId", "problemId");

-- AddForeignKey
ALTER TABLE "EncryptedCredentials" ADD CONSTRAINT "EncryptedCredentials_userProviderServiceId_fkey" FOREIGN KEY ("userProviderServiceId") REFERENCES "UserProviderService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationConfig" ADD CONSTRAINT "NotificationConfig_userProviderServiceId_fkey" FOREIGN KEY ("userProviderServiceId") REFERENCES "UserProviderService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemLog" ADD CONSTRAINT "ProblemLog_userProviderServiceId_fkey" FOREIGN KEY ("userProviderServiceId") REFERENCES "UserProviderService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledTask" ADD CONSTRAINT "ScheduledTask_userProviderServiceId_fkey" FOREIGN KEY ("userProviderServiceId") REFERENCES "UserProviderService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProviderService" ADD CONSTRAINT "UserProviderService_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProviderService" ADD CONSTRAINT "UserProviderService_providerServiceId_fkey" FOREIGN KEY ("providerServiceId") REFERENCES "ProviderService"("id") ON DELETE CASCADE ON UPDATE CASCADE;
