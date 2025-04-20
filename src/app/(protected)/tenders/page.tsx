import React from 'react'
import { TendersPage } from '@/components/pages/tenders';
import { getTendersDb } from '@/lib/server/db/tender';

export default async function Page() {

  const tendersData = await getTendersDb()

  return (
    <TendersPage tenders={tendersData?.data} totalCount={tendersData?.totalCount}  />
  );
}
