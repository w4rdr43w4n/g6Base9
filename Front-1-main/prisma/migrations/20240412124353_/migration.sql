-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "recieveDate" TIMESTAMP(3),
    "link" TEXT,
    "name" TEXT,
    "type" TEXT,
    "status" TEXT,
    "total_pages" INTEGER,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
