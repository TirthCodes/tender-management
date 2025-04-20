
import { CreateTenderForm } from "@/components/pages/create-tender/create-tender-form";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";

export default async function CreateTenderPage() {
  const { user, session } = await getCurrentSession();

  if (user === null || session === null) {
    return redirect("/auth/login");
  }

  const [colors, clarities, fluorescence, shapes] = await Promise.all([
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
  ]);

  return (
    <CreateTenderForm
      colorOptions={colors}
      clarityOptions={clarities}
      fluorescenceOptions={fluorescence}
      shapeOptions={shapes}
    />
  );
}
