import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;

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

  if (!id) {
    return new Response(
      JSON.stringify({
        message: "Tender ID is required",
        success: false,
      }),
      { status: 400 }
    );
  }

  const idInt = Number(id);

  try {

    await prisma.singleTender.deleteMany({
      where: {
        baseTenderId: idInt,
      },
    });

    await prisma.otherTender.deleteMany({
      where: {
        baseTenderId: idInt,
      },
    });

    await prisma.baseTender.delete({
      where: {
        id: idInt,
      },
    });
    
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
