-- AlterEnum
ALTER TYPE "RoomRole" ADD VALUE 'SPECTATOR';

-- CreateTable
CREATE TABLE "roominvites" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "role" "RoomRole" NOT NULL DEFAULT 'MEMBER',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roominvites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roominvites_token_key" ON "roominvites"("token");

-- CreateIndex
CREATE INDEX "roominvites_token_idx" ON "roominvites" USING HASH ("token");

-- CreateIndex
CREATE INDEX "roominvites_expiresAt_idx" ON "roominvites"("expiresAt" ASC);

-- CreateIndex
CREATE INDEX "rooms_name_idx" ON "rooms" USING HASH ("name");

-- AddForeignKey
ALTER TABLE "roominvites" ADD CONSTRAINT "roominvites_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
