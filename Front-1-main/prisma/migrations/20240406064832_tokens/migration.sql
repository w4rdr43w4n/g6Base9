/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "type" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "tokens_type_key" ON "tokens"("type");
