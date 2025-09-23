"use client";

import { LinkLoadingIndicator } from "@/components/common/link-loading-indicator";
import { buttonVariants } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export type MixMultiLotColumns = {
  id: number;
  stName: string;
  stLotNo: string;
  stRemarks: string | null;
  inPcs: number;
  inRemainingPcs: number;
  dcCts: number;
  dcRemainingCts: number;
  dcPolCts: number;
  dcSalePrice: number;
  dcSaleAmount: number;
  dcBidPrice: number;
  dcBidAmount: number;
  dcResultCost: number;
  dcResultPerCt: number;
  dcResultTotal: number;
  isWon: boolean;
  inUsedPcs: number;
  dcUsedCts: number;
};

export const columns: ColumnDef<MixMultiLotColumns>[] = [
  {
    accessorKey: "stLotNo",
    header: "Lot No",
  },
  {
    accessorKey: "stName",
    header: "Name",
  },
  {
    id: "pcs",
    header: "Pcs",
    cell: ({ row }) => {
      const { inPcs, inUsedPcs } = row.original;

      return (
        <div className="flex flex-col gap-1">
          <p>{inPcs}</p>
          <p>{inUsedPcs}</p>
        </div>
      );
    },
  },
  {
    id: "carats",
    header: "Cts",
    cell: ({ row }) => {
      const { dcCts, dcUsedCts } = row.original;

      return (
        <div className="flex flex-col gap-1">
          <p>{dcCts}</p>
          <p>{dcUsedCts}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "dcPolCts",
    header: "Pol. Cts.",
  },
  {
    id: "sale",
    header: "Sale",
    cell: ({ row }) => {
      const { dcSalePrice, dcSaleAmount } = row.original;

      return (
        <div className="flex flex-col gap-1">
          <p className="font-medium">{dcSalePrice}</p>
          <p className="font-medium">{dcSaleAmount}</p>
        </div>
      );
    },
  },
  {
    id: "bid",
    header: "Bid",
    cell: ({ row }) => {
      const { dcBidPrice, dcBidAmount } = row.original;

      return (
        <div className="flex flex-col gap-1">
          <p className="font-medium">{dcBidPrice}</p>
          <p className="font-medium">{dcBidAmount}</p>
        </div>
      );
    },
  },
  {
    id: "result",
    header: "Result",
    cell: ({ row }) => {
      const { dcResultTotal, dcResultPerCt, dcResultCost } = row.original;

      return (
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-medium">{dcResultTotal}</p>
            <p className="font-medium">{dcResultPerCt}</p>
          </div>
          <p className="font-semibold">{dcResultCost}</p>
        </div>
      );
    },
  },
  {
    id: "is-won",
    header: "Won",
    cell: ({ row }) => {
      const { isWon } = row.original;

      return (
        <div className="flex items-center gap-2">
          <p className={`font-medium ${isWon ? "text-green-800" : "text-red-800"}`}>{isWon ? "Yes" : "No"}</p>
        </div>
      );
    },
  },
  {
    id: "create",
    header: "Create",
    cell: ({ row }) => {
      const id = row.original.id as number;
      const searchParams =
        typeof window !== "undefined" ? window?.location?.search : "";
      
        const urlParams = new URLSearchParams(searchParams);
      const baseTenderId = urlParams.get("baseTenderId");

      return (
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={
            baseTenderId && id
              ? `/tenders/mix-lot?baseTenderId=${baseTenderId}&mainLotId=${id}`
              : "#"
          }
        >
          Create <LinkLoadingIndicator element={<PlusCircle />} />
        </Link>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
  },
];
