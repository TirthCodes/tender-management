import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";
import { createHierarchicalData } from "@/lib/tender-helpers";


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

    const { shapes, colors, clarities, fluorescences, remark } = body;

    if (!shapes || !colors || !clarities || !fluorescences || !remark) {
      return Response.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    if (remark.tenderRemark || remark.lotRemark) {
      let tenderWhere = {};
      if (remark.tenderRemark) {
        tenderWhere = {
          stRemark: {
            contains: remark.tenderRemark,
            mode: "insensitive",
          },
        };
      }

      let detailsWhere = {};
      let otherDetailsWhere = {};
      if (remark.lotRemark) {
        detailsWhere = {
          stIncription: {
            contains: remark.lotRemark,
            mode: "insensitive",
          },
        };

        otherDetailsWhere = {
          stRemark: {
            contains: remark.lotRemark,
            mode: "insensitive",
          },
        };
      }

      const [singleTender, otherTender] = await Promise.all([
        prisma.singleTender.findMany({
          where: tenderWhere,
          select: {
            id: true,
            stRemark: true,
            dcNetPercentage: true,
            dcLabour: true,
            dcRoughCts: true,
            inRoughPcs: true,
            baseTender: {
              select: {
                id: true,
                stTenderName: true,
                stPersonName: true,
                dcNetPercentage: true,
                dcLabour: true,
                dcGiaCharge: true,
              },
            },
            singleTenderDetails: {
              select: {
                id: true,
                stLotNo: true,
                inRoughPcs: true,
                dcRoughCts: true,
                dcSize: true,
                color: {
                  select: {
                    id: true,
                    stShortName: true,
                  },
                },
                clarity: {
                  select: {
                    id: true,
                    stShortName: true,
                  },
                },
                flr: {
                  select: {
                    id: true,
                    stShortName: true,
                  },
                },
                shape: {
                  select: {
                    id: true,
                    stShortName: true,
                  },
                },
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
                dcFinalBidPrice: true,
                dcFinalBidAmount: true,
                dcFinalCostPrice: true,
                isWon: true,
                margin: true,
              },
              where: detailsWhere,
            },
          },
        }),
        prisma.otherTender.findMany({
          where: tenderWhere,
          select: {
            id: true,
            stRemark: true,
            stLotNo: true,
            stTenderType: true,
            baseTender: {
              select: {
                id: true,
                stTenderName: true,
                stPersonName: true,
                dcNetPercentage: true,
                dcLabour: true,
                dcGiaCharge: true,
              },
            },
            otherTenderDetails: {
              select: {
                dcCostAmount: true,
                dcCostPrice: true,
                dcPolCts: true,
                dcPolPer: true,
                dcSaleAmount: true,
                dcSalePrice: true,
                clarity: {
                  select: {
                    id: true,
                    stShortName: true,
                  },
                },
                shape: {
                  select: {
                    id: true,
                    stShortName: true,
                  },
                },
                color: {
                  select: {
                    id: true,
                    stShortName: true,
                  },
                },
                fluorescence: {
                  select: {
                    id: true,
                    stShortName: true,
                  },
                },
                dcRoughCts: true,
                inRoughPcs: true,
                stRemark: true,
                inColorGrade: true,
              },
              where: otherDetailsWhere,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      ])

      const result = createHierarchicalData(
        singleTender,
        otherTender
      );

      return Response.json(
        {
          success: true,
          message: "Success",
          data: result,
        },
        { status: 200 }
      );
    }

    const [singleTenderDetails, otherTenderDetails] = await Promise.all([
      prisma.singleTenderDetails.findMany({
        where: {
          OR: [
            { shapeId: { in: shapes } },
            { colorId: { in: colors } },
            { clarityId: { in: clarities } },
            { flrId: { in: fluorescences } },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          singleTender: {
            select: {
              id: true,
              stRemark: true,
              dcNetPercentage: true,
              dcLabour: true,
              baseTender: {
                select: {
                  id: true,
                  dcLabour: true,
                  dcNetPercentage: true,
                  stTenderName: true,
                  stPersonName: true,
                  dcGiaCharge: true,
                },
              },
            },
          },

          dcBidPrice: true,
          dcPolCts: true,
          dcPolPercent: true,
          dcSalePrice: true,
          dcSaleAmount: true,
          dcCostPrice: true,
          dcTotalAmount: true,
          dcResultCost: true,
          dcResultPerCt: true,
          dcResultTotal: true,
          inRoughPcs: true,
          stLotNo: true,
          margin: true,
          isWon: true,
          dcFinalBidPrice: true,
          dcFinalCostPrice: true,
          clarity: {
            select: {
              id: true,
              stShortName: true,
            },
          },
          shape: {
            select: {
              id: true,
              stShortName: true,
            },
          },
          color: {
            select: {
              id: true,
              stShortName: true,
            },
          },
          flr: {
            select: {
              id: true,
              stShortName: true,
            },
          },
          dcRoughCts: true,
          dcSize: true,
          dcTopsAmount: true,
          inColorGrade: true,
          stIncription: true,
        },
      }),
      prisma.otherTenderDetails.findMany({
        where: {
          OR: [
            { shapeId: { in: shapes } },
            { colorId: { in: colors } },
            { clarityId: { in: clarities } },
            { fluorescenceId: { in: fluorescences } },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          tender: {
            select: {
              id: true,
              stRemark: true,
              stLotNo: true,
              stTenderType: true,
              baseTender: {
                select: {
                  id: true,
                  dcLabour: true,
                  dcNetPercentage: true,
                  stTenderName: true,
                  stPersonName: true,
                  dcGiaCharge: true,
                },
              },
            },
          },
          dcCostAmount: true,
          dcCostPrice: true,
          dcPolCts: true,
          dcPolPer: true,
          dcSaleAmount: true,
          dcSalePrice: true,
          clarity: {
            select: {
              id: true,
              stShortName: true,
            },
          },
          shape: {
            select: {
              id: true,
              stShortName: true,
            },
          },
          color: {
            select: {
              id: true,
              stShortName: true,
            },
          },
          fluorescence: {
            select: {
              id: true,
              stShortName: true,
            },
          },
          dcRoughCts: true,
          inRoughPcs: true,
          stRemark: true,
          inColorGrade: true,
        },
      }),
    ]);

    const result = createHierarchicalData(
      singleTenderDetails,
      otherTenderDetails
    );

    return Response.json(
      {
        success: true,
        message: "Success",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Error filtering tenders",
      },
      { status: 500 }
    );
  }
}
