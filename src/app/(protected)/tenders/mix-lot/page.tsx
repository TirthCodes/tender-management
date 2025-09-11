import { MixLotTendersPage } from "@/components/pages/mix-lot-tenders";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ baseTenderId?: string, mainLotId?: string }>;
}) {
  const { baseTenderId, mainLotId } = await searchParams;

  const whereCondition: {
    baseTenderId?: number;
    mainLotId?: number;
    stTenderType: "mix-lot";
  } = {
    stTenderType: "mix-lot"
  }

  if(baseTenderId) {
    whereCondition.baseTenderId = parseInt(baseTenderId);
  }

  if(mainLotId) {
    whereCondition.mainLotId = parseInt(mainLotId);
  }

  const [mixLotTenders, totalCount] = await Promise.all([
    prisma.otherTender.findMany({
      where: whereCondition,
      take: 10,
      select: {
        id: true,
        baseTenderId: true,
        inRoughPcs: true,
        dcRoughCts: true,
        dcRate: true,
        dcAmount: true,
        stRemark: true,
        dcLabour: true,
        dcNetPercentage: true,
        dcBidPrice: true,
        dcLotSize: true,
        dcTotalAmount: true,
        dcResultPerCt: true,
        dcResultTotal: true,
        dcResultCost: true,
        stLotNo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.otherTender.count({
      where: whereCondition,
    }),
  ]);

  const mixLotData = mixLotTenders.map(
    ({
      dcRate,
      dcAmount,
      dcNetPercentage,
      dcLabour,
      dcLotSize,
      dcBidPrice,
      dcResultPerCt,
      dcResultTotal,
      dcResultCost,
      dcRoughCts,
      dcTotalAmount,
      ...rest
    }) => ({
      ...rest,
      dcRate: dcRate.toNumber(),
      dcAmount: dcAmount.toNumber(),
      dcNetPercentage: dcNetPercentage.toNumber(),
      dcLabour: dcLabour.toNumber(),
      dcLotSize: dcLotSize.toNumber(),
      dcBidPrice: dcBidPrice.toNumber(),
      dcResultPerCt: dcResultPerCt?.toNumber() || 0,
      dcResultTotal: dcResultTotal?.toNumber() || 0,
      dcResultCost: dcResultCost?.toNumber() || 0,
      dcRoughCts: dcRoughCts.toNumber(),
      dcTotalAmount: dcTotalAmount?.toNumber() || 0,
    })
  );

  let mainLotDetails = null 
  if(mainLotId) {
    mainLotDetails = await prisma.mainLot.findUnique({
      where: {
        id: parseInt(mainLotId)
      },
      select: {
        stLotNo: true,
        stName: true,
        inPcs: true,
        dcCts: true,
        dcRemainingCts: true,
        inRemainingPcs: true,
      },
    })
  }

  return (
    <MixLotTendersPage 
      mixLotTenders={mixLotData} 
      totalCount={totalCount} 
      mainLot={{
        stLotNo: mainLotDetails?.stLotNo ?? "",
        stName: mainLotDetails?.stName ?? "",
        inPcs: mainLotDetails?.inPcs ?? 0,
        inRemainingPcs: mainLotDetails?.inRemainingPcs ?? 0,
        dcCts: mainLotDetails?.dcCts.toNumber() ?? 0,
        dcRemainingCts: mainLotDetails?.dcRemainingCts.toNumber() ?? 0,
      }}
    />
  );
}
