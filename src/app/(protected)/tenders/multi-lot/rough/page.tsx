import { RoughMultiLotTendersPage } from "@/components/pages/rough-multi-lot-tenders";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ baseTenderId: string }>;
}) {
  const { baseTenderId } = await searchParams;

  const baseTender = await prisma.baseTender.findUnique({
    select: {
      dtVoucherDate: true,
      stTenderName: true,
      stPersonName: true,
      dcNetPercentage: true,
      dcGiaCharge: true,
      dcLabour: true,
    },
    where: {
      id: parseInt(baseTenderId),
    },
  });

  if (!baseTender) {
    redirect("/tenders");
  }

  const [tenders, totalCount] = await Promise.all([
    prisma.mainLot.findMany({
      select: {
        id: true,
        stName: true,
        stLotNo: true,
        stRemarks: true,
        inPcs: true,
        dcCts: true,
        dcRemainingCts: true,
        inRemainingPcs: true,
        stTenderType: true,
        dcPolCts: true,
        dcCostPrice: true,
        dcCostAmount: true,
        dcBidPrice: true,
        dcBidAmount: true,
        inUsedPcs: true,
        dcUsedCts: true,
        dcResultTotal: true,
        isWon: true,
        dcResultPerCt: true,
      },
      where: {
        baseTenderId: parseInt(baseTenderId),
        stTenderType: "rough",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
    prisma.mainLot.count({
      where: {
        baseTenderId: parseInt(baseTenderId),
        stTenderType: "rough",
      },
    }),
  ]);

  const tendersData = tenders.map(
    ({
      dcCts,
      dcRemainingCts,
      dcPolCts,
      dcCostPrice,
      dcCostAmount,
      dcBidPrice,
      dcBidAmount,
      inUsedPcs,
      dcUsedCts,
      dcResultTotal,
      dcResultPerCt,
      isWon,
      ...rest
    }) => ({
      ...rest,
      inUsedPcs: inUsedPcs ?? 0,
      dcCts: dcCts.toNumber(),
      dcRemainingCts: dcRemainingCts.toNumber(),
      dcPolCts: dcPolCts?.toNumber() ?? 0,
      dcCostPrice: dcCostPrice?.toNumber() ?? 0,
      dcCostAmount: dcCostAmount?.toNumber() ?? 0,
      dcBidPrice: dcBidPrice?.toNumber() ?? 0,
      dcBidAmount: dcBidAmount?.toNumber() ?? 0,
      dcUsedCts: dcUsedCts?.toNumber() ?? 0,
      dcResultTotal: dcResultTotal?.toNumber() ?? 0,
      dcResultPerCt: dcResultPerCt?.toNumber() ?? 0,
      isWon: isWon ?? false,
    })
  );

  return (
    <Suspense>
      <RoughMultiLotTendersPage
        tenders={tendersData}
        totalCount={totalCount}
        baseTender={{
          ...baseTender,
          dcNetPercentage: Number(baseTender.dcNetPercentage),
          dcLabour: Number(baseTender.dcLabour),
          dcGiaCharge: Number(baseTender.dcGiaCharge),
        }}
      />
    </Suspense>
  );
}
