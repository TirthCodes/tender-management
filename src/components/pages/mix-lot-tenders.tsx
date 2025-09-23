"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
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
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { OtherBaseTender } from "./rough-lot-tenders";
import { Button } from "../ui/button";
import { updateMainLot } from "@/services/multi-lot";
import { MainLotUpdate } from "@/app/api/main-lot/[id]/route";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

interface MixLotTendersPageProps {
  mixLotTenders: MixLotColumns[];
  totalCount: number;
  mainLot: MainLot | null;
  totalValues: {
    pcs: number;
    carats: number;
    polCts: number;
    salePrice: number;
    saleAmount: number;
    bidPrice: number;
    bidAmount: number;
    resultCost: number;
    resultTotal: number;
    resultPerCarat: number;
  };
  baseTender: OtherBaseTender;
}

export function MixLotTendersPage({
  mixLotTenders,
  totalCount,
  mainLot,
  totalValues,
  baseTender,
}: MixLotTendersPageProps) {
  const [page, setPage] = useState(1);
  const [resultTotal, setResultTotal] = useState<number | undefined>(totalValues.resultTotal);
  const [resultPerCarat, setResultPerCarat] = useState<number | undefined>(totalValues.resultPerCarat);
  const [resultCost, setResultCost] = useState<number | undefined>(
    totalValues.resultCost
  );
  const [isWon, setIsWon] = useState<boolean>(mainLot?.isWon ?? false);

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

  const { mutate, isPending } = useMutation({
    mutationFn: (data: MainLotUpdate) =>
      updateMainLot(data, parseInt(mainLotId) as number),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Main lot updated successfully");
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
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

  return (
    <PageWrapper>
      <PageHeader
        title={title}
        createPath={createPath}
        backPath={mainLotId && id ? `/tenders/multi-lot/mix?baseTenderId=${id}` : undefined} 
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
                    / <span className="font-semibold">{mainLot.dcCts}</span>
                  </p>
                </div>
              </div>
            )}
          </>
        }
      />
      <div className="ml-11 flex items-center gap-2 text-neutral-700">
        <p className="pr-2 border-r-2">
          {baseTender.dtVoucherDate.toDateString()}
        </p>
        <p className="pr-2 border-r-2">{baseTender.stTenderName}</p>
        <p>{baseTender.stPersonName}</p>
      </div>
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
              <p className="text-nowrap">Sale Price:</p>
              <p className="font-semibold">{totalValues?.salePrice}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-nowrap">Sale Amount:</p>
              <p className="font-semibold">{totalValues?.saleAmount}</p>
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
            className={`mt-2 grid grid-cols-4 gap-x-6 gap-y-2 flex-wrap w-full px-4 py-2 border border-neutral-300 rounded-lg shadow-sm`}
          >
            <div className="flex items-center justify-center gap-2">
              <p className="text-nowrap">Result Cost:</p>
              <Input
                type="number"
                step={0.01}
                value={resultCost}
                disabled
                className="py-1 h-10 px-2 w-44 font-semibold"
              />
            </div>
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
                    ((value ?? 0) / (mainLot?.dcCts ?? 0)).toFixed(2)
                  );

                  setResultPerCarat(resultPerCarat);
                  const netPercent = baseTender.dcNetPercentage - 100;
                  const resultPercent = parseFloat(
                    (netPercent / 100).toFixed(2)
                  );

                  const giaCharge = baseTender.dcGiaCharge;

                  const resultCost = parseFloat(
                    (
                      (((resultPerCarat * resultPercent +
                        resultPerCarat +
                        baseTender.dcLabour) *
                        totalValues.carats) /
                        totalValues.polCts +
                        giaCharge) /
                      0.97
                    ).toFixed(2)
                  );

                  setResultCost(resultCost);
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
                    ((value ?? 0) * (mainLot?.dcCts ?? 0)).toFixed(2)
                  );
                  setResultTotal(resultTotal);

                  const netPercent = baseTender.dcNetPercentage - 100;
                  const resultPercent = parseFloat(
                    (netPercent / 100).toFixed(2)
                  );
                  const giaCharge = baseTender.dcGiaCharge;

                  const resultCost = parseFloat(
                    (
                      ((((value ?? 0) * resultPercent +
                        (value ?? 0) +
                        baseTender.dcLabour) *
                        totalValues.carats) /
                        totalValues.polCts +
                        giaCharge) /
                      0.97
                    ).toFixed(2)
                  );

                  setResultCost(resultCost);
                }}
                className="py-1 h-10 px-2 w-44 font-semibold"
              />
            </div>
            <div className="flex w-full items-center justify-center gap-2">
              <label className="font-semibold text-red-600">Loss</label>
              <Switch
                checked={isWon}
                onCheckedChange={(value) => {
                  setIsWon(value);
                }}
              />
              <label className="font-semibold text-green-600">Win</label>
              <div className="flex w-full items-center justify-end">
                <Button
                  disabled={isPending}
                  onClick={() => {
                    mutate({
                      dcPolCts: totalValues.polCts,
                      dcSalePrice: totalValues.salePrice,
                      dcSaleAmount: totalValues.saleAmount,
                      dcCostPrice: 0,
                      dcCostAmount: 0,
                      isWon,
                      dcBidPrice: totalValues.bidPrice,
                      dcBidAmount: totalValues.bidAmount,
                      dcResultCost: resultCost ?? 0,
                      dcResultPerCt: resultPerCarat ?? 0,
                      dcResultTotal: resultTotal ?? 0,
                      inUsedPcs: totalValues.pcs,
                      dcUsedCts: totalValues.carats,
                    });
                  }}
                  className="px-2 lg:px-4 h-7 lg:h-9 bg-neutral-800 rounded-sm w-24"
                >
                  Save {isPending && <Loader2 className="animate-spin" />}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </PageWrapper>
  );
}
