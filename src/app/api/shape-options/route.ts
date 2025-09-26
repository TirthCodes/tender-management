import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const shapeOptions = await prisma.shape.findMany({
      select: {
        id: true,
        stShortName: true,
        stName: true,
      },
      orderBy: {
        inSerial: "asc",
      },
    });

    return Response.json({
      success: true,
      message: "Shape options fetched successfully",
      data: shapeOptions,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message:
        error instanceof Error ? error.message : "Error fetching shape options",
    });
  }
}
