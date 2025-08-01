import { MixMultiLotTendersPage } from '@/components/pages/mix-multi-lot-tenders';
import { prisma } from '@/lib/prisma';
import React, { Suspense } from 'react'

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
        stTenderType: 'mix',
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
      <MixMultiLotTendersPage tenders={tendersData} totalCount={totalCount} />
    </Suspense>
  )
}
