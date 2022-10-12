/*
  Warnings:

  - You are about to alter the column `task` on the `todos` table. The data in that column could be lost. The data in that column will be cast from `VarChar(300)` to `VarChar(100)`.
  - You are about to drop the `todosPriority` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `todosStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "todos" DROP CONSTRAINT "todos_todoStatusId_fkey";

-- DropForeignKey
ALTER TABLE "todos" DROP CONSTRAINT "todos_todosPriorityId_fkey";

-- AlterTable
ALTER TABLE "todos" ADD COLUMN     "description" VARCHAR(1000),
ALTER COLUMN "task" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "stripeId" DROP NOT NULL;

-- DropTable
DROP TABLE "todosPriority";

-- DropTable
DROP TABLE "todosStatus";

-- CreateTable
CREATE TABLE "todoPriority" (
    "id" UUID NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "todoPriority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todoStatus" (
    "id" UUID NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "todoStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_todoStatusId_fkey" FOREIGN KEY ("todoStatusId") REFERENCES "todoStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_todosPriorityId_fkey" FOREIGN KEY ("todosPriorityId") REFERENCES "todoPriority"("id") ON DELETE SET NULL ON UPDATE CASCADE;
