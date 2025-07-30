import { RoughLotTendersPage } from '@/components/pages/rough-lot-tenders'
import { prisma } from '@/lib/prisma'
import React from 'react'

export default async function Page({ searchParams }: { searchParams: Promise<{ baseTenderId?: string, mainLotId?: string }> }) {

  const { baseTenderId, mainLotId } = await searchParams;

  const whereCondition: {
    baseTenderId?: number;
    mainLotId?: number;
    stTenderType: "rough-lot";
  } = {
    stTenderType: "rough-lot"
  }

  if(baseTenderId) {
    whereCondition.baseTenderId = parseInt(baseTenderId);
  }

  if(mainLotId) {
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
        // dcRate: true,
        // dcAmount: true,
        stRemark: true,
        dcLabour: true,
        dcNetPercentage: true,
        dcBidPrice: true,
        dcLotSize: true,
        dcTotalAmount: true,
        dcResultPerCt: true,
        dcResultTotal: true,
        stLotNo: true,
      },
      orderBy: {
        createdAt: "desc",
      }
    }),
    prisma.otherTender.count({
      where: whereCondition
    })
  ])

  const roughLotData = roughLotTenders.map(({ dcNetPercentage, dcLabour, dcLotSize, dcBidPrice, dcResultPerCt, dcResultTotal,dcRoughCts, dcTotalAmount, ...rest }) => ({  
    ...rest,
    dcNetPercentage: dcNetPercentage.toNumber(),
    dcLabour: dcLabour.toNumber(),
    dcLotSize: dcLotSize.toNumber(),
    dcBidPrice: dcBidPrice.toNumber(),
    dcResultPerCt: dcResultPerCt?.toNumber() || 0,
    dcResultTotal: dcResultTotal?.toNumber() || 0,
    dcRoughCts: dcRoughCts.toNumber(),
    dcTotalAmount: dcTotalAmount?.toNumber() || 0,
  }));

  return (
    <RoughLotTendersPage roughLotTenders={roughLotData} totalCount={totalCount} />
  )
}
