/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `prep_questions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('text', 'graph');

-- CreateTable
CREATE TABLE "conversations" (
    "uid" TEXT NOT NULL,
    "simulatorId" INTEGER NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stoppedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "prep_answers" (
    "id" SERIAL NOT NULL,
    "prepQuestionKey" TEXT NOT NULL,
    "conversationUid" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "prep_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "conversationUid" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" SERIAL NOT NULL,
    "conversationUid" TEXT NOT NULL,
    "evaluationKey" TEXT NOT NULL,
    "type" "AssessmentType" NOT NULL,
    "data" TEXT NOT NULL,
    "debrief" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prep_questions_key_key" ON "prep_questions"("key");

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_simulatorId_fkey" FOREIGN KEY ("simulatorId") REFERENCES "simulators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prep_answers" ADD CONSTRAINT "prep_answers_prepQuestionKey_fkey" FOREIGN KEY ("prepQuestionKey") REFERENCES "prep_questions"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prep_answers" ADD CONSTRAINT "prep_answers_conversationUid_fkey" FOREIGN KEY ("conversationUid") REFERENCES "conversations"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationUid_fkey" FOREIGN KEY ("conversationUid") REFERENCES "conversations"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_conversationUid_fkey" FOREIGN KEY ("conversationUid") REFERENCES "conversations"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_evaluationKey_fkey" FOREIGN KEY ("evaluationKey") REFERENCES "evaluations"("key") ON DELETE CASCADE ON UPDATE CASCADE;
