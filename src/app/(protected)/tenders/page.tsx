import React from "react";
import { BaseTendersPage } from "@/components/pages/base-tenders";
import { getBaseTendersDb } from "@/lib/server/db/base-tender";

export default async function Page() {
  const tendersData = await getBaseTendersDb();

  return (
    <BaseTendersPage
      tenders={tendersData?.data}
      totalCount={tendersData?.totalCount}
    />
  );
}
