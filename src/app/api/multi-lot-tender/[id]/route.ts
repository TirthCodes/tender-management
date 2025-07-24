import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) { 
  const { id } = await params;

  if (!id) {
    return new Response(
      JSON.stringify({
        message: "Tender ID is required",
        success: false,
      }),
      { status: 400 }
    );  
  }

  const intId = parseInt(id);

  try {
    const tender = await prisma.mainLot.findUnique({
      select: {
        id: true,
        stName: true,
        stRemarks: true,
        inPcs: true,
        dcCts: true,
        dcRate: true,
        dcAmount: true,
        createdAt: true,
      },
      where: {
        id: intId,
      },
    })

    return new Response(
      JSON.stringify({
        data: tender,
        success: true,
      }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        message:
          error instanceof Error ? error.message : "Error getting tender",
        success: false,
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) { 
  const { id } = await params;

  if (!id) {
    return new Response(
      JSON.stringify({
        message: "Tender ID is required",
        success: false,
      }),
      { status: 400 }
    );
  }

  try {

    const intId = parseInt(id);

    await Promise.all([
      prisma.otherTender.deleteMany({
        where: {
          mainLotId: intId,
        },
      }),
      prisma.mainLot.delete({
        where: {
          id: intId,
        },
      })
    ]);

    return new Response(
      JSON.stringify({
        message: "Tender deleted successfully",
        success: true,
      }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        message:
          error instanceof Error ? error.message : "Error deleting tender",
        success: false,
      }),
      { status: 500 }
    );
  }
}
