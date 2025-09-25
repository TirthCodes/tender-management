import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

export async function GET(_req: Request, { params }: { params: Promise<{ baseTenderId: string }> }) {
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

  const { baseTenderId } = await params;

  if (!baseTenderId) {
    return Response.json(
      {
        success: false,
        message: "Missing base tender ID",
      },
      { status: 400 }
    );
  }

  const whereCondition: {
    baseTenderId: number;
    stTenderType: "rough-lot";
    mainLotId: null;
  } = {
    baseTenderId: parseInt(baseTenderId),
    stTenderType: "rough-lot",
    mainLotId: null,
  }

  try {
    const roughtLotTenders = await prisma.otherTender.findMany({
      where: whereCondition,
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
        dcCostPrice: true,
        dcCostAmount: true,
        stLotNo: true,
        isWon: true,
        dcFinalBidPrice: true,
        dcFinalBidAmount: true,
        margin: true,
        otherTenderDetails: {
          select: {
            id: true,
            inRoughPcs: true,
            dcRoughCts: true,           
            stRemark: true,
            dcPolCts: true,
            dcPolPer: true,
            dcSalePrice: true,
            dcSaleAmount: true,
            dcLabour: true,
            dcCostPrice: true,
            dcCostAmount: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(
      {
        data: roughtLotTenders,
        success: true,
        message: "Success",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Error getting tender",
      },
      { status: 500 }
    );
  }
}
