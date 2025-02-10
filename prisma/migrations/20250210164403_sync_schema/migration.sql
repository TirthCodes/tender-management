/*
  Warnings:

  - You are about to drop the column `dcNotePercentage` on the `Tender` table. All the data in the column will be lost.
  - You are about to drop the column `inLabour` on the `TenderDetails` table. All the data in the column will be lost.
  - Added the required column `dcLabour` to the `Tender` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dcNetPercentage` to the `Tender` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stPersonName` to the `Tender` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tender" DROP COLUMN "dcNotePercentage",
ADD COLUMN     "dcLabour" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "dcNetPercentage" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "stPersonName" TEXT NOT NULL,
ADD COLUMN     "stStatus" TEXT;

-- AlterTable
ALTER TABLE "TenderDetails" DROP COLUMN "inLabour";
