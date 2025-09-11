"use client";

import { LinkLoadingIndicator } from "@/components/common/link-loading-indicator";
import { buttonVariants } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type TenderColumns = {
  id: number;
  stTenderName: string;
  stPersonName: string;
  dcNetPercentage: number;
  dcLabour: number;
  dtVoucherDate: Date;
};

export const columns: ColumnDef<TenderColumns>[] = [
  {
    accessorKey: "dtVoucherDate",
    header: "Voucher Date",
    cell: ({ row }) => {
      const voucherDate = row.getValue("dtVoucherDate") as Date;
      return (
        <div className="flex items-center text-nowrap gap-2">
          {new Date(voucherDate).toDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: "stTenderName",
    header: "Name",
    cell: ({ row }) => {
      const { stTenderName } = row.original;
      return (
        <div title={stTenderName} className="max-w-56 truncate">
          {stTenderName}
        </div>
      );
    },
  },
  {
    accessorKey: "stPersonName",
    header: "Person Name",
    cell: ({ row }) => {
      const { stPersonName } = row.original;
      return (
        <div title={stPersonName} className="max-w-56 truncate">
          {stPersonName}
        </div>
      );
    },
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
    id: "tenderTypes",
    header: "Tender Types",
    cell: ({ row }) => {
      const id = row.original.id as number;
      return (
        <div className="flex items-center gap-2">
          {tenderTypes.map((tenderType) => {
            // let url = `/tenders/tender-details/create?tenderId=${id}`;
            let url = `/tenders/${tenderType.value}?baseTenderId=${id}`;
            if (tenderType.value === "single-stone") {
              url = `/tenders/single-stone/create?tenderId=${id}`;
            }

            return (
              <Link
                className={`${buttonVariants({ variant: "outline" })} w-28`}
                href={url}
                key={tenderType.value}
              >
                {tenderType.label} <LinkLoadingIndicator />
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
  { value: "mix-lot", label: "Mix Lot" },
  { value: "multi-lot/rough", label: "Rough Multi" },
  { value: "multi-lot/mix", label: "Mix Multi" },
];
