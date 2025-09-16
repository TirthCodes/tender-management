import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ baseTenderId: string }> }
) {
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

  const id = parseInt(baseTenderId);

  if (!id) {
    return Response.json(
      {
        success: false,
        message: "Missing ID",
      },
      { status: 400 }
    );
  }

  try {
    const mixLotTenders = await prisma.otherTender.findMany({
      where: {
        baseTenderId: id,
        stTenderType: "mix-lot",
      },
      select: {
        id: true,
        baseTenderId: true,
        inRoughPcs: true,
        dcRoughCts: true,
        stRemark: true,
        dcLabour: true,
        dcNetPercentage: true,
        dcBidPrice: true,
        dcLotSize: true,
        dcTotalAmount: true,
        dcResultPerCt: true,
        dcResultTotal: true,
        dcResultCost: true,
        stLotNo: true,
        dcSalePrice: true,
        dcSaleAmount: true,
        isWon: true,
        margin: true,
        otherTenderDetails: {
          select: {
            id: true,
            inRoughPcs: true,
            dcRoughCts: true,
            colorId: true,
            color: {
              select: {
                id: true,
                stShortName: true,
              },
            },
            clarityId: true,
            clarity: {
              select: {
                id: true,
                stShortName: true,
              },
            },
            fluorescenceId: true,
            fluorescence: {
              select: {
                id: true,
                stShortName: true,
              },
            },
            shapeId: true,
            shape: {
              select: {
                id: true,
                stShortName: true,
              },
            },
            dcPolCts: true,
            dcPolPer: true,
            dcSalePrice: true,
            dcSaleAmount: true,
            stRemark: true,
          },
        },
      },
    });

    return Response.json(
      {
        data: mixLotTenders,
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
