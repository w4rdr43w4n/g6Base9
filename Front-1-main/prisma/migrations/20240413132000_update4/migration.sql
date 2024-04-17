/*
  Warnings:

  - You are about to drop the column `name` on the `Document` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Literature` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Outline` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Reflist` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "name",
ADD COLUMN     "fileName" TEXT;

-- AlterTable
ALTER TABLE "Reflist" ADD COLUMN     "title" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Article_title_key" ON "Article"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Literature_title_key" ON "Literature"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Outline_title_key" ON "Outline"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Reflist_title_key" ON "Reflist"("title");
