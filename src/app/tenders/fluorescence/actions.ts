"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createFluorescence(formData: FormData) {
  await prisma.fluorescence.create({
    data: {
      stName: formData.get("stName") as string,
      stShortName: formData.get("stShortName") as string,
      inSerial: Number(formData.get("inSerial")),
    },
  });

  return redirect("/tenders/fluorescence");
}

export async function updateFluorescence(id: number, formData: FormData) {
  await prisma.fluorescence.update({
    where: { id },
    data: {
      stName: formData.get("stName") as string,
      stShortName: formData.get("stShortName") as string,
      inSerial: Number(formData.get("inSerial")),
    },
  });

  return redirect("/tenders/fluorescence");
}

export async function deleteFluorescence(id: number) {
  await prisma.fluorescence.delete({
    where: { id },
  });
}
