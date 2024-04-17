/*
  Warnings:

  - You are about to drop the column `recieveDate` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `recieveDate` on the `Literature` table. All the data in the column will be lost.
  - You are about to drop the column `recieveDate` on the `Outline` table. All the data in the column will be lost.
  - You are about to drop the column `recieveDate` on the `Reflist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[project]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[project]` on the table `Literature` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[project]` on the table `Outline` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[project]` on the table `Reflist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Article_title_key";

-- DropIndex
DROP INDEX "Literature_title_key";

-- DropIndex
DROP INDEX "Outline_title_key";

-- DropIndex
DROP INDEX "Reflist_title_key";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "recieveDate",
ADD COLUMN     "project" TEXT,
ADD COLUMN     "saveDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Literature" DROP COLUMN "recieveDate",
ADD COLUMN     "project" TEXT,
ADD COLUMN     "saveDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Outline" DROP COLUMN "recieveDate",
ADD COLUMN     "project" TEXT,
ADD COLUMN     "saveDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Reflist" DROP COLUMN "recieveDate",
ADD COLUMN     "project" TEXT,
ADD COLUMN     "saveDate" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Article_project_key" ON "Article"("project");

-- CreateIndex
CREATE UNIQUE INDEX "Literature_project_key" ON "Literature"("project");

-- CreateIndex
CREATE UNIQUE INDEX "Outline_project_key" ON "Outline"("project");

-- CreateIndex
CREATE UNIQUE INDEX "Reflist_project_key" ON "Reflist"("project");
