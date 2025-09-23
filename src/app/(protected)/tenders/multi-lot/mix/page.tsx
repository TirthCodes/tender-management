import { MixMultiLotTendersPage } from "@/components/pages/mix-multi-lot-tenders";
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
      dcLabour: true,
      dcGiaCharge: true,
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
        isWon: true,
        dcBidPrice: true,
        dcBidAmount: true,
        dcResultCost: true,
        dcSalePrice: true,
        dcSaleAmount: true,
        dcResultPerCt: true,
        dcResultTotal: true,
        inUsedPcs: true,
        dcPolCts: true,
        dcUsedCts: true,
      },
      where: {
        baseTenderId: parseInt(baseTenderId),
        stTenderType: "mix",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
    prisma.mainLot.count({
      where: {
        baseTenderId: parseInt(baseTenderId),
        stTenderType: "mix",
      },
    }),
  ]);

  const tendersData = tenders.map(
    ({
      dcCts,
      dcRemainingCts,
      dcBidPrice,
      dcBidAmount,
      dcResultCost,
      dcSalePrice,
      dcSaleAmount,
      dcResultPerCt,
      dcResultTotal,
      dcUsedCts,
      dcPolCts,
      isWon,
      ...rest
    }) => ({
      ...rest,
      dcCts: dcCts.toNumber(),
      dcRemainingCts: dcRemainingCts.toNumber(),
      isWon: isWon ?? false,
      dcBidPrice: dcBidPrice?.toNumber() ?? 0,
      dcBidAmount: dcBidAmount?.toNumber() ?? 0,
      dcSalePrice: dcSalePrice?.toNumber() ?? 0,
      dcSaleAmount: dcSaleAmount?.toNumber() ?? 0,
      dcResultCost: dcResultCost?.toNumber() ?? 0,
      dcResultPerCt: dcResultPerCt?.toNumber() ?? 0,
      dcResultTotal: dcResultTotal?.toNumber() ?? 0,
      dcUsedCts: dcUsedCts?.toNumber() ?? 0,
      dcPolCts: dcPolCts?.toNumber() ?? 0,
    })
  );

  return (
    <Suspense>
      <MixMultiLotTendersPage
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
