/*
  Warnings:

  - You are about to drop the `TenderDetailsTable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TenderDetailsTable" DROP CONSTRAINT "TenderDetailsTable_clarityId_fkey";

-- DropForeignKey
ALTER TABLE "TenderDetailsTable" DROP CONSTRAINT "TenderDetailsTable_colorId_fkey";

-- DropForeignKey
ALTER TABLE "TenderDetailsTable" DROP CONSTRAINT "TenderDetailsTable_fluorescenceId_fkey";

-- DropForeignKey
ALTER TABLE "TenderDetailsTable" DROP CONSTRAINT "TenderDetailsTable_shapeId_fkey";

-- DropForeignKey
ALTER TABLE "TenderDetailsTable" DROP CONSTRAINT "TenderDetailsTable_tenderId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "dtUpdatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "TenderDetailsTable";

-- CreateTable
CREATE TABLE "TenderDetails" (
    "id" SERIAL NOT NULL,
    "tenderId" INTEGER NOT NULL,
    "inRoughPcs" INTEGER NOT NULL,
    "dcRoughCts" DECIMAL(10,2) NOT NULL,
    "colorId" INTEGER NOT NULL,
    "clarityId" INTEGER NOT NULL,
    "fluorescenceId" INTEGER NOT NULL,
    "shapeId" INTEGER NOT NULL,
    "stColorGrade" INTEGER NOT NULL,
    "dcPolCts" DECIMAL(10,2) NOT NULL,
    "dcPolPer" DECIMAL(10,2) NOT NULL,
    "dcDepth" DECIMAL(10,2),
    "dcTable" DECIMAL(10,2),
    "dcRatio" DECIMAL(10,2),
    "inLabour" INTEGER NOT NULL,
    "dcSalePrice" DECIMAL(10,2),
    "dcSaleAmount" DECIMAL(10,2),
    "dcCostPrice" DECIMAL(10,2),
    "dcCostAmount" DECIMAL(10,2),
    "dcTopsAmount" DECIMAL(10,2),
    "stIncription" TEXT,
    "dtCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenderDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TenderDetails" ADD CONSTRAINT "TenderDetails_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "Tender"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderDetails" ADD CONSTRAINT "TenderDetails_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderDetails" ADD CONSTRAINT "TenderDetails_clarityId_fkey" FOREIGN KEY ("clarityId") REFERENCES "Clarity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderDetails" ADD CONSTRAINT "TenderDetails_fluorescenceId_fkey" FOREIGN KEY ("fluorescenceId") REFERENCES "Fluorescence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderDetails" ADD CONSTRAINT "TenderDetails_shapeId_fkey" FOREIGN KEY ("shapeId") REFERENCES "Shape"("id") ON DELETE CASCADE ON UPDATE CASCADE;
