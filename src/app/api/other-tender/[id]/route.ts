import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  const intId = parseInt(id);

  if (!id) {
    return Response.json(
      {
        success: false,
        message: "Missing ID",
      },
      { status: 400 }
    );
  }

  try {
    await prisma.otherTender.delete({
      where: {
        id: intId,
      },
    });

    await prisma.otherTenderDetails.deleteMany({
      where: {
        otherTenderId: intId,
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