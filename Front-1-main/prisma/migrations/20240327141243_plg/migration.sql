/*
  Warnings:

  - You are about to drop the `Research` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Research";

-- CreateTable
CREATE TABLE "Plg" (
    "id" TEXT NOT NULL,
    "plgId" TEXT,
    "username" TEXT,
    "recieveDate" TIMESTAMP(3),
    "email" TEXT,
    "result" JSONB,

    CONSTRAINT "Plg_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plg_plgId_key" ON "Plg"("plgId");
