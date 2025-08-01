"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { PageWrapper } from "../common/page-wrapper";
import { PageHeader } from "../common/page-header";
import { TenderDataTable } from "../ui/tender-data-table";
import { Pagination } from "../common/pagination";
import { columns, RoughLotColumns } from "@/app/(protected)/tenders/rough-lot/columns";
import { getRoughLots } from "@/services/rough-lot";

export function RoughLotTendersPage({ roughLotTenders, totalCount }: { roughLotTenders: RoughLotColumns[], totalCount: number }) {
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const id = searchParams.get("baseTenderId") as string;
  const mainLotId = searchParams.get("mainLotId") as string;

  const queryKey = "rought-lot-tenders";

  const { data: roughLotResponse } = useQuery({
    queryKey: [queryKey, id, page],
    queryFn: () => getRoughLots(parseInt(id), page),
    initialData: {
      data: roughLotTenders,
      success: true,
      message: "Success",
      nextPage: totalCount > 10 ? 2 : null,
      totalCount,
    },
  });

  let createPath = ``;
  if(id) {
    createPath = `/tenders/rough-lot/create?baseTenderId=${id}`;
  }
  if(mainLotId) {
    createPath = `/tenders/rough-lot/create?mainLotId=${mainLotId}`;
  }
  if(id && mainLotId) {
    createPath = `/tenders/rough-lot/create?baseTenderId=${id}&mainLotId=${mainLotId}`;
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Rough Lot Tenders"
        createPath={createPath}
      />
      <TenderDataTable
        columns={columns}
        data={roughLotResponse?.data || []}
        isDialog={false}
        editPath={createPath}
        queryKey={queryKey}
        deleteEndpoint="other-tender"
      />
      <Pagination setPage={setPage} nextPage={roughLotResponse?.nextPage} page={page} />
    </PageWrapper>
  );
}
