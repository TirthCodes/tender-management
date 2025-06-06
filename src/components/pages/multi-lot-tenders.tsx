"use client"

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { PageWrapper } from '../common/page-wrapper';
import { PageHeader } from '../common/page-header';
import { TenderDataTable } from '../ui/tender-data-table';
import { Pagination } from '../common/pagination';

export function MultiLotTendersPage() {
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const id = searchParams.get('tenderId');
  
  const queryKey = "multi-lot-tenders";

  const { data: multiLotResponse } = useQuery({
    queryKey: [queryKey, id, page],
    // queryFn: () => getTenders(page),
    initialData: {
      // data: tenders,
      success: true,
      message: "Success",
      nextPage: 2,
      totalCount: 20,
    },
  });

  console.log(multiLotResponse, "multiLotResponse");

  return (
    <PageWrapper>
      <PageHeader title="Multi Lot Tenders" createPath={`/tenders/tender-details/create?tenderId=${id}`} />
      <TenderDataTable
        columns={[]}
        data={[]}
        isDialog={false}
        queryKey={queryKey}
      />
      <Pagination 
        setPage={setPage}
        nextPage={2}
        page={page}
      />
    </PageWrapper>
  )
}
