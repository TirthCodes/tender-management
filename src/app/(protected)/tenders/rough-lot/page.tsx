import { OtherBaseTender, RoughLotTendersPage } from "@/components/pages/rough-lot-tenders";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ baseTenderId?: string; mainLotId?: string }>;
}) {
  const { baseTenderId, mainLotId } = await searchParams;

  const whereCondition: {
    baseTenderId?: number;
    mainLotId?: number | null;
    stTenderType: "rough-lot";
  } = {
    stTenderType: "rough-lot",
  };

  let baseTenderData: OtherBaseTender = {
    dtVoucherDate: new Date(),
    stTenderName: "",
    stPersonName: "",
  };

  if (baseTenderId) {
    whereCondition.baseTenderId = parseInt(baseTenderId);
    whereCondition.mainLotId = null;
    const baseTender = await prisma.baseTender.findUnique({
      select: {
        dtVoucherDate: true,
        stTenderName: true,
        stPersonName: true,
      },
      where: {
        id: Number(baseTenderId),
      },
    });

    if (!baseTender) {
      redirect("/tenders");
    }
    baseTenderData = baseTender;
  }

  if (mainLotId) {
    whereCondition.mainLotId = parseInt(mainLotId);
  }

  const [roughLotTenders, totalCount] = await Promise.all([
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
        dcCostPrice: true,
        dcCostAmount: true,
        isWon: true,
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

  let mainLotDetails = null;
  if (mainLotId) {
    mainLotDetails = await prisma.mainLot.findUnique({
      where: {
        id: parseInt(mainLotId),
      },
      select: {
        stLotNo: true,
        stName: true,
        inPcs: true,
        dcCts: true,
        dcRemainingCts: true,
        inRemainingPcs: true,
      },
    });
  }

  const roughLotData = roughLotTenders.map(
    ({
      dcCostPrice,
      dcCostAmount,
      dcRate,
      dcAmount,
      dcNetPercentage,
      dcLabour,
      dcLotSize,
      dcBidPrice,
      dcResultPerCt,
      dcResultTotal,
      dcRoughCts,
      dcTotalAmount,
      ...rest
    }) => ({
      ...rest,
      dcCostPrice: dcCostPrice?.toNumber() ?? 0,
      dcCostAmount: dcCostAmount?.toNumber() ?? 0,
      dcRate: dcRate.toNumber(),
      dcAmount: dcAmount.toNumber(),
      dcNetPercentage: dcNetPercentage.toNumber(),
      dcLabour: dcLabour.toNumber(),
      dcLotSize: dcLotSize.toNumber(),
      dcBidPrice: dcBidPrice.toNumber(),
      dcResultPerCt: dcResultPerCt?.toNumber() ?? 0,
      dcResultTotal: dcResultTotal?.toNumber() ?? 0,
      dcRoughCts: dcRoughCts.toNumber(),
      dcTotalAmount: dcTotalAmount?.toNumber() ?? 0,
    })
  );

  return (
    <RoughLotTendersPage
      roughLotTenders={roughLotData}
      totalCount={totalCount}
      baseTender={baseTenderData}
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
