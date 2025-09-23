
import { CreateSingleStoneTenderForm } from "@/components/forms/create-single-stone-form";
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

  const baseTender = await prisma.baseTender.findUnique({
    select: {
      dtVoucherDate: true,
      stTenderName: true,
      stPersonName: true,
      dcNetPercentage: true,
      dcLabour: true,
      dcGiaCharge: true,
      id: true,
    },
    where: {
      id: intId,
    },
  })

  if(!baseTender) {
    redirect("/tenders")
  }

  const baseTenderData = {
    ...baseTender,
    dcNetPercentage: Number(baseTender.dcNetPercentage),
    dcLabour: Number(baseTender.dcLabour),
    dcGiaCharge: Number(baseTender.dcGiaCharge),
  }

  return (
    <CreateSingleStoneTenderForm
      baseTenderData={baseTenderData}
    />
  );
}
