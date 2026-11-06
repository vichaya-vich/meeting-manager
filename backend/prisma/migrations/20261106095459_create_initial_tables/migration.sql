-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('PENDING', 'CONFIRM', 'CANCELED');

-- CreateTable
CREATE TABLE "meetings" (
    "id" SERIAL NOT NULL,
    "type" "MeetingType" NOT NULL,
    "status" "MeetingStatus" NOT NULL,
    "start_at" TIMESTAMPTZ(6) NOT NULL,
    "end_at" TIMESTAMPTZ(6) NOT NULL,
    "role" TEXT NOT NULL,
    "note" TEXT,
    "feedback" TEXT,
    "candidate_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "meetings_start_at_idx" ON "meetings"("start_at");

-- CreateIndex
CREATE INDEX "meetings_status_start_at_idx" ON "meetings"("status", "start_at");

-- CreateIndex
CREATE INDEX "meetings_candidate_id_role_start_at_idx" ON "meetings"("candidate_id", "role", "start_at");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_name_key" ON "candidates"("name");

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
