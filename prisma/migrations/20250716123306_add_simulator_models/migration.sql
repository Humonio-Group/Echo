-- CreateTable
CREATE TABLE "simulators" (
    "id" SERIAL NOT NULL,
    "workspaceId" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "picture" TEXT,
    "duration" INTEGER NOT NULL,
    "behaviorPrompt" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "simulators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prep_questions" (
    "id" SERIAL NOT NULL,
    "simulatorId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "prep_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" SERIAL NOT NULL,
    "simulatorId" INTEGER NOT NULL,
    "frameworkPrompt" TEXT NOT NULL,
    "assessmentPrompt" TEXT NOT NULL,
    "feedbackPrompt" TEXT NOT NULL,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "simulators" ADD CONSTRAINT "simulators_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prep_questions" ADD CONSTRAINT "prep_questions_simulatorId_fkey" FOREIGN KEY ("simulatorId") REFERENCES "simulators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_simulatorId_fkey" FOREIGN KEY ("simulatorId") REFERENCES "simulators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
