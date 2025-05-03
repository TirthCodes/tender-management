import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

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


    if (id) {
      // Update existing tender
      const updatedTender = await prisma.singleTender.update({
        where: { id: Number(id) },
        data: {
          baseTenderId,
          inRoughPcs: roughPcs,
          dcRoughCts: roughCts,
          dcRate: rate || null,
          dcAmount: amount || null,
          stRemark: remark || null,
          dcLabour: labour,
          dcNetPercentage: netPercent,
          stCertId: certId || null,
          updatedAt: new Date(),
          singleTenderDetails: {
            // Delete existing details and create new ones
            deleteMany: {},
            create: tenderDetails.map((detail: any) => ({
              stLotNo: detail.lotNo,
              inRoughPcs: detail.roughPcs,
              dcRoughCts: detail.roughCts,
              dcSize: detail.size,
              colorId: detail.color.id,
              clarityId: detail.clarity.id,
              flrId: detail.flr.id,
              shapeId: detail.shape.id,
              inColorGrade: detail.colorGrade,
              dcPolCts: detail.polCts,
              dcPolPercent: detail.polPercent,
              dcDepth: detail.depth || null,
              dcTable: detail.table || null,
              dcRatio: detail.ratio || null,
              dcSalePrice: detail.salePrice || null,
              dcSaleAmount: detail.saleAmount || null,
              dcCostPrice: detail.costPrice || null,
              dcTopsAmount: detail.topsAmount || null,
              stIncription: detail.inscription || null,
              dcBidPrice: detail.bidPrice || null,
              dcTotalAmount: detail.totalAmount || null,
              dcResultCost: detail.resultCost || null,
              dcResultPerCt: detail.resultPerCt || null,
              dcResultTotal: detail.resultTotal || null,
            })),
          },
        },
      });

      return Response.json(
        {
          success: true,
          message: "Single Stone Tender updated successfully",
          data: updatedTender,
        },
        { status: 200 }
      );
    }


    const newTender = await prisma.singleTender.create({
      data: {
        baseTenderId,
        inRoughPcs: roughPcs,
        dcRoughCts: roughCts,
        dcRate: rate || null,
        dcAmount: amount || null,
        stRemark: remark || null,
        dcLabour: labour,
        dcNetPercentage: netPercent,
        stCertId: certId || null,
        singleTenderDetails: {
          create: tenderDetails.map((detail: any) => ({
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
            dcDepth: detail.depth || null,
            dcTable: detail.table || null,
            dcRatio: detail.ratio || null,
            dcSalePrice: detail.salePrice || null,
            dcSaleAmount: detail.saleAmount || null,
            dcCostPrice: detail.costPrice || null,
            dcTopsAmount: detail.topsAmount || null,
            stIncription: detail.inscription || null,
            dcBidPrice: detail.bidPrice || null,
            dcTotalAmount: detail.totalAmount || null,
            dcResultCost: detail.resultCost || null,
            dcResultPerCt: detail.resultPerCt || null,
            dcResultTotal: detail.resultTotal || null,
          })),
        },
      },
    });

    return Response.json(
      {
        success: true,
        message: "Single Stone Tender created successfully",
        data: newTender,
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
