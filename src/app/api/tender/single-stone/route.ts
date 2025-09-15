import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";
import { SingleStoneTenderDetails } from "@/lib/types/tender";
import { Option } from "@/lib/types/common";
import { Decimal } from "@prisma/client/runtime/library";

// export async function POST(req: Request) {
//   const { session, user } = await getCurrentSession();

//   if (!session || !user) {
//     return Response.json(
//       {
//         success: false,
//         message: "Unauthorized",
//       },
//       { status: 401 }
//     );
//   }

//   try {
//     const body = await req.json();

//     const {
//       voucherDate,
//       tenderName,
//       personName,
//       tenderType,
//       netPercent,
//       remark,
//       lotNo,
//       labour,
//       roughName,
//       roughPcs,
//       roughCts,
//       roughSize,
//       roughPrice,
//       roughTotal,
//       bidPrice,
//       resultCost,
//       // finalCostPrice,
//       totalAmount,
//       resultPerCarat,
//       // finalBidPrice,
//       resultTotal,
//       // finalTotalAmount,
//       tenderDetails,
//     } = body;

//     const tender = await prisma.tender.create({
//       data: {
//         dtVoucherDate: new Date(voucherDate),
//         stTenderName: tenderName,
//         stTenderType: tenderType || "singleStone",
//         dcNetPercentage: parseFloat(netPercent),
//         stPersonName: personName,
//         dcLabour: parseFloat(labour),
//         stRemark: remark,
//         stLotNo: lotNo,
//         stRoughName: roughName,
//         inTotalRoughPcs: roughPcs,
//         dcTotalRoughCts: roughCts,
//         dcRoughSize: roughSize,
//         dcRoughPrice: roughPrice,
//         dcRoughTotal: roughTotal,
//         dcBidPrice: bidPrice,
//         dcResultCost: resultCost,
//         // dcFinalCostPrice: finalCostPrice,
//         dcTotalAmount: totalAmount,
//         dcResultPerCt: resultPerCarat,
//         // dcFinalBidPrice: parseFloat(finalBidPrice),
//         dcResultTotal: parseFloat(resultTotal),
//         // dcFinalTotalAmount: finalTotalAmount,
//       },
//       select: {
//         id: true,
//       },
//     });

//     if (tender && Object.keys(tenderDetails).length > 0) {
//       const tenderDetailsPayload = {
//         tenderId: tender.id,

//         inRoughPcs: tenderDetails.pcs,
//         dcRoughCts: tenderDetails.carats,

//         colorId: tenderDetails.color.id,
//         clarityId: tenderDetails.clarity.id,
//         fluorescenceId: tenderDetails.flr.id,
//         shapeId: tenderDetails.shape.id,

//         stColorGrade: tenderDetails.colorGrade,

//         dcPolCts: tenderDetails.polCts,
//         dcPolPer: tenderDetails.polPercent,

//         dcDepth: tenderDetails.depth || 0,
//         dcTable: tenderDetails.table || 0,
//         dcRatio: tenderDetails.ratio || 0,

//         dcSalePrice: tenderDetails.salePrice || 0,
//         dcSaleAmount: tenderDetails.saleAmount || 0,

//         dcCostPrice: tenderDetails.costPrice || 0,
//         dcCostAmount: tenderDetails.costAmount || 0,

//         dcTopsAmount: tenderDetails.topsAmount || 0,

//         stIncription: tenderDetails.incription || "",
//       };

//       await prisma.tenderDetails.create({
//         data: tenderDetailsPayload,
//       });
//     }

