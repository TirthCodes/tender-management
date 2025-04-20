"use client";

import { Decimal } from "@prisma/client/runtime/library";
import { ColumnDef } from "@tanstack/react-table";

export type TenderColumns = {
  id: number;
  stTenderName: string;
  stPersonName: string;
  dcNetPercentage: Decimal | number;
  dcLabour: Decimal | number;
  dtVoucherDate: Date | string;
};

export const columns: ColumnDef<TenderColumns>[] = [
  {
    accessorKey: "stTenderName",
    header: "Name",
  },
  {
    accessorKey: "stPersonName",
    header: "Person Name",
  },
  {
    accessorKey: "dcNetPercentage",
    header: "Net %",
  },
  {
    accessorKey: "dcLabour",
    header: "Labour",
  },
  {
    accessorKey: "dtVoucherDate",
    header: "Voucher Date",
  },
  {
    id: "actions",
    header: "Actions"
  },
];