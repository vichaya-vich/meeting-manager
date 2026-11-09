/*
  Warnings:

  - A unique constraint covering the columns `[name_normalized]` on the table `candidates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name_normalized` to the `candidates` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "candidates_name_key";

-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "name_normalized" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "candidates_name_normalized_key" ON "candidates"("name_normalized");
