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
      tenderId,
      pcs,
      carats,
      color,
      clarity,
      flr,
      shape,
      colorGrade,
      polCts,
      polPercent,
      depth,
      table,
      ratio,
      salePrice,
      saleAmount,
      costPrice,
      costAmount,
      topsAmount,
      incription,
    } = await req.json();

    if(id) {
      await prisma.tenderDetails.update({
        where: {
          id: Number(id),
        },
        data: {
          tenderId: tenderId,
          inRoughPcs: pcs,
          dcRoughCts: carats,
          colorId: color.id,
          clarityId: clarity.id,
          fluorescenceId: flr.id,
          shapeId: shape.id,
          inColorGrade: colorGrade,
          dcPolCts: polCts,
          dcPolPer: polPercent,
          dcDepth: depth || 0,
          dcTable: table || 0,
          dcRatio: ratio || 0,
          dcSalePrice: salePrice || 0,
          dcSaleAmount: saleAmount || 0,
          dcCostPrice: costPrice || 0,
          dcCostAmount: costAmount || 0,
          dcTopsAmount: topsAmount || 0,
          stIncription: incription || "",
        },
      });

      return Response.json(
        {
          success: true,
          message: "Single Stone Tender updated successfully",
        },
        { status: 200 }
      );
    }

    await prisma.tenderDetails.create({
      data: {
        tenderId: tenderId,
        inRoughPcs: pcs,
        dcRoughCts: carats,
        colorId: color.id,
        clarityId: clarity.id,
        fluorescenceId: flr.id,
        shapeId: shape.id,
        inColorGrade: colorGrade,
        dcPolCts: polCts,
        dcPolPer: polPercent,
        dcDepth: depth || 0,
        dcTable: table || 0,
        dcRatio: ratio || 0,
        dcSalePrice: salePrice || 0,
        dcSaleAmount: saleAmount || 0,
        dcCostPrice: costPrice || 0,
        dcCostAmount: costAmount || 0,
        dcTopsAmount: topsAmount || 0,
        stIncription: incription || "",
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
