-- CreateTable
CREATE TABLE "Research" (
    "id" TEXT NOT NULL,
    "plgId" TEXT,
    "username" TEXT,
    "email" TEXT,
    "result" TEXT,

    CONSTRAINT "Research_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Research_plgId_key" ON "Research"("plgId");

-- CreateIndex
CREATE UNIQUE INDEX "Research_username_key" ON "Research"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Research_email_key" ON "Research"("email");
