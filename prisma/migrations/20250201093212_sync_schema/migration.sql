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
    "stVoucherNumber" TIMESTAMP(3) NOT NULL,
    "stTenderName" TEXT NOT NULL,
    "stTenderType" TEXT NOT NULL,
    "dcNotePercentage" DOUBLE PRECISION NOT NULL,
    "stLotNo" TEXT NOT NULL,
    "stRoughName" TEXT NOT NULL,
    "inTotalRoughPcs" INTEGER NOT NULL,
    "dcTotalRoughCts" DOUBLE PRECISION,
    "dcRoughSize" DOUBLE PRECISION,
    "dcRoughPrice" DOUBLE PRECISION,
    "dcRoughTotal" DOUBLE PRECISION,
    "dcBidPrice" DOUBLE PRECISION NOT NULL,
    "dcResultCost" DOUBLE PRECISION NOT NULL,
    "dcFinalCostPrice" DOUBLE PRECISION NOT NULL,
    "dcTotalAmount" DOUBLE PRECISION NOT NULL,
    "dcResultPerCt" DOUBLE PRECISION NOT NULL,
    "dcFinalBidPrice" DOUBLE PRECISION NOT NULL,
    "dcResultTotal" DOUBLE PRECISION NOT NULL,
    "dcFinalTotalAmount" DOUBLE PRECISION NOT NULL,
    "dtCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenderDetailsTable" (
    "id" SERIAL NOT NULL,
    "tenderId" INTEGER NOT NULL,
    "inRoughPcs" INTEGER NOT NULL,
    "dcRoughCts" DOUBLE PRECISION NOT NULL,
    "colorId" INTEGER NOT NULL,
    "clarityId" INTEGER NOT NULL,
    "fluorescenceId" INTEGER NOT NULL,
    "shapeId" INTEGER NOT NULL,
    "stColorGrade" TEXT NOT NULL,
    "dcPolCts" DOUBLE PRECISION NOT NULL,
    "dcPolPer" DOUBLE PRECISION NOT NULL,
    "dcDepth" DOUBLE PRECISION,
    "dcTable" DOUBLE PRECISION,
    "dcRatio" DOUBLE PRECISION,
    "dcSellPrice" DOUBLE PRECISION NOT NULL,
    "dcCostPrice" DOUBLE PRECISION NOT NULL,
    "stDescription" TEXT,
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
    "dcRate" DOUBLE PRECISION NOT NULL,
    "dcAmount" DOUBLE PRECISION NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "TenderDetailsTable_colorId_key" ON "TenderDetailsTable"("colorId");

-- CreateIndex
CREATE UNIQUE INDEX "TenderDetailsTable_clarityId_key" ON "TenderDetailsTable"("clarityId");

-- CreateIndex
CREATE UNIQUE INDEX "TenderDetailsTable_fluorescenceId_key" ON "TenderDetailsTable"("fluorescenceId");

-- CreateIndex
CREATE UNIQUE INDEX "TenderDetailsTable_shapeId_key" ON "TenderDetailsTable"("shapeId");

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
