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
      await prisma.mainLot.update({
        where: {
          id: Number(id),
        },
        data: {
          stName,
          stRemarks,
          inPcs,
          dcCts,
          stTenderType,
          baseTenderId: Number(baseTenderId),
        },
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

    const hasNextPage = limit * pageNumber < totalCount;

    return Response.json(
      {
        data: tenders,
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
