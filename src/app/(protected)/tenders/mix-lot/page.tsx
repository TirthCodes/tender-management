import { MixLotTendersPage } from "@/components/pages/mix-lot-tenders";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import React from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ baseTenderId?: string; mainLotId?: string }>;
}) {
  const { baseTenderId, mainLotId } = await searchParams;

  const whereCondition: {
    baseTenderId?: number;
    mainLotId?: number;
    stTenderType: "mix-lot";
  } = {
    stTenderType: "mix-lot",
  };

  if (baseTenderId) {
    whereCondition.baseTenderId = parseInt(baseTenderId);
  }

  if (mainLotId) {
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
        dcSaleAmount: true,
        stLotNo: true,
        isWon: true,
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
      dcSaleAmount,
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
      dcSaleAmount: dcSaleAmount?.toNumber() || 0,
    })
  );

  let mainLotDetails = null;
  let totalValues = {
    pcs: 0,
    carats: 0,
    polCts: 0,
    salePrice: 0,
    saleAmount: 0,
    bidPrice: 0,
    bidAmount: 0,
    resultCost: 0,
    resultTotal: 0,
    resultPerCarat: 0,
  };
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
    if (mainLotDetails) {
      const pcs = mainLotDetails?.inPcs - mainLotDetails?.inRemainingPcs;
      const carats =
        mainLotDetails?.dcCts?.toNumber() -
        mainLotDetails?.dcRemainingCts?.toNumber();

      const mixLotDataTotal = mixLotData.reduce(
        (acc, cur) => {
          return {
            saleAmount: acc.saleAmount + cur.dcSaleAmount,
          };
        },
        {
          saleAmount: 0,
        }
      );

      const result = await prisma.$queryRawUnsafe<{ total: Decimal }[]>(
        `
          SELECT SUM(otd."dcPolCts") AS total
          FROM "OtherTender" ot
          JOIN "OtherTenderDetails" otd ON otd."otherTenderId" = ot.id
          WHERE ot."mainLotId" = $1 AND ot."baseTenderId" = $2 AND ot."stTenderType" = 'mix-lot'
        `,
        parseInt(mainLotId),
        baseTenderId ? parseInt(baseTenderId) : null
      );

      const totalPolCts = result?.[0]?.total ? result[0].total.toNumber() : 0;

      const saleAmount = parseFloat(mixLotDataTotal.saleAmount.toFixed(2));
      const salePrice = parseFloat(
        (mixLotDataTotal.saleAmount / totalPolCts).toFixed(2)
      );

      const bidPrice = parseFloat(((((((salePrice * 0.97) - 180) * totalPolCts) / carats) - 50) / 1.15).toFixed(2)); 
      const bidAmount = parseFloat(((bidPrice * mainLotDetails?.dcCts?.toNumber()).toFixed(2)));

      totalValues = {
        pcs: pcs ?? 0,
        carats: carats ? parseFloat(carats.toFixed(2)) : 0,
        polCts: totalPolCts,
        salePrice,
        saleAmount,
        bidPrice,
        bidAmount,
        resultCost: 0,
        resultTotal: 0,
        resultPerCarat: 0,
      };
    }
  }

  return (
    <MixLotTendersPage
      mixLotTenders={mixLotData}
      totalCount={totalCount}
      totalValues={totalValues}
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
