import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ baseTenderId: string }> }
) {
  const { baseTenderId } = await params;

  try {
    const mainLotTenders = await prisma.mainLot.findMany({
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
        dcBidPrice: true,
        dcBidAmount: true,
        dcCostPrice: true,
        dcCostAmount: true,
        dcSalePrice: true,
        dcSaleAmount: true,
        dcPolCts: true,
        dcResultCost: true,
        dcResultPerCt: true,
        dcResultTotal: true,
        isWon: true,
        margin: true,
        tender: {
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
            margin: true,
            dcResultCost: true,
            dcSalePrice: true,
            dcSaleAmount: true,
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
              },
            },
          },
        },
      },
      where: {
        baseTenderId: parseInt(baseTenderId),
      },
    });

    function filterByType(tenderType: string) {
      return mainLotTenders.filter((tender) => tender.stTenderType === tenderType);
    }

    return new Response(
      JSON.stringify({
        data: {
          rough: filterByType("rough"),
          mix: filterByType("mix"),
        },
        success: true,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message:
          error instanceof Error ? error.message : "Error getting tender",
        success: false,
      }),
      { status: 500 }
    );
  }
}
