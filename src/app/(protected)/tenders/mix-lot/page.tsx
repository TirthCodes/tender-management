import { MixLotTendersPage } from "@/components/pages/mix-lot-tenders";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ baseTenderId: string }>;
}) {
  const { baseTenderId } = await searchParams;

  const [mixLotTenders, totalCount] = await Promise.all([
    prisma.otherTender.findMany({
      where: {
        baseTenderId: parseInt(baseTenderId),
        stTenderType: "mix-lot",
      },
      take: 10,
      select: {
        id: true,
        baseTenderId: true,
        inRoughPcs: true,
        dcRoughCts: true,
        // dcRate: true,
        // dcAmount: true,
        // stRemark: true,
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
      where: {
        baseTenderId: parseInt(baseTenderId),
        stTenderType: "mix-lot",
      },
    }),
  ]);

  const mixLotData = mixLotTenders.map(
    ({
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

  return (
    <MixLotTendersPage mixLotTenders={mixLotData} totalCount={totalCount} />
  );
}
