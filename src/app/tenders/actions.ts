import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createTender(formData: FormData) {
  await prisma.tender.create({
    data: {
      voucherNumber: formData.get("voucherNumber") as string,
      date: new Date(formData.get("date") as string),
      name: formData.get("tenderName") as string,
      // Add other fields
    },
  });
  revalidatePath("/tenders");
}

export async function getTenders() {
  return await prisma.tender.findMany({
    include: {
      lots: { include: { positions: true } },
      costDetails: true,
    },
  });
}
