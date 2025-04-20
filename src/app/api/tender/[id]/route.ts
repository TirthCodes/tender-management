import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: number }> }) { 
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
    await prisma.tender.delete({
      where: {
        id: id,
      },
    });

    // TODO: delete tender details when it is implemented

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