"use client";

import { ColumnDef } from "@tanstack/react-table";

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
    id: "actions",
    header: "Actions",
  },
];