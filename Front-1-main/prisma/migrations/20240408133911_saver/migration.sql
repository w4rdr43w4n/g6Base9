-- CreateTable
CREATE TABLE "Literature" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "recieveDate" TIMESTAMP(3),
    "title" TEXT,
    "content" TEXT,
    "style" TEXT,

    CONSTRAINT "Literature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "recieveDate" TIMESTAMP(3),
    "title" TEXT,
    "content" TEXT,
    "style" TEXT,
    "outline" TEXT,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outline" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "recieveDate" TIMESTAMP(3),
    "title" TEXT,
    "content" TEXT,

    CONSTRAINT "Outline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reflist" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "recieveDate" TIMESTAMP(3),
    "style" TEXT,
    "list" TEXT,

    CONSTRAINT "Reflist_pkey" PRIMARY KEY ("id")
);