//     return Response.json(
//       {
//         success: true,
//         message: "Tender created successfully",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     return Response.json(
//       {
//         success: false,
//         message:
//           error instanceof Error ? error.message : "Error creating tender",
//       },
//       { status: 500 }
//     );
//   }
// }

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
      labour,
      netPercent,
      remark,
      baseTenderId,
      roughPcs,
      roughCts,
      rate,
      amount,
      certId,
      tenderDetails,
    } = await req.json();

    if (!baseTenderId || !roughPcs || !roughCts || !labour || !netPercent) {
      return Response.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const parsedTenderDetails: Array<SingleStoneTenderDetails> =
      typeof tenderDetails === "string"
        ? JSON.parse(tenderDetails)
        : tenderDetails;

    if (id) {
      // Update existing tender
      await prisma.singleTender.update({
        where: { id },
        data: {
          baseTenderId,
          inRoughPcs: roughPcs,
          dcRoughCts: roughCts,
          dcRate: rate ?? 0,
          dcAmount: amount ?? 0,
          stRemark: remark || null,
          dcLabour: labour,
          dcNetPercentage: netPercent,
          stCertId: certId || null,
        },
      });

      if (parsedTenderDetails && parsedTenderDetails.length > 0) {
        // Process each detail in the array
        for (const detail of parsedTenderDetails) {
          if (detail.id) {
            // Update existing detail
            await prisma.singleTenderDetails.update({
              where: { id: detail.id },
              data: {
                singleTenderId: id,
                inRoughPcs: detail.roughPcs,
                dcRoughCts: detail.roughCts,
                colorId: detail.color.id,
                clarityId: detail.clarity.id,
                flrId: detail.flr.id,
                shapeId: detail.shape.id,
                inColorGrade: detail.colorGrade,
                dcPolCts: detail.polCts,
                dcPolPercent: detail.polPercent,
                dcLength: detail.length,
                dcWidth: detail.width,
                dcHeight: detail.height,
                dcDepth: detail.depth,
                dcTable: detail.table,
                dcRatio: detail.ratio,
                dcSalePrice: detail.salePrice,
                dcSaleAmount: detail.saleAmount,
                dcCostPrice: detail.costPrice,
                dcSize: detail.roughSize,
                dcTopsAmount: detail.topsAmount,
                stIncription: detail.incription,
                dcBidPrice: detail.bidPrice,
                dcTotalAmount: detail.totalAmount,
                dcResultCost: detail.resultCost,
                dcResultPerCt: detail.resultPerCarat,
                dcResultTotal: detail.resultTotal,
                stLotNo: detail.lotNo,
                isWon: detail.isWon
              },
            });
          } else {
            // Create new detail for this tender
            await prisma.singleTenderDetails.create({
              data: {
                singleTenderId: id,
                inRoughPcs: detail.roughPcs,
                dcRoughCts: detail.roughCts,
                colorId: detail.color.id,
                clarityId: detail.clarity.id,
                flrId: detail.flr.id,
                shapeId: detail.shape.id,
                inColorGrade: detail.colorGrade,
                dcPolCts: detail.polCts,
                dcPolPercent: detail.polPercent,
                dcLength: detail.length,
                dcWidth: detail.width,
                dcHeight: detail.height,
                dcDepth: detail.depth,
                dcTable: detail.table,
                dcRatio: detail.ratio,
                dcSalePrice: detail.salePrice,
                dcSaleAmount: detail.saleAmount,
                dcCostPrice: detail.costPrice,
                dcSize: detail.roughSize,
                dcTopsAmount: detail.topsAmount,
                stIncription: detail.incription,
                dcBidPrice: detail.bidPrice,
                dcTotalAmount: detail.totalAmount,
                dcResultCost: detail.resultCost,
                dcResultPerCt: detail.resultPerCarat,
                dcResultTotal: detail.resultTotal,
                stLotNo: detail.lotNo,
                isWon: detail.isWon
              },
            });
          }
        }

        // Optional: Handle deletion of details that are no longer in the array
        // First get all existing detail IDs for this tender
        const existingDetails = await prisma.singleTenderDetails.findMany({
          where: { singleTenderId: id },
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
          await prisma.singleTenderDetails.deleteMany({
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
          message: "Single Stone Tender updated successfully",
        },
        { status: 200 }
      );
    }

    await prisma.singleTender.create({
      data: {
        baseTenderId,
        inRoughPcs: roughPcs,
        dcRoughCts: roughCts,
        dcRate: rate ?? 0,
        dcAmount: amount ?? 0,
        stRemark: remark || null,
        dcLabour: labour,
        dcNetPercentage: netPercent,
        stCertId: certId || null,
        singleTenderDetails: {
          create: parsedTenderDetails.map(
            (detail: SingleStoneTenderDetails) => ({
              stLotNo: detail.lotNo,
              inRoughPcs: detail.roughPcs,
              dcRoughCts: detail.roughCts,
              dcSize: detail.roughSize,
              colorId: detail.color.id,
              clarityId: detail.clarity.id,
              flrId: detail.flr.id,
              shapeId: detail.shape.id,
              inColorGrade: detail.colorGrade,
              dcPolCts: detail.polCts,
              dcPolPercent: detail.polPercent,
              dcLength: detail.length,
              dcWidth: detail.width,
              dcHeight: detail.height,
              dcDepth: detail.depth ?? null,
              dcTable: detail.table ?? null,
              dcRatio: detail.ratio ?? null,
              dcSalePrice: detail.salePrice ?? null,
              dcSaleAmount: detail.saleAmount ?? null,
              dcCostPrice: detail.costPrice ?? null,
              dcTopsAmount: detail.topsAmount ?? null,
              stIncription: detail.incription ?? null,
              dcBidPrice: detail.bidPrice ?? null,
              dcTotalAmount: detail.totalAmount ?? null,
              dcResultCost: detail.resultCost ?? null,
              dcResultPerCt: detail.resultPerCarat ?? null,
              dcResultTotal: detail.resultTotal ?? null,
              isWon: detail.isWon,
            })
          ),
        },
      },
    });

    return Response.json(
      {
        success: true,
        message: "Single Stone Tender created successfully",
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
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json(
      {
        success: false,
        message: "Missing tender ID",
      },
      { status: 400 }
    );
  }

  function decimalToNumber(val: Decimal | null): number {
    if (!val) {
      return 0;
    }

    return typeof val === "object" && val !== null && "toNumber" in val
      ? val.toNumber()
      : Number(val);
  }

  try {
    const tender = await prisma.singleTender.findFirst({
      where: { baseTenderId: Number(id) },
      select: {
        id: true,
        dcNetPercentage: true,
        dcLabour: true,
        stRemark: true,
        inRoughPcs: true,
        dcRoughCts: true,
        dcRate: true,
        dcAmount: true,
        stCertId: true,
        singleTenderDetails: {
          select: {
            id: true,
            stLotNo: true,
            inRoughPcs: true,
            dcRoughCts: true,
            dcSize: true,
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
            flrId: true,
            flr: {
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
            inColorGrade: true,
            dcPolCts: true,
            dcPolPercent: true,
            dcLength: true,
            dcWidth: true,
            dcHeight: true,
            dcDepth: true,
            dcTable: true,
            dcRatio: true,
            dcSalePrice: true,
            dcSaleAmount: true,
            dcCostPrice: true,
            dcTopsAmount: true,
            stIncription: true,
            dcBidPrice: true,
            dcTotalAmount: true,
            dcResultCost: true,
            dcResultPerCt: true,
            dcResultTotal: true,
            isWon: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });

    if (!tender) {
      return Response.json(
        {
          success: false,
          message: "Tender not found",
        },
        { status: 404 }
      );
    }

    const transformedTenders = {
      ...tender,
      singleTenderDetails: tender.singleTenderDetails.map((details) => ({
        id: details.id,
        lotNo: details.stLotNo,
        roughPcs: details.inRoughPcs,
        roughCts: decimalToNumber(details.dcRoughCts),
        roughSize: decimalToNumber(details.dcSize),
        color: details.color as Option,
        colorGrade: details.inColorGrade,
        clarity: details.clarity as Option,
        flr: details.flr as Option,
        shape: details.shape as Option,
        polCts: decimalToNumber(details.dcPolCts),
        polPercent: decimalToNumber(details.dcPolPercent),
        length: decimalToNumber(details.dcLength),
        width: decimalToNumber(details.dcWidth),
        height: decimalToNumber(details.dcHeight),
        depth: decimalToNumber(details.dcDepth),
        table: decimalToNumber(details.dcTable),
        ratio: decimalToNumber(details.dcRatio),
        salePrice: decimalToNumber(details.dcSalePrice),
        saleAmount: decimalToNumber(details.dcSaleAmount),
        costPrice: decimalToNumber(details.dcCostPrice),
        topsAmount: decimalToNumber(details.dcTopsAmount),
        incription: details.stIncription ?? "",
        bidPrice: decimalToNumber(details.dcBidPrice),
        totalAmount: decimalToNumber(details.dcTotalAmount),
        resultCost: decimalToNumber(details.dcResultCost),
        resultPerCarat: decimalToNumber(details.dcResultPerCt),
        resultTotal: decimalToNumber(details.dcResultTotal),
        isWon: details.isWon,
      })) as SingleStoneTenderDetails[],
    };

    return Response.json(
      {
        data: transformedTenders,
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
          error instanceof Error ? error.message : "Error fetching tenders",
      },
      { status: 500 }
    );
  }
}
