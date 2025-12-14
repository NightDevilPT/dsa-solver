/*
  Warnings:

  - A unique constraint covering the columns `[provider,problemId,problemDate]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider,questionType,problemDate,isGlobal]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Problem_provider_questionType_problemDate_key";

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "isGlobal" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_ProblemToUserProviderService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProblemToUserProviderService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProblemToUserProviderService_B_index" ON "_ProblemToUserProviderService"("B");

-- CreateIndex
CREATE INDEX "Problem_isGlobal_provider_questionType_problemDate_idx" ON "Problem"("isGlobal", "provider", "questionType", "problemDate");

-- CreateIndex
CREATE INDEX "Problem_provider_problemId_idx" ON "Problem"("provider", "problemId");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_provider_problemId_problemDate_key" ON "Problem"("provider", "problemId", "problemDate");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_provider_questionType_problemDate_isGlobal_key" ON "Problem"("provider", "questionType", "problemDate", "isGlobal");

-- AddForeignKey
ALTER TABLE "_ProblemToUserProviderService" ADD CONSTRAINT "_ProblemToUserProviderService_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemToUserProviderService" ADD CONSTRAINT "_ProblemToUserProviderService_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProviderService"("id") ON DELETE CASCADE ON UPDATE CASCADE;
