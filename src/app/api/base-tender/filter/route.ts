import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

interface BaseTender {
  id: number;
  dcLabour: string;
  dcNetPercentage: string;
  stTenderName: string;
  stPersonName: string;
}

interface SingleTenderDetail {
  singleTender: {
    id: number;
    stRemark: string | null;
    dcNetPercentage: string;
    dcLabour: string;
    baseTender: BaseTender;
  };
  dcBidPrice: string;
  dcPolCts: string;
  dcPolPercent: string;
  dcSalePrice: string;
  dcSaleAmount: string;
  dcCostPrice: string;
  dcTotalAmount: string;
  dcResultCost: string | null;
  dcResultPerCt: string | null;
  dcResultTotal: string | null;
  inRoughPcs: number;
  stLotNo: string;
  clarity: { id: number; stShortName: string };
  shape: { id: number; stShortName: string };
  color: { id: number; stShortName: string };
  flr: { id: number; stShortName: string };
  dcRoughCts: string;
  dcSize: string;
  dcTopsAmount: string | null;
  inColorGrade: number;
  stIncription: string | null;
}

interface OtherTenderDetail {
  tender: {
    id: number;
    stRemark: string;
    stLotNo: string;
    stTenderType: string;
    baseTender: BaseTender;
  };
  dcCostAmount: string | null;
  dcCostPrice: string | null;
  dcPolCts: string;
  dcPolPer: string;
  dcSaleAmount: string;
  dcSalePrice: string;
  clarity: { id: number; stShortName: string };
  shape: { id: number; stShortName: string };
  color: { id: number; stShortName: string };
  fluorescence: { id: number; stShortName: string };
  dcRoughCts: string;
  inRoughPcs: number;
  stRemark: string;
  inColorGrade: number;
}

interface HierarchicalData {
  baseTender: BaseTender;
  singleTenders: Array<{
    singleTender: SingleTenderDetail['singleTender'];
    details: SingleTenderDetail[];
  }>;
  roughLots: Array<{
    tender: OtherTenderDetail['tender'];
    details: OtherTenderDetail[];
  }>;
  mixLots: Array<{
    tender: OtherTenderDetail['tender'];
    details: OtherTenderDetail[];
  }>;
}

function createHierarchicalDataWithMap(
  singleTenderDetails: any[],
  otherTenderDetails: any[]
): HierarchicalData[] {
  const hierarchyMap = new Map<number, HierarchicalData>();

  // Process single tender details
  for (const detail of singleTenderDetails) {
    const baseTenderId = detail.singleTender.baseTender.id;
    const singleTenderId = detail.singleTender.id;

    if (!hierarchyMap.has(baseTenderId)) {
      hierarchyMap.set(baseTenderId, {
        baseTender: detail.singleTender.baseTender,
        singleTenders: [],
        roughLots: [],
        mixLots: []
      });
    }

    const hierarchy = hierarchyMap.get(baseTenderId)!;
    let singleTender = hierarchy.singleTenders.find(
      st => st.singleTender.id === singleTenderId
    );

    if (!singleTender) {
      singleTender = {
        singleTender: detail.singleTender,
        details: []
      };
      hierarchy.singleTenders.push(singleTender);
    }

    singleTender.details.push(detail);
  }

  // Process other tender details
  for (const detail of otherTenderDetails) {
    const baseTenderId = detail.tender.baseTender.id;
    const tenderId = detail.tender.id;
    const tenderType = detail.tender.stTenderType;

    if (!hierarchyMap.has(baseTenderId)) {
      hierarchyMap.set(baseTenderId, {
        baseTender: detail.tender.baseTender,
        singleTenders: [],
        roughLots: [],
        mixLots: []
      });
    }

    const hierarchy = hierarchyMap.get(baseTenderId)!;
    const targetArray = tenderType === 'rough-lot' ? hierarchy.roughLots : hierarchy.mixLots;

    let tender = targetArray.find(t => t.tender.id === tenderId);
    if (!tender) {
      tender = {
        tender: detail.tender,
        details: []
      };
      targetArray.push(tender);
    }

    tender.details.push(detail);
  }

  return Array.from(hierarchyMap.values());
}

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

    const result = createHierarchicalDataWithMap(singleTenderDetails, otherTenderDetails);

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
