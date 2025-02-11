import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

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
    const body = await req.json();

    const {
      voucherDate,
      tenderName,
      personName,
      tenderType,
      netPercent,
      remark,
      lotNo,
      labour,
      roughName,
      roughPcs,
      roughCts,
      roughSize,
      roughPrice,
      roughTotal,
      bidPrice,
      resultCost,
      finalCostPrice,
      totalAmount,
      resultPerCarat,
      finalBidPrice,
      resultTotal,
      finalTotalAmount,
      tenderDetails,
    } = body;

    //   {
    //     "voucherDate": "10/02/2025",
    //     "tenderType": "singleStone",
    //     "tenderName": "Single Stone Tender",
    //     "notePercent": "106",
    //     "remark": "",
    //     "lotNo": "FS39",
    //     "roughName": "Rough FS39",
    //     "roughPcs": "1",
    //     "roughCts": "4.96",
    //     "roughSize": "4.96",
    //     "roughPrice": "1000",
    //     "roughTotal": "1000",
    //     "bidPrice": 8169.51,
    //     "totalAmount": 40520.77,
    //     "resultCost": 22919.43,
    //     "resultPerCarat": 10438.53,
    //     "resultTotal": "51775.11",
    //     "finalCostPrice": 17998.9,
    //     "finalBidPrice": "8169",
    //     "finalTotalAmount": 40518.24,
    //     "tenderDetails": "[{\"pcs\":1,\"carats\":4.96,\"color\":{\"id\":1,\"stShortName\":\"F VID Y\"},\"colorGrade\":10,\"clarity\":{\"id\":5,\"stShortName\":\"VVS1\"},\"flr\":{\"id\":3,\"stShortName\":\"N(YU)\"},\"shape\":{\"id\":3,\"stShortName\":\"HEART\"},\"polCts\":2.5,\"polPercent\":50.4,\"depth\":55,\"table\":58,\"ratio\":0.86,\"labour\":0,\"salePrice\":20000,\"saleAmount\":0,\"costPrice\":18000,\"costAmount\":0,\"topsAmount\":0,\"incription\":\"RD-2.35\"}]"
    // }

    const tender = await prisma.tender.create({
      data: {
        dtVoucherDate: new Date(voucherDate),
        stTenderName: tenderName,
        stTenderType: tenderType || "singleStone",
        dcNetPercentage: parseFloat(netPercent),
        stPersonName: personName,
        dcLabour: parseFloat(labour),
        stRemark: remark,
        stLotNo: lotNo,
        stRoughName: roughName,
        inTotalRoughPcs: roughPcs,
        dcTotalRoughCts: roughCts,
        dcRoughSize: roughSize,
        dcRoughPrice: roughPrice,
        dcRoughTotal: roughTotal,
        dcBidPrice: bidPrice,
        dcResultCost: resultCost,
        dcFinalCostPrice: finalCostPrice,
        dcTotalAmount: totalAmount,
        dcResultPerCt: resultPerCarat,
        dcFinalBidPrice: parseFloat(finalBidPrice),
        dcResultTotal: parseFloat(resultTotal),
        dcFinalTotalAmount: finalTotalAmount,
      },
      select: {
        id: true,
      },
    });

    if (tender && Object.keys(tenderDetails).length > 0) {
      const tenderDetailsPayload = {
        tenderId: tender.id,

        inRoughPcs: tenderDetails.pcs,
        dcRoughCts: tenderDetails.carats,

        colorId: tenderDetails.color.id,
        clarityId: tenderDetails.clarity.id,
        fluorescenceId: tenderDetails.flr.id,
        shapeId: tenderDetails.shape.id,

        stColorGrade: tenderDetails.colorGrade,

        dcPolCts: tenderDetails.polCts,
        dcPolPer: tenderDetails.polPercent,

        dcDepth: tenderDetails.depth || 0,
        dcTable: tenderDetails.table || 0,
        dcRatio: tenderDetails.ratio || 0,

        dcSalePrice: tenderDetails.salePrice || 0,
        dcSaleAmount: tenderDetails.saleAmount || 0,

        dcCostPrice: tenderDetails.costPrice || 0,
        dcCostAmount: tenderDetails.costAmount || 0,

        dcTopsAmount: tenderDetails.topsAmount || 0,

        stIncription: tenderDetails.incription || "",
      };

      await prisma.tenderDetails.create({
        data: tenderDetailsPayload,
      });
    }

    return Response.json(
      {
        success: true,
        message: "Tender created successfully",
      },
      { status: 201 }
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
