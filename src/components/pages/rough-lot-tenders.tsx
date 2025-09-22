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
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

export interface OtherBaseTender {
  dtVoucherDate: Date;
  stTenderName: string;
  stPersonName: string;
  dcNetPercentage: number;
  dcLabour: number;
}

export function RoughLotTendersPage({
  roughLotTenders,
  totalCount,
  mainLot,
  totalValues,
  baseTender,
}: {
  roughLotTenders: RoughLotColumns[];
  totalCount: number;
  mainLot: MainLot | null;
  totalValues: {
    pcs: number;
    carats: number;
    polCts: number;
    costPrice: number;
    costAmount: number;
    bidPrice: number;
    bidAmount: number;
    resultTotal: number;
    resultPerCarat: number;
  };
  baseTender: OtherBaseTender;
}) {
  const [page, setPage] = useState(1);
  const [resultTotal, setResultTotal] = useState<number | undefined>(0);
  const [resultPerCarat, setResultPerCarat] = useState<number | undefined>(0);

  const searchParams = useSearchParams();
  const id = searchParams.get("baseTenderId") as string;
  const mainLotId = searchParams.get("mainLotId") as string;

  const queryKey = "rought-lot-tenders";

  const { data: roughLotResponse } = useQuery({
    queryKey: [queryKey, id, page, mainLotId],
    queryFn: () => getRoughLots(parseInt(id), page, mainLotId),
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
      <div className="flex items-center gap-2 text-neutral-700">
        <p className="pr-2 border-r-2">
          {baseTender.dtVoucherDate.toDateString()}
        </p>
        <p className="pr-2 border-r-2">{baseTender.stTenderName}</p>
        <p>{baseTender.stPersonName}</p>
      </div>

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
      {mainLotId && (
        <>
          <div
            className={`mt-2 flex items-center justify-around gap-x-6 gap-y-2 flex-wrap w-full px-4 py-2 border border-neutral-300 rounded-lg shadow-sm`}
          >
            <div className="flex items-center gap-2">
              <p className="text-nowrap">Pcs:</p>
              <p className="font-semibold">{totalValues?.pcs}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-nowrap">Cts.:</p>
              <p className="font-semibold">{totalValues?.carats}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-nowrap">Pol Cts.:</p>
              <p className="font-semibold">{totalValues?.polCts}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-nowrap">Cost Price:</p>
              <p className="font-semibold">{totalValues?.costPrice}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-nowrap">Cost Amount:</p>
              <p className="font-semibold">{totalValues?.costAmount}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-nowrap">Bid Price:</p>
              <p className="font-semibold">{totalValues?.bidPrice}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-nowrap">Bid Amount:</p>
              <p className="font-semibold">{totalValues?.bidAmount}</p>
            </div>
          </div>
          <div
            className={`mt-2 grid grid-cols-3 gap-x-6 gap-y-2 flex-wrap w-full px-4 py-2 border border-neutral-300 rounded-lg shadow-sm`}
          >
            <div className="flex items-center justify-center gap-2">
              <p className="text-nowrap">Result Total:</p>
              <Input
                type="number"
                step={0.01}
                value={resultTotal ?? 0}
                onChange={(e) => {
                  const value = e.target.value
                    ? parseFloat(e.target.value)
                    : undefined;

                  setResultTotal(value);
                  const resultPerCarat = parseFloat(
                    ((value ?? 0) / totalValues?.carats).toFixed(2)
                  );

                  setResultPerCarat(resultPerCarat);
                }}
                className="py-1 h-10 px-2 w-44 font-semibold"
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <p className="text-nowrap">Result Per Carat:</p>
              <Input
                type="number"
                step={0.01}
                value={resultPerCarat ?? 0}
                onChange={(e) => {
                  const value = e.target.value
                    ? parseFloat(e.target.value)
                    : undefined;
                  setResultPerCarat(value);
                  
                  const resultTotal = parseFloat(
                    ((value ?? 0) * totalValues?.carats).toFixed(2)
                  );

                  setResultTotal(resultTotal);
                }}
                className="py-1 h-10 px-2 w-44 font-semibold"
              />
            </div>
            <div className="flex w-full items-center justify-center gap-2">
              <label className="font-semibold text-red-600">Loss</label>
              <Switch
              // checked={watch("isWon") ? true : false}
              // onCheckedChange={(value) => {
              //   setValue("isWon", value);
              // }}
              />
              <label className="font-semibold text-green-600">Win</label>
            </div>
          </div>
        </>
      )}
    </PageWrapper>
  );
}
