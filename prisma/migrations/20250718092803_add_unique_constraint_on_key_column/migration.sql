/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `evaluations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "evaluations" ALTER COLUMN "key" DROP DEFAULT;

-- AlterTable
ALTER TABLE "prep_questions" ALTER COLUMN "key" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_key_key" ON "evaluations"("key");
