"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { PageWrapper } from "../common/page-wrapper";
import { PageHeader } from "../common/page-header";
import { TenderDataTable } from "../ui/tender-data-table";
import { Pagination } from "../common/pagination";
import { getMixLots } from "@/services/mix-lot";
import {
  columns,
  MixLotColumns,
} from "@/app/(protected)/tenders/mix-lot/columns";
import { MainLot } from "@/lib/types/tender";

export function MixLotTendersPage({
  mixLotTenders,
  totalCount,
  mainLot,
}: {
  mixLotTenders: MixLotColumns[];
  totalCount: number;
  mainLot: MainLot | null;
}) {
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const id = searchParams.get("baseTenderId") as string;
  const mainLotId = searchParams.get("mainLotId") as string;

  const queryKey = "mix-lot-tenders";

  const { data: mixLotResponse } = useQuery({
    queryKey: [queryKey, id, page, mainLotId],
    queryFn: () => getMixLots(parseInt(id), page, mainLotId),
    initialData: {
      data: mixLotTenders,
      success: true,
      message: "Success",
      nextPage: totalCount > 10 ? 2 : null,
      totalCount,
    },
  });
  

  let createPath = ``;
  if (id) {
    createPath = `/tenders/mix-lot/create?baseTenderId=${id}`;
  }
  if (mainLotId) {
    createPath = `/tenders/mix-lot/create?mainLotId=${mainLotId}`;
  }
  if (id && mainLotId) {
    createPath = `/tenders/mix-lot/create?baseTenderId=${id}&mainLotId=${mainLotId}`;
  }

  let title = "Mix Lot Tenders";
  if (mainLot?.stLotNo) {
    title = `Mix Multi Lot (${mainLot.stName} - ${mainLot.stLotNo})`;
  }

  // console.log(mixLotResponse, "mixLotResponse");

  return (
    <PageWrapper>
      <PageHeader 
        title={title} 
        createPath={createPath} 
        mainLotInfo={
          <>
            {mainLot?.stLotNo && (
              <div className="flex items-center gap-6 ml-10">
                <div className="flex items-center gap-1">
                  <p className="font-semibold">Pcs:</p>
                  <p>
                    <span className="text-red-800">
                      {mainLot.inRemainingPcs}
                    </span>{" "}
                    / <span className="font-semibold">{mainLot.inPcs}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <p className="font-semibold">Carats:</p>
                  <p>
                    <span className="text-red-800">
                      {mainLot.dcRemainingCts}
                    </span>{" "}
                    /{" "}
                    <span className="font-semibold">
                      {mainLot.dcRemainingCts}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </>
        }
      />
      <TenderDataTable
        columns={columns}
        data={mixLotResponse?.data || []}
        isDialog={false}
        queryKey={queryKey}
        editPath={createPath}
        deleteEndpoint="other-tender"
      />
      <Pagination
        setPage={setPage}
        nextPage={mixLotResponse?.nextPage}
        page={page}
      />
    </PageWrapper>
  );
}
