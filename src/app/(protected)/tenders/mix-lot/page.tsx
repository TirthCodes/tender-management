import { MixLotTendersPage } from "@/components/pages/mix-lot-tenders";
import { OtherBaseTender } from "@/components/pages/rough-lot-tenders";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ baseTenderId?: string; mainLotId?: string }>;
}) {
  const { baseTenderId, mainLotId } = await searchParams;

  const whereCondition: {
    baseTenderId?: number;
    mainLotId?: number | null;
    stTenderType: "mix-lot";
  } = {
    stTenderType: "mix-lot",
  };

  let baseTenderData: OtherBaseTender = {
    dtVoucherDate: new Date(),
    stTenderName: "",
    stPersonName: "",
    dcNetPercentage: 0,
    dcLabour: 0,
    dcGiaCharge: 0,
  };

  if (baseTenderId) {
    whereCondition.baseTenderId = parseInt(baseTenderId);
    whereCondition.mainLotId = null;

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
        id: Number(baseTenderId),
      },
    });

    if (!baseTender) {
      redirect("/tenders");
    }
    baseTenderData = {
      ...baseTender,
      dcNetPercentage: Number(baseTender.dcNetPercentage),
      dcLabour: Number(baseTender.dcLabour),
      dcGiaCharge: Number(baseTender.dcGiaCharge),
    };
  }

  if (mainLotId) {
    whereCondition.mainLotId = parseInt(mainLotId);
  }

  const [mixLotTenders, totalCount] = await Promise.all([
    prisma.otherTender.findMany({
      where: whereCondition,
      take: 50,
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
        dcPolCts: true,
        dcBidPrice: true,
        dcBidAmount: true,
        dcResultCost: true,
        dcSaleAmount: true,
        dcSalePrice: true,
        isWon: true,
        dcResultTotal: true,
        dcResultPerCt: true,
        inUsedPcs: true,
        dcUsedCts: true,
      },
    });
    if (mainLotDetails) {
      const mixLotDataTotal = mixLotData.reduce(
        (acc, cur) => {
          return {
            pcs: acc.pcs + cur.inRoughPcs,
            carats: acc.carats + cur.dcRoughCts,
            saleAmount: acc.saleAmount + cur.dcSaleAmount,
          };
        },
        {
          pcs: 0,
          carats: 0,
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
  
      const bidPrice = parseFloat(((((((salePrice * 0.97) - baseTenderData.dcGiaCharge) * totalPolCts) / mixLotDataTotal?.carats) - 50) / 1.15).toFixed(2)); 
      const bidAmount = parseFloat(((bidPrice * mainLotDetails?.dcCts?.toNumber()).toFixed(2)));
  
      totalValues = {
        pcs: mixLotDataTotal?.pcs ?? 0,
        carats: mixLotDataTotal?.pcs ? parseFloat(mixLotDataTotal?.carats.toFixed(2)) : 0,
        polCts: totalPolCts,
        salePrice,
        saleAmount,
        bidPrice,
        bidAmount,
        resultCost: mainLotDetails?.dcResultCost?.toNumber() ?? 0,
        resultTotal: mainLotDetails?.dcResultTotal?.toNumber() ?? 0,
        resultPerCarat: mainLotDetails?.dcResultPerCt?.toNumber() ?? 0,
      };
    }
  }

  return (
    <MixLotTendersPage
      mixLotTenders={mixLotData}
      totalCount={totalCount}
      totalValues={totalValues}
      baseTender={baseTenderData}
      mainLot={{
        stLotNo: mainLotDetails?.stLotNo ?? "",
        stName: mainLotDetails?.stName ?? "",
        inPcs: mainLotDetails?.inPcs ?? 0,
        inRemainingPcs: mainLotDetails?.inRemainingPcs ?? 0,
        dcCts: mainLotDetails?.dcCts.toNumber() ?? 0,
        dcRemainingCts: mainLotDetails?.dcRemainingCts.toNumber() ?? 0,
        isWon: mainLotDetails?.isWon ?? false,
      }}
    />
  );
}
