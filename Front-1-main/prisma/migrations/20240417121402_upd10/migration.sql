-- CreateTable
CREATE TABLE "Ref" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "recieveDate" TIMESTAMP(3),
    "link" TEXT,
    "title" TEXT,
    "style" TEXT,
    "authors" TEXT,
    "year" TEXT,
    "citation" TEXT,

    CONSTRAINT "Ref_pkey" PRIMARY KEY ("id")
);
