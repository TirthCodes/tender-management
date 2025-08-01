"use client";

import { buttonVariants } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
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
    accessorKey: "inPcs",
    header: "Pcs",
  },
  {
    accessorKey: "dcCts",
    header: "Cts",
  },
  {
    accessorKey: "inRemainingPcs",
    header: "Remaining Pcs",
  },
  {
    accessorKey: "dcRemainingCts",
    header: "Remaining Cts",
  },
  {
    id: "create",
    header: "Create",
    cell: ({ row }) => {
      const id = row.original.id as number;
      const searchParams = typeof window !== 'undefined' ? window?.location?.search : '';
      const urlParams = new URLSearchParams(searchParams);
      const baseTenderId = urlParams.get("baseTenderId");

      return (
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/tenders/mix-lot?baseTenderId=${baseTenderId}&mainLotId=${id}`}
        >
          Create
        </Link>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
  },
];