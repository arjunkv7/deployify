-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_key_key" ON "User"("key");

-- CreateIndex
CREATE UNIQUE INDEX "User_uniqueId_key" ON "User"("uniqueId");
