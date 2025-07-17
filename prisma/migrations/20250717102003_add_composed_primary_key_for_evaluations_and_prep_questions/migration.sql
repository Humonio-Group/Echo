/*
  Warnings:

  - The primary key for the `evaluations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `prep_questions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "evaluations" DROP CONSTRAINT "evaluations_pkey",
ADD CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id", "simulatorId");

-- AlterTable
ALTER TABLE "prep_questions" DROP CONSTRAINT "prep_questions_pkey",
ADD CONSTRAINT "prep_questions_pkey" PRIMARY KEY ("id", "simulatorId");
