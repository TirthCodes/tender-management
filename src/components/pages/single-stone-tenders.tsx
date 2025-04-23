"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { PageWrapper } from "../common/page-wrapper";
import { PageHeader } from "../common/page-header";
import { TenderDataTable } from "../ui/tender-data-table";
import { Pagination } from "../common/pagination";
import { getSingleStoneTender } from "@/services/single-stone";

export function SingleStoneTendersPage() {
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const intId = parseInt(id as string);

  const queryKey = "single-stone-tenders";

  const { data: singleStoneResponse } = useQuery({
    queryKey: [queryKey, id, page],
    queryFn: () => getSingleStoneTender(intId, page),
    initialData: {
      data: [],
      success: true,
      message: "Success",
      nextPage: 2,
      totalCount: 20,
    },
    enabled: !!intId,
  });

  return (
    <PageWrapper>
      <PageHeader
        title="Single Stone Tenders"
        editPath={`/tenders/single-stone/create?tenderId=${intId}`}
      />
      <TenderDataTable
        data={singleStoneResponse?.data || []}
        columns={[]}
        isDialog={false}
        queryKey={queryKey}
        deleteEndpoint="/tender/single-stone"
      />
      <Pagination setPage={setPage} nextPage={2} page={page} />
    </PageWrapper>
  );
}
