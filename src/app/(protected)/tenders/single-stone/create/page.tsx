
import { CreateSingleStoneTenderForm } from "@/components/pages/create-tender/create-single-stone-form";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";

export default async function CreateTenderPage({ searchParams }: { searchParams: Promise<{ tenderId: string}> }) {
  const { user, session } = await getCurrentSession();

  if (user === null || session === null) {
    return redirect("/auth/login");
  }

  const { tenderId } = await searchParams;
  const intId = parseInt(tenderId);

  const [colors, clarities, fluorescence, shapes, tender] = await Promise.all([
    prisma.color.findMany({
      select: {
        id: true,
        stShortName: true,
      },
      orderBy: {
        inSerial: "asc",
      },
    }),
    prisma.clarity.findMany({
      select: {
        id: true,
        stShortName: true,
      },
      orderBy: {
        inSerial: "asc",
      },
    }),
    prisma.fluorescence.findMany({
      select: {
        id: true,
        stShortName: true,
      },
      orderBy: {
        inSerial: "asc",
      },
    }),
    prisma.shape.findMany({
      select: {
        id: true,
        stShortName: true,
      },
      orderBy: {
        inSerial: "asc",
      },
    }),
    prisma.baseTender.findUnique({
      select: {
        dtVoucherDate: true,
        stTenderName: true,
        stPersonName: true,
        dcNetPercentage: true,
        dcLabour: true,
      },
      where: {
        id: intId,
      },
    }),
  ]);

  if(!tender) {
    redirect("/tenders")
  }

  const tenderData = {
    ...tender,
    dcNetPercentage: Number(tender.dcNetPercentage),
    dcLabour: Number(tender.dcLabour)
  }

  return (
    <CreateSingleStoneTenderForm
      colorOptions={colors}
      clarityOptions={clarities}
      fluorescenceOptions={fluorescence}
      shapeOptions={shapes}
      tenderData={tenderData}
    />
  );
}
