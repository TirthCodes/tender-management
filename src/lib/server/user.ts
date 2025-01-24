import type { User } from "@prisma/client";
import { hashPassword } from "./password";
import { prisma } from "../prisma";

export async function createUser(
  username: string,
  password: string,
  role: User["stRole"] = "USER"
): Promise<User> {
  const passwordHash = await hashPassword(password);
  return await prisma.user.create({
    data: {
      stUsername: username,
      stPasswordHash: passwordHash,
      stRole: role,
    },
  });
}

export async function updateUserRole() {}
