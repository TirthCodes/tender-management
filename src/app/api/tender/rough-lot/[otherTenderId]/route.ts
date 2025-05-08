import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ otherTenderId: string }> }
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

  const { otherTenderId } = await params;

  const id = parseInt(otherTenderId);

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
    const roughtLotTenders = await prisma.otherTender.findUnique({
      where: {
        id,
      },
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
        stLotNo: true,
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
            // shapeId: true,
            shape: {
              select: {
                id: true,
                stShortName: true,
              },
            },
            stRemark: true,
            inColorGrade: true,
            dcPolCts: true,
            dcPolPer: true,
            dcDepth: true,
            dcTable: true,
            dcRatio: true,
            dcSalePrice: true,
            dcSaleAmount: true,
            dcLabour: true,
            dcCostPrice: true,
            dcCostAmount: true,
          },
        },
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
          error instanceof Error ? error.message : "Error creating tender",
      },
      { status: 500 }
    );
  }
}
