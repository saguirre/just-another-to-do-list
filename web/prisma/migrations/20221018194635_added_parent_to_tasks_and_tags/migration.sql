-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "color" VARCHAR(30),
ADD COLUMN     "parentId" INTEGER;

-- AlterTable
ALTER TABLE "todos" ADD COLUMN     "parentId" INTEGER;
