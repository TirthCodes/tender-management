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

  const tendersData = tenders.map(({ dcCts, dcRemainingCts, ...rest }) => ({
    ...rest,
    dcCts: dcCts.toNumber(),
    dcRemainingCts: dcRemainingCts.toNumber(),
  }));

  return (
    <Suspense>
      <MixMultiLotTendersPage
        tenders={tendersData}
        totalCount={totalCount}
        baseTender={{
          ...baseTender,
          dcNetPercentage: Number(baseTender.dcNetPercentage),
          dcLabour: Number(baseTender.dcLabour),
        }}
      />
    </Suspense>
  );
}
