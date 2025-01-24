"use server";

import { prisma } from "@/lib/prisma";
import { verifyPasswordHash } from "@/lib/server/password";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  getCurrentSession,
  invalidateSession,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { createUser } from "@/lib/server/user";
import { redirect } from "next/navigation";

interface ActionResult {
  message: string;
}

export async function createUserAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const username = formData.get("username");
  const password = formData.get("password");

  if (typeof username !== "string" || typeof password !== "string") {
    return {
      message: "Invalid username or password",
    };
  }

  if (username === "" || password === "") {
    return {
      message: "Please fill in all fields",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      stUsername: username,
    },
  });

  if (existingUser !== null) {
    return {
      message: "User already exists",
    };
  }

  await createUser(username, password);
  return redirect("/admin");
}

export async function loginAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const username = formData.get("username");
  const password = formData.get("password");

  if (typeof username !== "string" || typeof password !== "string") {
    return {
      message: "Invalid username or password",
    };
  }

  if (username === "" || password === "") {
    return {
      message: "Please fill in all fields",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      stUsername: username,
    },
  });

  if (user === null) {
    return {
      message: "User not found",
    };
  }

  const validPassword = await verifyPasswordHash(user.stPasswordHash, password);
  if (!validPassword) {
    return {
      message: "Invalid password",
    };
  }

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);

  if (user.stRole === "ADMIN") {
    return redirect("/admin");
  }

  return redirect("/tenders");
}

export async function logoutAction(): Promise<{ message: string }> {
  const { session } = await getCurrentSession();

  if (session === null) {
    return {
      message: "You are not logged in",
    };
  }

  invalidateSession(session.id);
  deleteSessionTokenCookie();
  return redirect("/auth/login");
}
