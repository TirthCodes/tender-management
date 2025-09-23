import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

export interface MainLotUpdate {
  dcPolCts: number;
  dcSalePrice?: number;
  dcSaleAmount?: number;
  dcCostPrice?: number;
  dcCostAmount?: number;
  isWon: boolean;
  margin?: number;
  dcBidPrice: number;
  dcBidAmount: number;
  dcResultCost?: number;
  dcResultPerCt: number;
  dcResultTotal: number;
  inUsedPcs: number;
  dcUsedCts: number;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const {
      dcPolCts,
      dcSalePrice,
      dcSaleAmount,
      dcCostPrice,
      dcCostAmount,
      isWon,
      margin,
      dcBidPrice,
      dcBidAmount,
      dcResultCost,
      dcResultPerCt,
      dcResultTotal,
      inUsedPcs,
      dcUsedCts
    } = (await req.json()) as MainLotUpdate;

    const { id } = await params;

    if (!id) {
      return Response.json(
        {
          success: false,
          message: "Tender ID is required",
        },
        { status: 400 }
      );
    }

    await prisma.mainLot.update({
      where: {
        id: Number(id),
      },
      data: {
        dcPolCts,
        dcSalePrice,
        dcSaleAmount,
        dcCostPrice,
        dcCostAmount,
        isWon,
        margin,
        dcBidPrice,
        dcBidAmount,
        dcResultCost,
        dcResultPerCt,
        dcResultTotal,
        inUsedPcs,
        dcUsedCts
      },
    });
    return Response.json(
      {
        success: true,
        message: "Main Lot updated successfully",
      },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Error updating tender",
      },
      { status: 500 }
    );
  }
}