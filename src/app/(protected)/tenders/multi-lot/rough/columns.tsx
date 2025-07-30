"use client";

import { buttonVariants } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type MultiLotColumns = {
  id: number;
  stName: string;
  stLotNo: string;
  stRemarks: string | null;
  inPcs: number;
  inRemainingPcs: number;
  dcCts: number;
  dcRemainingCts: number;
};

export const columns: ColumnDef<MultiLotColumns>[] = [
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
      return (
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/tenders/rough-lot?mainLotId=${id}`}
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