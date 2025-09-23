"use client";

import { LinkLoadingIndicator } from "@/components/common/link-loading-indicator";
import { buttonVariants } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export type RoughMultiLotColumns = {
  id: number;
  stName: string;
  stLotNo: string;
  stRemarks: string | null;
  inPcs: number;
  inRemainingPcs: number;
  dcCts: number;
  dcRemainingCts: number;
  dcPolCts: number;
  dcCostPrice: number;
  dcCostAmount: number;
  dcBidPrice: number;
  dcBidAmount: number;
  inUsedPcs: number;
  dcUsedCts: number;
  dcResultTotal: number;
  dcResultPerCt: number;
  isWon: boolean;
};

export const columns: ColumnDef<RoughMultiLotColumns>[] = [
  {
    accessorKey: "stLotNo",
    header: "Lot No",
  },
  {
    accessorKey: "stName",
    header: "Name",
  },
  {
    accessorKey: "inPcs",
    header: "Pcs",
  },
  {
    accessorKey: "dcCts",
    header: "Cts",
  },
  {
    accessorKey: "dcPolCts",
    header: "Pol. Cts.",
  },
  {
    id: "cost",
    header: "Cost",
    cell: ({ row }) => {
      const { dcCostPrice, dcCostAmount } = row.original;

      return (
        <div className="flex flex-col gap-1">
          <p className="font-medium">{dcCostPrice}</p>
          <p className="font-medium">{dcCostAmount}</p>
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
      const { dcResultTotal, dcResultPerCt } = row.original;

      return (
        <div className="flex flex-col gap-1">
          <p className="font-medium">{dcResultTotal}</p>
          <p className="font-medium">{dcResultPerCt}</p>
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
          className={`${buttonVariants({ variant: "outline" })} shadow-sm`}
          href={
            baseTenderId && id
              ? `/tenders/rough-lot?baseTenderId=${baseTenderId}&mainLotId=${id}`
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
