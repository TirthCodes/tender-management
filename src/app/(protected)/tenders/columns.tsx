"use client";

import { buttonVariants } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

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
          {new Date(voucherDate).toDateString()}
        </div>
      );
    },
  },
  {
    id: "tenderTypes",
    header: "Tender Types",
    cell: ({ row }) => {
      const id = row.original.id as number;
      return (
        <div className="flex items-center gap-2">
          {tenderTypes.map((tenderType) => {
            return (
              <Link
                className={buttonVariants({ variant: "outline" })}
                href={`/tenders/${tenderType.value}?id=${id}`}
                key={tenderType.value}
              >
                {tenderType.label}
              </Link>
            );
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
  },
];

const tenderTypes = [
  { value: "single-stone", label: "Single Stone" },
  { value: "rough-lot", label: "Rough Lot" },
  { value: "multi-lot", label: "Multi Lot" },
  { value: "mix-lot", label: "Mix Lot" },
];
