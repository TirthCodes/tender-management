"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TenderColumns = {
  id: number;
  stTenderName: string;
  stPersonName: string;
  dcNetPercentage: number;
  dcLabour: number;
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
    cell: ({ row }) => {
      const voucherDate = row.getValue("dtVoucherDate") as Date;
      return (
        <div className="flex items-center gap-2">
          {voucherDate.toDateString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
  },
];
