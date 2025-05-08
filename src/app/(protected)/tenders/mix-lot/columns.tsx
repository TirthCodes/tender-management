"use client";

import { ColumnDef } from "@tanstack/react-table";

export type MixLotColumns = {
  id: number;
  baseTenderId: number;
  stLotNo: string;
  inRoughPcs: number;
  dcRoughCts: number;
  // dcRate: number;
  // dcAmount: number;
  // stRemark?: string;
  dcLabour: number;
  dcNetPercentage: number;
  dcBidPrice: number;
  dcTotalAmount: number;
  dcResultPerCt: number;
  dcResultTotal: number;
  dcResultCost: number;
  dcLotSize: number;
};

export const columns: ColumnDef<MixLotColumns>[] = [
  {
    accessorKey: "stLotNo",
    header: "Lot No",
  },
  {
    id: "tender-details",
    header: "Tender Details",
    cell: ({ row }) => {
      const { dcNetPercentage, dcLabour } = row.original;

      return (
        <div className="flex items-center gap-4 w-fit text-nowrap">
          <p className="border-r-2 border-neutral-200 pr-4">Labour: {dcLabour}</p>
          <p>Net %: {dcNetPercentage}</p>
        </div>
      )
    }
  },
  {
    id: "rough-details",
    header: "Rough Details",
    cell: ({ row }) => {
      const {  inRoughPcs, dcRoughCts, dcLotSize } = row.original;

      return (
        <div className="flex items-center gap-4 w-fit text-nowrap">
          <p className="border-r-2 border-neutral-200 pr-4">Pcs: {inRoughPcs}</p>
          <p className="border-r-2 border-neutral-200 pr-4">Cts: {dcRoughCts}</p>
          <p>Lot Size: {dcLotSize}</p>
        </div>
      )
    },
  },
  {
    id: "bid-details",
    header: "Bid Details",
    cell: ({ row }) => {
      const { dcBidPrice, dcTotalAmount } = row.original;

      return (
        <div className="flex items-center gap-4 w-fit text-nowrap">
          <p className="border-r-2 border-neutral-200 pr-4">Bid Price: {dcBidPrice}</p>
          <p>Total Amount: {dcTotalAmount}</p>
        </div>
      )
    }
  },
  {
    id: "result",
    header: "Result",
    cell: ({ row }) => {
      const { dcResultPerCt, dcResultTotal, dcResultCost } = row.original;

      return (
        <div className="flex items-center gap-4 w-fit text-nowrap">
          <p className="border-r-2 border-neutral-200 pr-4">Result / Ct: {dcResultPerCt}</p>
          <p className="border-r-2 border-neutral-200 pr-4">Cost: {dcResultCost}</p>
          <p>Total: {dcResultTotal}</p>
        </div>
      )
    }
  },
  // {
  //   id: "see-details",
  //   header: "Details",
  //   cell: () => {
  //     return (
  //       <Button variant={"link"} className="p-0">
  //         See Details
  //       </Button>
  //     )
  //   }
  // },
  {
    id: "actions",
    header: "Actions",
  },
];