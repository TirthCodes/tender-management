import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clarityOptions = await prisma.clarity.findMany({
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
      message: "Clarity options fetched successfully",
      data: clarityOptions,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message:
        error instanceof Error ? error.message : "Error fetching clarity options",
    });
  }
}
