import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getCurrentSession();

  if (user === null) {
    return redirect("/auth/login");
  }

  redirect("/tenders");
}
