
import Header from "@/components/ui/header";
// import { getCurrentSession } from "@/lib/server/session";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { user } = await getCurrentSession();

  return (
    <>
      <Header />
      <main className="p-4">{children}</main>
    </>
  );
}
