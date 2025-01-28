"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createColor(formData: FormData) {
  await prisma.color.create({
    data: {
      stName: formData.get("stName") as string,
      stShortName: formData.get("stShortName") as string,
      inSerial: Number(formData.get("inSerial")),
    },
  });

  return redirect("/tenders/colors");
}

export async function updateColor(id: number, formData: FormData) {
  await prisma.color.update({
    where: { id },
    data: {
      stName: formData.get("stName") as string,
      stShortName: formData.get("stShortName") as string,
      inSerial: Number(formData.get("inSerial")),
    },
  });

  return redirect("/tenders/colors");
}

export async function deleteColor(id: number) {
  await prisma.color.delete({
    where: { id },
  });
}
