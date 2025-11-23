/*
  Warnings:

  - You are about to drop the column `emailTemplate` on the `NotificationConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NotificationConfig" DROP COLUMN "emailTemplate",
ADD COLUMN     "autoSubmitTime" TEXT;
