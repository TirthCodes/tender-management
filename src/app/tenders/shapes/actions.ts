"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createShape(formData: FormData) {
  await prisma.shape.create({
    data: {
      stName: formData.get("stName") as string,
      stShortName: formData.get("stShortName") as string,
      inSerial: Number(formData.get("inSerial")),
    },
  });

  return redirect("/tenders/shapes");
}

export async function updateShape(id: number, formData: FormData) {
  await prisma.shape.update({
    where: { id },
    data: {
      stName: formData.get("stName") as string,
      stShortName: formData.get("stShortName") as string,
      inSerial: Number(formData.get("inSerial")),
    },
  });

  return redirect("/tenders/shapes");
}

export async function deleteShape(id: number) {
  await prisma.shape.delete({
    where: { id },
  });
}
