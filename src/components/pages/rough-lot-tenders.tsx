"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { PageWrapper } from "../common/page-wrapper";
import { PageHeader } from "../common/page-header";
import { TenderDataTable } from "../ui/tender-data-table";
import { Pagination } from "../common/pagination";
import {
  columns,
  RoughLotColumns,
} from "@/app/(protected)/tenders/rough-lot/columns";
import { getRoughLots } from "@/services/rough-lot";
import { MainLot } from "@/lib/types/tender";

export function RoughLotTendersPage({
  roughLotTenders,
  totalCount,
  mainLot,
}: {
  roughLotTenders: RoughLotColumns[];
  totalCount: number;
  mainLot: MainLot | null;
}) {
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
  if (id) {
    createPath = `/tenders/rough-lot/create?baseTenderId=${id}`;
  }
  if (mainLotId) {
    createPath = `/tenders/rough-lot/create?mainLotId=${mainLotId}`;
  }
  if (id && mainLotId) {
    createPath = `/tenders/rough-lot/create?baseTenderId=${id}&mainLotId=${mainLotId}`;
  }

  let title = "Rough Lot Tenders";
  if (mainLot?.stLotNo) {
    title = `Rough Multi Lot (${mainLot.stName} - ${mainLot.stLotNo})`;
  }

  return (
    <PageWrapper>
      {mainLot?.stLotNo && (
        <div className="flex items-center justify-center gap-6 -mb-[30px]">
          <div className="flex items-center gap-1">
            <p className="font-semibold">Pcs:</p>
            <p>
              <span className="text-red-800">{mainLot.inRemainingPcs}</span> /{" "}
              <span className="font-semibold">{mainLot.inPcs}</span>
            </p>
          </div>
          <div className="flex items-center gap-1">
            <p className="font-semibold">Carats:</p>
            <p>
              <span className="text-red-800">{mainLot.dcRemainingCts}</span> /{" "}
              <span className="font-semibold">{mainLot.dcRemainingCts}</span>
            </p>
          </div>
        </div>
      )}
      <PageHeader title={title} createPath={createPath} />
      <TenderDataTable
        columns={columns}
        data={roughLotResponse?.data || []}
        isDialog={false}
        editPath={createPath}
        queryKey={queryKey}
        deleteEndpoint="other-tender"
      />
      <Pagination
        setPage={setPage}
        nextPage={roughLotResponse?.nextPage}
        page={page}
      />
    </PageWrapper>
  );
}
