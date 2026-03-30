/*
  Warnings:

  - You are about to drop the column `duration_minutes` on the `content_entry` table. All the data in the column will be lost.
  - Added the required column `duration_seconds` to the `content_entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "content_entry" DROP COLUMN "duration_minutes",
ADD COLUMN     "duration_seconds" INTEGER NOT NULL;
