import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const colorOptions = await prisma.color.findMany({
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
      message: "Color options fetched successfully",
      data: colorOptions,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message:
        error instanceof Error ? error.message : "Error fetching color options",
    });
  }
}
