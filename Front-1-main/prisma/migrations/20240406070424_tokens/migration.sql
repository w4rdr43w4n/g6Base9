/*
  Warnings:

  - You are about to drop the column `type` on the `tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tokenType]` on the table `tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "tokens_type_key";

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "type",
ADD COLUMN     "tokenType" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "tokens_tokenType_key" ON "tokens"("tokenType");
