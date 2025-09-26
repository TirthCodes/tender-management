import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const flrOptions = await prisma.fluorescence.findMany({
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
      message: "Flr options fetched successfully",
      data: flrOptions,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message:
        error instanceof Error ? error.message : "Error fetching flr options",
    });
  }
}
