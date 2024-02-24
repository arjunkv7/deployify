/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "websiteKey" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,

    CONSTRAINT "websiteKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "websiteKey_key_key" ON "websiteKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "websiteKey_uniqueId_key" ON "websiteKey"("uniqueId");
