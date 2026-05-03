-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "sizes" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 100,
    "season" TEXT NOT NULL,
    "weather" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
