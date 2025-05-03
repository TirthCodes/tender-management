"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { PageWrapper } from "../common/page-wrapper";
import { PageHeader } from "../common/page-header";
import { TenderDataTable } from "../ui/tender-data-table";
import { Pagination } from "../common/pagination";

export function RoughLotTendersPage() {
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const id = searchParams.get("tenderId");

  const queryKey = "rought-lot-tenders";

  const { data: roughLotResponse } = useQuery({
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

  console.log(roughLotResponse, "roughLotResponse");

  return (
    <PageWrapper>
      <PageHeader
        title="Rough Lot Tenders"
        createPath={`/tenders/rough-lot/create?tenderId=${id}`}
      />
      <TenderDataTable
        columns={[]}
        data={[]}
        isDialog={true}
        queryKey={queryKey}
      />
      <Pagination setPage={setPage} nextPage={2} page={page} />
    </PageWrapper>
  );
}
