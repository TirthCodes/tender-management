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
    const { page = 1, search = "", fromDate = "", toDate = "" } = body;

    const limit = 10;
    const pageNumber = parseInt(page.toString());
    const offset = (pageNumber - 1) * limit;

    // Build where clause for filtering
    const whereClause: any = {};

    // Search filter
    if (search) {
      whereClause.OR = [
        {
          stTenderName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          stPersonName: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Date range filter
    if (fromDate || toDate) {
      whereClause.dtVoucherDate = {};
      if (fromDate) {
        whereClause.dtVoucherDate.gte = new Date(fromDate);
      }
      if (toDate) {
        whereClause.dtVoucherDate.lte = new Date(toDate);
      }
    }

    const [tenders, totalCount] = await Promise.all([
      prisma.baseTender.findMany({
        where: whereClause,
        select: {
          id: true,
          dtVoucherDate: true,
          stTenderName: true,
          dcLabour: true,
          dcGiaCharge: true,
          dcNetPercentage: true,
          stPersonName: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      }),
      prisma.baseTender.count({ where: whereClause }),
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
