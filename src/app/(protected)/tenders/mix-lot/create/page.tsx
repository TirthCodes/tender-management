import { MixLotForm } from "@/components/forms/mix-lot-form";
import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user, session } = await getCurrentSession();

  if (user === null || session === null) {
    return redirect("/auth/login");
  }
  
  return (
    <MixLotForm />
  )
}
