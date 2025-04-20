import { prisma } from "@/lib/prisma";
import "server-only";

export const getTendersDb = async () => {
  const [tenders, totalCount] = await Promise.all([
    prisma.tender.findMany({
      select: {
        id: true,
        dtVoucherDate: true,
        stTenderName: true,
        dcLabour: true,
        dcNetPercentage: true,
        stPersonName: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    }),
    prisma.tender.count(),
  ]);

  const tendersData = tenders.map(({ dcNetPercentage, dcLabour, ...rest }) => ({  
    ...rest,
    dcNetPercentage: dcNetPercentage.toNumber(),
    dcLabour: dcLabour.toNumber(),
  }));

  return {
    data: tendersData,
    success: true,
    message: "Success",
    nextPage: totalCount > 10 ? 2 : null,
    totalCount,
  };
};
