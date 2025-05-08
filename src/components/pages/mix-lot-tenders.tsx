"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { PageWrapper } from "../common/page-wrapper";
import { PageHeader } from "../common/page-header";
import { TenderDataTable } from "../ui/tender-data-table";
import { Pagination } from "../common/pagination";
import { getMixLots } from "@/services/mix-lot";
import { columns, MixLotColumns } from "@/app/(protected)/tenders/mix-lot/columns";

export function MixLotTendersPage({ mixLotTenders, totalCount }: { mixLotTenders: MixLotColumns[], totalCount: number }) {
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const id = searchParams.get("baseTenderId") as string;

  const queryKey = "mix-lot-tenders";

  const { data: mixLotResponse } = useQuery({
    queryKey: [queryKey, id, page],
    queryFn: () => getMixLots(parseInt(id), page),
    initialData: {
      data: mixLotTenders,
      success: true,
      message: "Success",
      nextPage: totalCount > 10 ? 2 : null,
      totalCount,
    },
  });

  console.log(mixLotResponse, "mixLotResponse");

  return (
    <PageWrapper>
      <PageHeader
        title="Mix Lot Tenders"
        createPath={`/tenders/mix-lot/create?baseTenderId=${id}`}
      />
      <TenderDataTable
        columns={columns}
        data={mixLotResponse?.data || []}
        isDialog={false}
        queryKey={queryKey}
        editPath={`/tenders/mix-lot/create?baseTenderId=${id}`}
        deleteEndpoint="other-tender"
      />
      <Pagination setPage={setPage} nextPage={mixLotResponse?.nextPage} page={page} />
    </PageWrapper>
  );
}
