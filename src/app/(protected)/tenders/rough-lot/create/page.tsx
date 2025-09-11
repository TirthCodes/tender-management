
import { RoughLotForm } from "@/components/forms/rough-lot-form";
import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { user, session } = await getCurrentSession();

  if (user === null || session === null) {
    return redirect("/auth/login");
  }

  return (
    <RoughLotForm />
  );
}
