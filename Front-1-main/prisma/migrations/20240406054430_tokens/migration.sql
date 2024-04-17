-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "plgToken" TEXT,
    "plgExpireDate" TIMESTAMP(3),

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_plgToken_key" ON "tokens"("plgToken");
