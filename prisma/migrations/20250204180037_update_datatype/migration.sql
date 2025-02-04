-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "stUsername" TEXT NOT NULL,
    "stPasswordHash" TEXT NOT NULL,
    "stRole" "UserRole" NOT NULL DEFAULT 'USER',
    "dtCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tender" (
    "id" SERIAL NOT NULL,
    "dtVoucherDate" TIMESTAMP(3) NOT NULL,
    "stTenderName" TEXT NOT NULL,
    "stTenderType" TEXT NOT NULL,
    "dcNotePercentage" DECIMAL(10,2) NOT NULL,
    "stRemark" TEXT,
    "stLotNo" TEXT NOT NULL,
    "stRoughName" TEXT NOT NULL,
    "inTotalRoughPcs" INTEGER NOT NULL,
    "dcTotalRoughCts" DECIMAL(10,2),
    "dcRoughSize" DECIMAL(10,2),
    "dcRoughPrice" DECIMAL(10,2),
    "dcRoughTotal" DECIMAL(10,2),
    "dcBidPrice" DECIMAL(10,2) NOT NULL,
    "dcResultCost" DECIMAL(10,2) NOT NULL,
    "dcFinalCostPrice" DECIMAL(10,2) NOT NULL,
    "dcTotalAmount" DECIMAL(10,2) NOT NULL,
    "dcResultPerCt" DECIMAL(10,2) NOT NULL,
    "dcFinalBidPrice" DECIMAL(10,2) NOT NULL,
    "dcResultTotal" DECIMAL(10,2) NOT NULL,
    "dcFinalTotalAmount" DECIMAL(10,2) NOT NULL,
    "dtCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenderDetailsTable" (
    "id" SERIAL NOT NULL,
    "tenderId" INTEGER NOT NULL,
    "inRoughPcs" INTEGER NOT NULL,
    "dcRoughCts" DECIMAL(10,2) NOT NULL,
    "colorId" INTEGER NOT NULL,
    "clarityId" INTEGER NOT NULL,
    "fluorescenceId" INTEGER NOT NULL,
    "shapeId" INTEGER NOT NULL,
    "stColorGrade" TEXT NOT NULL,
    "dcPolCts" DECIMAL(10,2) NOT NULL,
    "dcPolPer" DECIMAL(10,2) NOT NULL,
    "dcDepth" DECIMAL(10,2),
    "dcTable" DECIMAL(10,2),
    "dcRatio" DECIMAL(10,2),
    "dcSalePrice" DECIMAL(10,2),
    "dcSaleAmount" DECIMAL(10,2),
    "dcCostPrice" DECIMAL(10,2),
    "dcCostAmount" DECIMAL(10,2),
    "dcTopsAmount" DECIMAL(10,2),
    "stIncription" TEXT,
    "dtCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenderDetailsTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MainLot" (
    "id" SERIAL NOT NULL,
    "stName" TEXT NOT NULL,
    "stRemarks" TEXT,
    "inPcs" INTEGER NOT NULL,
    "stCts" TEXT NOT NULL,
    "dcRate" DECIMAL(10,2) NOT NULL,
    "dcAmount" DECIMAL(10,2) NOT NULL,
    "dtCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MainLot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" SERIAL NOT NULL,
    "stName" TEXT NOT NULL,
    "stShortName" TEXT NOT NULL,
    "inSerial" INTEGER NOT NULL,
    "dtCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clarity" (
    "id" SERIAL NOT NULL,
    "stName" TEXT NOT NULL,
    "stShortName" TEXT NOT NULL,
    "inSerial" INTEGER NOT NULL,
    "dtCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clarity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fluorescence" (
    "id" SERIAL NOT NULL,
    "stName" TEXT NOT NULL,
    "stShortName" TEXT NOT NULL,
    "inSerial" INTEGER NOT NULL,
    "dtCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fluorescence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shape" (
    "id" SERIAL NOT NULL,
    "stName" TEXT NOT NULL,
    "stShortName" TEXT NOT NULL,
    "inSerial" INTEGER NOT NULL,
    "dtCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shape_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_stUsername_key" ON "User"("stUsername");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderDetailsTable" ADD CONSTRAINT "TenderDetailsTable_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "Tender"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderDetailsTable" ADD CONSTRAINT "TenderDetailsTable_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderDetailsTable" ADD CONSTRAINT "TenderDetailsTable_clarityId_fkey" FOREIGN KEY ("clarityId") REFERENCES "Clarity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderDetailsTable" ADD CONSTRAINT "TenderDetailsTable_fluorescenceId_fkey" FOREIGN KEY ("fluorescenceId") REFERENCES "Fluorescence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderDetailsTable" ADD CONSTRAINT "TenderDetailsTable_shapeId_fkey" FOREIGN KEY ("shapeId") REFERENCES "Shape"("id") ON DELETE CASCADE ON UPDATE CASCADE;
