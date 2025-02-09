import Header from "@/components/header";
import { getCurrentSession } from "@/lib/server/session";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentSession();

  return (
    <>
      <Header user={user} />
      <main className="p-4">{children}</main>
    </>
  );
}
