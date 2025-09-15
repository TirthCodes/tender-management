"use client";

import { ColumnDef } from "@tanstack/react-table";

export type RoughLotColumns = {
  id: number;
  baseTenderId: number;
  stLotNo: string;
  inRoughPcs: number;
  dcRoughCts: number;
  dcRate: number;
  dcAmount: number;
  stRemark: string | null;
  dcLabour: number;
  dcNetPercentage: number;
  dcBidPrice: number;
  dcCostPrice: number;
  dcCostAmount: number;
  dcTotalAmount: number;
  dcResultPerCt: number;
  dcResultTotal: number;
  dcLotSize: number;
  isWon: boolean;
};

export const columns: ColumnDef<RoughLotColumns>[] = [
  {
    accessorKey: "stLotNo",
    header: "Lot No",
  },
  {
    accessorKey: "stRemark",
    header: "Remark",
    meta: {
      style: { width: "300px", maxWidth: "300px" },
    },
    cell: ({ row }) => {
      const { stRemark } = row.original;

      return (
        <div title={stRemark || ""} className="max-w-[300px] truncate">
          {stRemark || "---"}
        </div>
      )
    }
  },
  {
    accessorKey: "inRoughPcs",
    header: "Pcs",
  },
  {
    accessorKey: "dcRoughCts",
    header: "Cts",
  },
  {
    accessorKey: "dcLabour",
    header: "Labour",
  },
  {
    accessorKey: "dcNetPercentage",
    header: "Net %",
  },
  // {
  //   id: "tender-details",
  //   header: "Tender Details",
  //   cell: ({ row }) => {
  //     const { dcNetPercentage, dcLabour } = row.original;

  //     return (
  //       <div className="flex items-center gap-4 w-fit text-nowrap">
  //         <p className="border-r-2 border-neutral-200 pr-4">Labour: {dcLabour}</p>
  //         <p>Net %: {dcNetPercentage}</p>
  //       </div>
  //     )
  //   }
  // },
  
  // {
  //   accessorKey: "dcLotSize",
  //   header: "Lot Size",
  // },
  // {
  //   id: "rough-details",
  //   header: "Rough Details",
  //   cell: ({ row }) => {
  //     const {  inRoughPcs, dcRoughCts, dcLotSize } = row.original;

  //     return (
  //       <div className="flex items-center gap-4 w-fit text-nowrap">
  //         <p className="border-r-2 border-neutral-200 pr-4">Pcs: {inRoughPcs}</p>
  //         <p className="border-r-2 border-neutral-200 pr-4">Cts: {dcRoughCts}</p>
  //         <p>Lot Size: {dcLotSize}</p>
  //       </div>
  //     )
  //   },
  // },
  {
    accessorKey: "dcBidPrice",
    header: "Bid Price",
  },
  {
    accessorKey: "dcTotalAmount",
    header: "Bid Amount",
  },
  {
    accessorKey: "dcResultPerCt",
    header: "Result / Ct",
  },
  {
    accessorKey: "dcResultTotal",
    header: "Total",
  },
  // {
  //   id: "result",
  //   header: "Result",
  //   cell: ({ row }) => {
  //     const { dcResultPerCt, dcResultTotal } = row.original;

  //     return (
  //       <div className="flex items-center gap-4 w-fit text-nowrap">
  //         <p className="border-r-2 border-neutral-200 pr-4">Result / Ct: {dcResultPerCt}</p>
  //         <p>Total: {dcResultTotal}</p>
  //       </div>
  //     )
  //   }
  // },
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