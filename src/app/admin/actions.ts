import { prisma } from "@/lib/prisma";

export async function deleteUser(id: number) {
  await prisma.user.delete({
    where: { id },
  });
}
