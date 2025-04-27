import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";
// import { TenderDetails } from "@/lib/types/tender";

// export async function POST(req: Request) {
//   const { session, user} = await getCurrentSession();

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
//     console.log(body, "body");

//     const {
//       voucherDate,
//       tenderName,
//       personName,
//       // tenderType,
//       netPercent,
//       // remark,
//       // lotNo,
//       labour,
//       // roughName,
//       // roughPcs,
//       // roughCts,
//       // roughSize,
//       // roughPrice,
//       // roughTotal,
//       // bidPrice,
//       // resultCost,
//       // finalCostPrice,
//       // totalAmount,
//       // resultPerCarat,
//       // finalBidPrice,
//       // resultTotal,
//       // finalTotalAmount,
//       tenderDetails,
//     } = body;

//     //   {
//     //     "voucherDate": "10/02/2025",
//     //     "tenderType": "singleStone",
//     //     "tenderName": "Single Stone Tender",
//     //     "notePercent": "106",
//     //     "remark": "",
//     //     "lotNo": "FS39",
//     //     "roughName": "Rough FS39",
//     //     "roughPcs": "1",
//     //     "roughCts": "4.96",
//     //     "roughSize": "4.96",
//     //     "roughPrice": "1000",
//     //     "roughTotal": "1000",
//     //     "bidPrice": 8169.51,
//     //     "totalAmount": 40520.77,
//     //     "resultCost": 22919.43,
//     //     "resultPerCarat": 10438.53,
//     //     "resultTotal": "51775.11",
//     //     "finalCostPrice": 17998.9,
//     //     "finalBidPrice": "8169",
//     //     "finalTotalAmount": 40518.24,
//     //     "tenderDetails": "[{\"pcs\":1,\"carats\":4.96,\"color\":{\"id\":1,\"stShortName\":\"F VID Y\"},\"colorGrade\":10,\"clarity\":{\"id\":5,\"stShortName\":\"VVS1\"},\"flr\":{\"id\":3,\"stShortName\":\"N(YU)\"},\"shape\":{\"id\":3,\"stShortName\":\"HEART\"},\"polCts\":2.5,\"polPercent\":50.4,\"depth\":55,\"table\":58,\"ratio\":0.86,\"labour\":0,\"salePrice\":20000,\"saleAmount\":0,\"costPrice\":18000,\"costAmount\":0,\"topsAmount\":0,\"incription\":\"RD-2.35\"}]"
//     // }

//     const tender = await prisma.tender.create({
//       data: {
//         dtVoucherDate: new Date(voucherDate),
//         stTenderName: tenderName,
//         // stTenderType: tenderType,
//         dcNetPercentage: parseFloat(netPercent),
//         stPersonName: personName,
//         dcLabour: parseFloat(labour),
//         // stRemark: remark,
//         // stLotNo: lotNo,
//         // stRoughName: roughName,
//         // inTotalRoughPcs: parseInt(roughPcs),
//         // dcTotalRoughCts: parseFloat(roughCts),
//         // dcRoughSize: parseFloat(roughSize),
//         // dcRoughPrice: parseFloat(roughPrice),
//         // dcRoughTotal: parseFloat(roughTotal),
//         // dcBidPrice: bidPrice,
//         // dcResultCost: resultCost,
//         // dcFinalCostPrice: finalCostPrice,
//         // dcTotalAmount: totalAmount,
//         // dcResultPerCt: resultPerCarat,
//         // dcFinalBidPrice: parseFloat(finalBidPrice),
//         // dcResultTotal: parseFloat(resultTotal),
//         // dcFinalTotalAmount: finalTotalAmount,
//       },
//       select: {
//         id: true,
//       },
//     });

//     const parseTenderDetails = JSON.parse(tenderDetails) as TenderDetails[];

//     console.log(parseTenderDetails, "parseTenderDetails");
//     if (tender && parseTenderDetails.length > 0) {
//       const tenderDetailsPayload = parseTenderDetails.map((tenderDetail) => ({
//         tenderId: tender.id,

//         inRoughPcs: tenderDetail.pcs,
//         dcRoughCts: tenderDetail.carats,

//         colorId: tenderDetail.color.id,
//         clarityId: tenderDetail.clarity.id,
//         fluorescenceId: tenderDetail.flr.id,
//         shapeId: tenderDetail.shape.id,

//         inColorGrade: tenderDetail.colorGrade,

//         dcPolCts: tenderDetail.polCts,
//         dcPolPer: tenderDetail.polPercent,

//         dcDepth: tenderDetail.depth || 0,
//         dcTable: tenderDetail.table || 0,
//         dcRatio: tenderDetail.ratio || 0,

//         dcSalePrice: tenderDetail.salePrice || 0,
//         dcSaleAmount: tenderDetail.saleAmount || 0,

//         dcCostPrice: tenderDetail.costPrice || 0,
//         dcCostAmount: tenderDetail.costAmount || 0,

//         dcTopsAmount: tenderDetail.topsAmount || 0,

//         stIncription: tenderDetail.incription || "",
//       }));

//       await prisma.tenderDetails.createMany({
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

export type TenderPayload = {
  id?: number;
  dtVoucherDate: Date | string;
  stTenderName: string;
  stPersonName: string;
  dcNetPercentage: number;
  dcLabour: number;
};

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
    const body = (await req.json()) as TenderPayload;

    const { id, dtVoucherDate, stTenderName, stPersonName, dcNetPercentage, dcLabour } =
      body;

    if (id) {
      await prisma.baseTender.update({
        where: {
          id: Number(id),
        },
        data: {
          dtVoucherDate: new Date(dtVoucherDate),
          stTenderName: stTenderName,
          stPersonName: stPersonName,
          dcNetPercentage: Number(dcNetPercentage),
          dcLabour: dcLabour,
        },
      });
    }else{
      await prisma.baseTender.create({
        data: {
          dtVoucherDate: new Date(dtVoucherDate),
          stTenderName: stTenderName,
          stPersonName: stPersonName,
          dcNetPercentage: Number(dcNetPercentage),
          dcLabour: Number(dcLabour),
        },
        select: {
          id: true,
        },
      });
    }

    return Response.json(
      {
        success: true,
        message: "Tender created successfully",
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

  const limit = 10;
  const pageNumber = page ? parseInt(page) : 1;
  const offset = (pageNumber - 1) * limit;

  try {
    const [tenders, totalCount] = await Promise.all([
      prisma.baseTender.findMany({
        select: {
          id: true,
          dtVoucherDate: true,
          stTenderName: true,
          dcLabour: true,
          dcNetPercentage: true,
          stPersonName: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      }),
      prisma.baseTender.count(),
    ]);

    const hasNextPage = limit * pageNumber < totalCount;

    return Response.json(
      {
        data: tenders,
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
