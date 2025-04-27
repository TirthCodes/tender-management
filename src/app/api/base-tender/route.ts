import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

export type BaseTenderPayload = {
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
    const body = (await req.json()) as BaseTenderPayload;

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
