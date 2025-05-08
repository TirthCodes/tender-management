import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";
import { RoughLotPaylod, RoughLotTenderDetails } from "@/lib/types/tender";

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
    } = (await req.json()) as RoughLotPaylod;

    if (!baseTenderId || !roughPcs || !roughCts || !labour || !netPercent) {
      return Response.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const parsedTenderDetails: Array<RoughLotTenderDetails> =
      typeof tenderDetails === "string"
        ? JSON.parse(tenderDetails)
        : tenderDetails;

    if (id) {
      await prisma.otherTender.update({
        where: { id },
        data: {
          baseTenderId,
          inRoughPcs: roughPcs,
          dcRoughCts: roughCts,
          dcRate: rate || 0,
          dcAmount: amount || 0,
          stRemark: remark || "",
          dcLabour: labour,
          dcNetPercentage: netPercent,
          stCertId: "",
        },
      });

      // Then handle the tender details
      if (parsedTenderDetails && parsedTenderDetails.length > 0) {
        // Process each detail in the array
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
                inColorGrade: detail.inColorGrade,
                dcPolCts: detail.dcPolCts,
                dcPolPer: detail.dcPolPer,
                dcDepth: detail.dcDepth,
                dcTable: detail.dcTable,
                dcRatio: detail.dcRatio,
                dcSalePrice: detail.dcSalePrice,
                dcSaleAmount: detail.dcSaleAmount,
                dcLabour: detail.dcLabour,
                dcCostPrice: detail.dcCostPrice,
                dcCostAmount: detail.dcCostAmount,
              },
            });
          } else {
            // Create new detail for this tender
            await prisma.otherTenderDetails.create({
              data: {
                otherTenderId: id,
                inRoughPcs: detail.inRoughPcs,
                dcRoughCts: detail.dcRoughCts,
                colorId: detail.color.id,
                clarityId: detail.clarity.id,
                fluorescenceId: detail.fluorescence.id,
                shapeId: detail.shape.id,
                stRemark: detail.stRemark || "",
                inColorGrade: detail.inColorGrade,
                dcPolCts: detail.dcPolCts,
                dcPolPer: detail.dcPolPer,
                dcDepth: detail.dcDepth,
                dcTable: detail.dcTable,
                dcRatio: detail.dcRatio,
                dcSalePrice: detail.dcSalePrice,
                dcSaleAmount: detail.dcSaleAmount,
                dcLabour: detail.dcLabour,
                dcCostPrice: detail.dcCostPrice,
                dcCostAmount: detail.dcCostAmount,
              },
            });
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
        const incomingIds = parsedTenderDetails
          .filter((d) => d.id)
          .map((d) => d.id as number);

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
          message: "Rough Lot Tender updated successfully",
        },
        { status: 200 }
      );
    }

    await prisma.otherTender.create({
      data: {
        baseTenderId,
        stTenderType: "rough-lot",
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
        dcNetPercentage: netPercent,
        otherTenderDetails: {
          createMany: {
            data: parsedTenderDetails.map((detail) => ({
              inRoughPcs: detail.inRoughPcs,
              dcRoughCts: detail.dcRoughCts,
              colorId: detail.color.id,
              clarityId: detail.clarity.id,
              fluorescenceId: detail.fluorescence.id,
              shapeId: detail.shape.id,
              stRemark: detail.stRemark,
              inColorGrade: detail.inColorGrade,
              dcPolCts: detail.dcPolCts,
              dcPolPer: detail.dcPolPer,
              dcDepth: detail.dcDepth,
              dcTable: detail.dcTable,
              dcRatio: detail.dcRatio,
              dcSalePrice: detail.dcSalePrice,
              dcSaleAmount: detail.dcSaleAmount,
              dcLabour: detail.dcLabour,
              dcCostPrice: detail.dcCostPrice,
              dcCostAmount: detail.dcCostAmount,
            })),
          },
        },
      },
    });

    return Response.json(
      {
        success: true,
        message: "Rough Lot Tender created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
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

  try {
    const roughtLotTenders = await prisma.otherTender.findMany({
      where: {
        baseTenderId: parseInt(baseTenderId),
        stTenderType: "rough-lot",
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        baseTenderId: true,
        inRoughPcs: true,
        dcRoughCts: true,
        // dcRate: true,
        // dcAmount: true,
        // stRemark: true,
        dcLabour: true,
        dcNetPercentage: true,
        dcBidPrice: true,
        dcLotSize: true,
        dcTotalAmount: true,
        dcResultPerCt: true,
        dcResultTotal: true,
        stLotNo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalCount = await prisma.otherTender.count({
      where: {
        baseTenderId: parseInt(baseTenderId),
        stTenderType: "rough-lot",
      },
    });

    const hasNextPage = limit * pageNumber < totalCount;

    return Response.json(
      {
        data: roughtLotTenders,
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
