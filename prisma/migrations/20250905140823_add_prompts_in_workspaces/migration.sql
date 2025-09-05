-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "graphGenerationPrompt" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "masterPrompt" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "textualGenerationPrompt" TEXT NOT NULL DEFAULT '';
