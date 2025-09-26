import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

export type MultiLotTender = {
  id?: number;
  stLotNo: string;
  stName: string;
  stRemarks?: string;
  inPcs: number;
  dcCts: number;
  baseTenderId: number;
  inRemainingPcs: number;
  dcRemainingCts: number;
  stTenderType: string;
};

export async function POST(req: Request) {
  const { session, user } = await getCurrentSession();

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const body = (await req.json()) as MultiLotTender;

    const {
      id,
      stLotNo,
      stName,
      stRemarks,
      inPcs,
      dcCts,
      stTenderType,
      baseTenderId,
    } = body;

    if (id) {

      const idInt = Number(id);
      const mainLot = await prisma.mainLot.findUnique({
        where: {
          id: idInt,
        },
        select: {
          dcResultPerCt: true,
          dcFinalBidPrice: true,
          dcResultTotal: true,
          dcFinalBidAmount: true,
        }
      });

      const updateData = {
        stName,
        stRemarks,
        inPcs,
        dcCts,
        stTenderType,
        baseTenderId: Number(baseTenderId),
        dcResultTotal: mainLot?.dcResultTotal?.toNumber() ?? 0,
        dcFinalBidAmount: mainLot?.dcFinalBidAmount?.toNumber() ?? 0,
      };
      
      if(mainLot) {
        const resultTotal =  Number(mainLot?.dcResultPerCt ?? 0) * Number(dcCts)
        const finalBidAmount = Number(mainLot?.dcFinalBidPrice ?? 0) * Number(dcCts)

        updateData.dcResultTotal = resultTotal;
        updateData.dcFinalBidAmount = finalBidAmount;
      }

      await prisma.mainLot.update({
        where: {
          id: idInt,
        },
        data: updateData,
      });

    } else {
      await prisma.mainLot.create({
        data: {
          stName,
          stRemarks,
          inPcs,
          dcCts,
          stLotNo,
          inRemainingPcs: inPcs,
          dcRemainingCts: dcCts,
          dcRate: 0,
          dcAmount: 0,
          stTenderType,
          baseTenderId: Number(baseTenderId),
        },
      });
    }

    return Response.json(
      {
        success: true,
        message: "Tender created successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Error creating tender",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { session, user } = await getCurrentSession();

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const page = url.searchParams.get("page");
  const tenderType = url.searchParams.get("tenderType") as string;
  const baseTenderId = url.searchParams.get("baseTenderId") as string;

  const limit = 10;
  const pageNumber = page ? parseInt(page) : 1;
  const offset = (pageNumber - 1) * limit;

  if (!tenderType) {
    return Response.json(
      {
        success: false,
        message: "Tender type is required",
      },
      { status: 400 }
    );
  }

  try {
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
          dcPolCts: true,
          dcCostPrice: true,
          dcCostAmount: true,
          dcBidPrice: true,
          dcBidAmount: true,
          inUsedPcs: true,
          dcUsedCts: true,
          dcResultTotal: true,
          isWon: true,
          dcResultPerCt: true,
          dcResultCost: true,
          dcSalePrice: true,
          dcSaleAmount: true,
        },
        where: {
          stTenderType: tenderType,
          baseTenderId: Number(baseTenderId),
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      }),
      prisma.mainLot.count({
        where: {
          stTenderType: tenderType,
          baseTenderId: Number(baseTenderId),
        },
      }),
    ]);

    const tendersData = tenders.map(
      ({
        dcCts,
        dcRemainingCts,
        dcPolCts,
        dcCostPrice,
        dcCostAmount,
        dcBidPrice,
        dcBidAmount,
        inUsedPcs,
        dcUsedCts,
        dcResultTotal,
        dcResultPerCt,
        isWon,
        dcResultCost,
        dcSalePrice,
        dcSaleAmount,
        ...rest
      }) => ({
        ...rest,
        inUsedPcs: inUsedPcs ?? 0,
        dcCts: dcCts.toNumber(),
        dcRemainingCts: dcRemainingCts.toNumber(),
        dcPolCts: dcPolCts?.toNumber() ?? 0,
        dcCostPrice: dcCostPrice?.toNumber() ?? 0,
        dcCostAmount: dcCostAmount?.toNumber() ?? 0,
        dcBidPrice: dcBidPrice?.toNumber() ?? 0,
        dcBidAmount: dcBidAmount?.toNumber() ?? 0,
        dcUsedCts: dcUsedCts?.toNumber() ?? 0,
        dcResultTotal: dcResultTotal?.toNumber() ?? 0,
        dcResultPerCt: dcResultPerCt?.toNumber() ?? 0,
        dcResultCost: dcResultCost?.toNumber() ?? 0,
        dcSalePrice: dcSalePrice?.toNumber() ?? 0,
        dcSaleAmount: dcSaleAmount?.toNumber() ?? 0,
        isWon: isWon ?? false,
      })
    );

    const hasNextPage = limit * pageNumber < totalCount;

    return Response.json(
      {
        data: tendersData,
        success: true,
        message: "Success",
        nextPage: hasNextPage ? pageNumber + 1 : null,
        totalCount,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Error creating tender",
      },
      { status: 500 }
    );
  }
}
