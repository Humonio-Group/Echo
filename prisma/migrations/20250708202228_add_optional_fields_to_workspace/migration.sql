-- AlterTable
ALTER TABLE "workspaces" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "companyInfo" SET DEFAULT '',
ALTER COLUMN "productOrService" SET DEFAULT '',
ALTER COLUMN "values" SET DEFAULT '';
