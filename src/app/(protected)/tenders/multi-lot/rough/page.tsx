import { RoughMultiLotTendersPage } from '@/components/pages/rough-multi-lot-tenders'
import { prisma } from '@/lib/prisma';
import React, { Suspense } from 'react'

export const dynamic = "force-dynamic"

export default async function Page() {

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
      },
      where: {
        stTenderType: 'rough',
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
    prisma.mainLot.count(),
  ]);

  const tendersData = tenders.map(({ dcCts, dcRemainingCts, ...rest }) => ({  
    ...rest,
    dcCts: dcCts.toNumber(),
    dcRemainingCts: dcRemainingCts.toNumber(),
  }));

  return (
    <Suspense>
      <RoughMultiLotTendersPage tenders={tendersData} totalCount={totalCount} />
    </Suspense>
  )
}
