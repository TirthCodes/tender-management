import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";
import { MixLotPaylod, MixLotTenderDetails } from "@/lib/types/tender";
import { Decimal } from "@prisma/client/runtime/library";

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
    const {
      id,
      lotNo,
      lotSize,
      roughPcs,
      roughCts,
      labour,
      netPercent,
      remark,
      baseTenderId,
      rate,
      amount,
      bidPrice,
      totalAmount,
      resultPerCarat,
      resultTotal,
      tenderDetails,
      mainLotId,
      salePrice,
      saleAmount,
      resultCost,
      isWon,
    } = (await req.json()) as MixLotPaylod;

    if (!baseTenderId || !roughPcs || !roughCts || !labour || !netPercent) {
      return Response.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const parsedTenderDetails: Array<MixLotTenderDetails> =
      typeof tenderDetails === "string"
        ? JSON.parse(tenderDetails)
        : tenderDetails;

    if (id) {
      const updatedTender = await prisma.otherTender.update({
        where: { id },
        data: {
          baseTenderId,
          inRoughPcs: roughPcs,
          dcRoughCts: roughCts,
          dcBidPrice: bidPrice || 0,
          dcTotalAmount: totalAmount || 0,
          dcResultPerCt: resultPerCarat || 0,
          dcResultTotal: resultTotal || 0,
          dcResultCost: resultCost || 0,
          dcLotSize: lotSize || 0,
          stLotNo: lotNo,
          stTenderType: "mix-lot",
          dcRate: rate || 0,
          dcAmount: amount || 0,
          stRemark: remark || "",
          dcLabour: labour,
          dcNetPercentage: netPercent,
          mainLotId,
          stCertId: "",
          dcSalePrice: salePrice || 0,
          dcSaleAmount: saleAmount || 0,
          isWon,
        },
      });

      if (mainLotId) {
        const mainLot = await prisma.mainLot.findUnique({
          where: {
            id: mainLotId,
          },
          select: {
            dcCts: true,
            inPcs: true,
          },
        });

        const result = await prisma.$queryRaw<
          Array<{
            total_pcs: number;
            total_carats: Decimal;
          }>
        >`
          SELECT 
            COALESCE(SUM("inRoughPcs"), 0)::bigint as total_pcs,
            COALESCE(SUM("dcRoughCts"), 0) as total_carats
          FROM "OtherTender"
          WHERE "baseTenderId" = ${baseTenderId}
            AND "mainLotId" = ${mainLotId}
            AND "stTenderType" = 'mix-lot'
        `;

        const totalPcs = Number(result[0]?.total_pcs || 0);
        const totalCarats = Number(result[0]?.total_carats ?? 0);

        await prisma.mainLot.update({
          where: {
            id: mainLotId,
          },
          data: {
            dcRemainingCts:
              (mainLot?.dcCts ? mainLot?.dcCts.toNumber() : 0) - totalCarats,
            inRemainingPcs: (mainLot?.inPcs ?? 0) - totalPcs,
          },
        });
      }

      // Then handle the tender details
      if (parsedTenderDetails && parsedTenderDetails.length > 0) {
        // Process each detail in the array
        const newDetailsId: number[] = [];
        for (const detail of parsedTenderDetails) {
          if (detail.id) {
            // Update existing detail
            await prisma.otherTenderDetails.update({
              where: { id: detail.id },
              data: {
                inRoughPcs: detail.inRoughPcs,
                dcRoughCts: detail.dcRoughCts,
                colorId: detail.color.id,
                clarityId: detail.clarity.id,
                fluorescenceId: detail.fluorescence.id,
                shapeId: detail.shape.id,
                stRemark: detail.stRemark || "",
                // inColorGrade: detail.inColorGrade,
                dcPolCts: detail.dcPolCts,
                dcPolPer: detail.dcPolPer,
                // dcDepth: detail.dcDepth,
                // dcTable: detail.dcTable,
                // dcRatio: detail.dcRatio,
                dcSalePrice: detail.dcSalePrice,
                dcSaleAmount: detail.dcSaleAmount,
              },
            });
          } else {
            // Create new detail for this tender
            const newDetail = await prisma.otherTenderDetails.create({
              data: {
                otherTenderId: id,
                inRoughPcs: detail.inRoughPcs ?? 0,
                dcRoughCts: detail.dcRoughCts ?? 0,
                colorId: detail.color.id,
                clarityId: detail.clarity.id,
                fluorescenceId: detail.fluorescence.id,
                shapeId: detail.shape.id,
                stRemark: detail.stRemark || "",
                inColorGrade: 0,
                dcPolCts: detail.dcPolCts ?? 0,
                dcPolPer: detail.dcPolPer ?? 0,
                dcDepth: 0,
                dcTable: 0,
                dcRatio: 0,
                dcSalePrice: detail.dcSalePrice,
                dcSaleAmount: detail.dcSaleAmount,
              },
              select: {
                id: true,
              },
            });
            if (newDetail.id) {
              newDetailsId.push(newDetail.id);
            }
          }
        }

        // Optional: Handle deletion of details that are no longer in the array
        // First get all existing detail IDs for this tender
        const existingDetails = await prisma.otherTenderDetails.findMany({
          where: { otherTenderId: id },
          select: { id: true },
        });

        // Find IDs that exist in the database but not in the incoming details
        const existingIds = existingDetails.map((d) => d.id);

        const idsFromPayload = parsedTenderDetails
          .filter((d) => d.id)
          .map((d) => d.id as number);

        const incomingIds = [...idsFromPayload, ...newDetailsId];

        const detailsToDelete = existingIds.filter(
          (id) => !incomingIds.includes(id)
        );

        // Delete details that are no longer needed
        if (detailsToDelete.length > 0) {
          await prisma.otherTenderDetails.deleteMany({
            where: {
              id: {
                in: detailsToDelete,
              },
            },
          });
        }
      }

      return Response.json(
        {
          success: true,
          message: "Mix Lot Tender updated successfully",
          data: updatedTender,
        },
        { status: 200 }
      );
    }

    await prisma.otherTender.create({
      data: {
        baseTenderId,
        stTenderType: "mix-lot",
        inRoughPcs: roughPcs,
        dcRoughCts: roughCts,
        stLotNo: lotNo,
        dcLotSize: lotSize,
        dcBidPrice: bidPrice || 0,
        dcTotalAmount: totalAmount || 0,
        dcResultCost: 0,
        dcResultPerCt: resultPerCarat || 0,
        dcResultTotal: resultTotal || 0,
        dcRate: rate || 0,
        dcAmount: amount || 0,
        stRemark: remark,
        dcLabour: labour,
        mainLotId,
        dcNetPercentage: netPercent,
        dcSalePrice: salePrice || 0,
        dcSaleAmount: saleAmount || 0,
        isWon,
        otherTenderDetails: {
          createMany: {
            data: parsedTenderDetails.map((detail: MixLotTenderDetails) => ({
              inRoughPcs: detail.inRoughPcs ?? 0,
              dcRoughCts: detail.dcRoughCts ?? 0,
              colorId: detail.color.id,
              clarityId: detail.clarity.id,
              fluorescenceId: detail.fluorescence.id,
              shapeId: detail.shape.id,
              stRemark: detail.stRemark,
              inColorGrade: 0,
              dcPolCts: detail.dcPolCts ?? 0,
              dcPolPer: detail.dcPolPer ?? 0,
              dcDepth: 0,
              dcTable: 0,
              dcRatio: 0,
              dcSalePrice: detail.dcSalePrice ?? 0,
              dcSaleAmount: detail.dcSaleAmount ?? 0,
            })),
          },
        },
      },
    });

    if (mainLotId) {
      const mainLot = await prisma.mainLot.findUnique({
        where: {
          id: mainLotId,
        },
        select: {
          dcCts: true,
          inPcs: true,
        },
      });

      const result = await prisma.$queryRaw<
        Array<{
          total_pcs: bigint;
          total_carats: unknown;
        }>
      >`
        SELECT 
          COALESCE(SUM("inRoughPcs"), 0)::bigint as total_pcs,
          COALESCE(SUM("dcRoughCts"), 0) as total_carats
        FROM "OtherTender"
        WHERE "baseTenderId" = ${baseTenderId}
          AND "mainLotId" = ${mainLotId}
          AND "stTenderType" = 'mix-lot'
      `;

      const totalPcs = Number(result[0]?.total_pcs || 0);
      const totalCarats = Number(result[0]?.total_carats ?? 0);

      await prisma.mainLot.update({
        where: {
          id: mainLotId,
        },
        data: {
          dcRemainingCts:
            (mainLot?.dcCts ? mainLot?.dcCts.toNumber() : 0) - totalCarats,
          inPcs: (mainLot?.inPcs ?? 0) - Number(totalPcs),
        },
      });
    }

    return Response.json(
      {
        success: true,
        message: "Mix Lot Tender created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error, "error");
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error creating single stone tender",
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
  const baseTenderId = url.searchParams.get("baseTenderId") as string;
  const mainLotId = url.searchParams.get("mainLotId") as string;

  if (!baseTenderId) {
    return Response.json(
      {
        success: false,
        message: "Missing base tender ID",
      },
      { status: 400 }
    );
  }

  const limit = 10;
  const pageNumber = page ? parseInt(page) : 1;
  const offset = (pageNumber - 1) * limit;

  const whereCondition: {
    baseTenderId: number;
    mainLotId?: number;
    stTenderType: "mix-lot";
  } = {
    baseTenderId: parseInt(baseTenderId),
    stTenderType: "mix-lot",
  };

  if (mainLotId) {
    whereCondition.mainLotId = parseInt(mainLotId);
  }

  try {
    const mixtLotTenders = await prisma.otherTender.findMany({
      where: whereCondition,
      take: limit,
      skip: offset,
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
        dcResultCost: true,
        stLotNo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalCount = await prisma.otherTender.count({
      where: whereCondition,
    });

    const hasNextPage = limit * pageNumber < totalCount;

    return Response.json(
      {
        data: mixtLotTenders,
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
