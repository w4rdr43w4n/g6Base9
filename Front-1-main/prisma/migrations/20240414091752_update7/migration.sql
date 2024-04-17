/*
  Warnings:

  - You are about to drop the column `fileName` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Reflist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "fileName",
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Reflist" DROP COLUMN "title";
