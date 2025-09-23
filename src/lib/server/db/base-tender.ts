import { prisma } from "@/lib/prisma";
import "server-only";

export const getBaseTendersDb = async () => {
  const [tenders, totalCount] = await Promise.all([
    prisma.baseTender.findMany({
      select: {
        id: true,
        dtVoucherDate: true,
        stTenderName: true,
        dcLabour: true,
        dcGiaCharge: true,
        dcNetPercentage: true,
        stPersonName: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    }),
    prisma.baseTender.count(),
  ]);

  const tendersData = tenders.map(({ dcNetPercentage, dcLabour, dcGiaCharge, ...rest }) => ({  
    ...rest,
    dcNetPercentage: dcNetPercentage.toNumber(),
    dcLabour: dcLabour.toNumber(),
    dcGiaCharge: dcGiaCharge.toNumber(),
  }));

  return {
    data: tendersData,
    success: true,
    message: "Success",
    nextPage: totalCount > 10 ? 2 : null,
    totalCount,
  };
};
