"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createClarity(formData: FormData) {
  await prisma.clarity.create({
    data: {
      stName: formData.get("stName") as string,
      stShortName: formData.get("stShortName") as string,
      inSerial: Number(formData.get("inSerial")),
    },
  });

  return redirect("/tenders/clarity");
}

export async function updateClarity(id: number, formData: FormData) {
  await prisma.clarity.update({
    where: { id },
    data: {
      stName: formData.get("stName") as string,
      stShortName: formData.get("stShortName") as string,
      inSerial: Number(formData.get("inSerial")),
    },
  });

  return redirect("/tenders/clarity");
}

export async function deleteClarity(id: number) {
  await prisma.clarity.delete({
    where: { id },
  });
}
