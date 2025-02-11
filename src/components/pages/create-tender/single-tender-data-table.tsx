"use client";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect } from "react";
import AutoCompleteInput from "@/components/ui/auto-complete-input";
import ColorDialog from "@/components/dialog/color-dialog";
import { SingleStoneTenderDetails, TotalValues } from "@/lib/types/tender";
import { Option } from "@/lib/types/common";
import ClarityDialog from "@/components/dialog/clarity-dialog";
import FlrDialog from "@/components/dialog/flr-dialog";
import ShapeDialog from "@/components/dialog/shape-dialog";

const columns = [
  "Lot",
  "Name",
  "Pcs.",
  "Cts.",
  "Size",
  "Price",
  "Total",
  "Color",
  "C.GD",
  "Clarity",
  "FLR",
  "Shape",
  "Pol. Cts.",
  "Pol. %",
  "Depth",
  "Table",
  "Ratio",
  "Sale Price",
  "Sale Amnt",
  "Cost Price",
  "Cost Amnt",
  "Tops Amnt",
  "Incription",
  "Result Total",
  "Final Bid",
  // <Button key={1} className="p-0" variant="ghost" type="button">
  //   <PlusCircle className="h-4 w-4" />
  // </Button>,
];

interface SingleTenderDataTableProps {
  data: SingleStoneTenderDetails;
  handleValueChange: (
    value: SingleStoneTenderDetails,
  ) => void;
  // handleCostDetails: (values: CostDetails) => void;
  // costDetails: CostDetails;
  colors: Option[];
  clarities: Option[];
  fluorescences: Option[];
  shapes: Option[];
  totalValues: TotalValues;
  setTotalValues: React.Dispatch<React.SetStateAction<TotalValues>>;
}

export function SingleTenderDataTable({
  data,
  handleValueChange,
  colors,
  clarities,
  fluorescences,
  totalValues,
  setTotalValues,
  shapes,
}: SingleTenderDataTableProps) {
  useEffect(() => {
    setTotalValues({
      pcs: data.roughPcs || 0,
      carats: data.roughCts || 0,
      polCts: data.polCts || 0,
      polPercent: data.polPercent || 0,
      salePrice: data.salePrice || 0,
      costPrice: data.costPrice || 0,
      topsAmount: data.topsAmount || 0,
    });
  }, [data, setTotalValues]);

  return (
    <>
      <div className="rounded-md flex-1 flex flex-col min-h-0 h-[23.5svh]">
        <div className="overflow-x-auto w-auto">
          <Table className="bg-white mb-32">
            <TableHeader className="sticky top-0 z-40 bg-white border-b">
              <TableRow>
                {columns.map((header, index) => {
                  // if (index === columns.length - 1) {
                  //   return (
                  //     <TableHead
                  //       onClick={() =>
                  //         handleValueChange(singleInitialRow, data.length + 1)
                  //       }
                  //       className="border-collapse border border-gray-300"
                  //       key={index}
                  //     >
                  //       {header}
                  //     </TableHead>
                  //   );
                  // }
                  return (
                    <TableHead
                      className={`border-collapse border border-gray-300`}
                      key={index}
                    >
                      {header}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data ? (
                <TableRow>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20"
                    name="lotNo"
                    type="text"
                    value={data.lotNo || ""}
                    onChange={(e) => {
                      handleValueChange(
                        {
                          ...data,
                          lotNo: e.target.value,
                        },
                      );
                    }}
                    placeholder="FS39"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20"
                    name="roughName"
                    type="text"
                    value={data.roughName || ""}
                    onChange={(e) => {
                      handleValueChange(
                        {
                          ...data,
                          roughName: e.target.value,
                        },
                      );
                    }}
                    placeholder="Name"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-center"
                    name="roughPcs"
                    type="number"
                    value={data.roughPcs || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;
                      handleValueChange(
                        {
                          ...data,
                          roughPcs: value,
                          roughSize: parseFloat((value / data.roughCts).toFixed(2)),
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="roughCts"
                    type="number"
                    value={data.roughCts || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;

                      let polCts = 0
                      let polPercent = 0
                      let saleAmount = 0
                      let salePrice = 0

                      if(!isNaN(data.polPercent) && !isNaN(value)) {
                        polCts = parseFloat(((data.polPercent * value) / 100).toFixed(2))
                      }
                      
                      if(!isNaN(polCts) && !isNaN(value)) {
                        polPercent = parseFloat(((polCts / value) * 100).toFixed(2))
                      }

                      if(!isNaN(polCts) && !isNaN(data.salePrice)) {
                        saleAmount = parseFloat((data.salePrice * polCts).toFixed(2))
                      }

                      if(!isNaN(saleAmount) && !isNaN(polCts)) {
                        salePrice = parseFloat((saleAmount / polCts).toFixed(2))
                      }

                      handleValueChange(
                        {
                          ...data,
                          roughCts: value,
                          roughSize: parseFloat((data.roughPcs / value).toFixed(2)),
                          polCts,
                          polPercent,
                          saleAmount,
                          salePrice,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="roughSize"
                    type="number"
                    value={data.roughSize || ""}
                    step={0.01}
                    readOnly
                    // onChange={(e) => {
                    //   const value = e.target.value
                    //     ? parseFloat(e.target.value)
                    //     : 0;
                    //   handleValueChange(
                    //     {
                    //       ...data,
                    //       roughSize: value,
                    //     },
                    //   );
                    // }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="roughPrice"
                    type="number"
                    value={data.roughPrice || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;
                      handleValueChange(
                        {
                          ...data,
                          roughPrice: value,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="roughTotal"
                    type="number"
                    value={data.roughTotal || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;
                      handleValueChange(
                        {
                          ...data,
                          roughTotal: value,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <AutoCompleteInput
                    data={colors}
                    title="Color"
                    selectedValue={data.color}
                    widthClass="w-24"
                    dropdownClass="w-36"
                    handleValueChange={(value) => {
                      if (value) {
                        handleValueChange(
                          {
                            ...data,
                            color: value,
                          },
                        );
                      }
                    }}
                    createDialogContent={<ColorDialog />}
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="colorGrade"
                    type="number"
                    value={data.colorGrade || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;
                      handleValueChange(
                        {
                          ...data,
                          colorGrade: value,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <AutoCompleteInput
                    data={clarities}
                    title="Clarity"
                    selectedValue={data.clarity}
                    widthClass="w-24"
                    dropdownClass="w-32"
                    handleValueChange={(value) => {
                      if (value) {
                        handleValueChange(
                          {
                            ...data,
                            clarity: value,
                          },
                        );
                      }
                    }}
                    createDialogContent={<ClarityDialog />}
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <AutoCompleteInput
                    data={fluorescences}
                    title="FLR"
                    selectedValue={data.flr}
                    widthClass="w-24"
                    dropdownClass="w-32"
                    handleValueChange={(value) => {
                      if (value) {
                        handleValueChange(
                          {
                            ...data,
                            flr: value,
                          },
                        );
                      }
                    }}
                    createDialogContent={<FlrDialog />}
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <AutoCompleteInput
                    data={shapes}
                    title="Shape"
                    selectedValue={data.shape}
                    widthClass="w-24"
                    dropdownClass="w-32"
                    handleValueChange={(value) => {
                      if (value) {
                        handleValueChange(
                          {
                            ...data,
                            shape: value,
                          },
                        );
                      }
                    }}
                    createDialogContent={<ShapeDialog />}
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="polCts"
                    type="number"
                    value={data.polCts || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;

                      let polPercent = 0
                      let saleAmount = 0
                      let salePrice = 0
  
                      if(!isNaN(value) && !isNaN(data.roughCts)) {
                        polPercent = parseFloat(((value / data.roughCts) * 100).toFixed(2))
                      }

                      if(!isNaN(value) && !isNaN(data.salePrice)) {
                        saleAmount = parseFloat((data.salePrice * value).toFixed(2))
                      }

                      if(!isNaN(saleAmount) && !isNaN(value)) {
                        salePrice = parseFloat((saleAmount / value).toFixed(2))
                      }

                      handleValueChange(
                        {
                          ...data,
                          polCts: value,
                          polPercent,
                          saleAmount,
                          salePrice,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="polPercent"
                    type="number"
                    value={data.polPercent || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;

                      let polCts = 0
                      let saleAmount = 0
                      let salePrice = 0
  
                      if(!isNaN(value) && !isNaN(data.roughCts)) {
                        polCts = parseFloat(((value * data.roughCts) / 100).toFixed(2))
                      }

                      if(!isNaN(polCts) && !isNaN(data.salePrice)) {
                        saleAmount = parseFloat((data.salePrice * polCts).toFixed(2))
                      }

                      if(!isNaN(saleAmount) && !isNaN(polCts)) {
                        salePrice = parseFloat((saleAmount / polCts).toFixed(2))
                      }

                      handleValueChange(
                        {
                          ...data,
                          polPercent: value,
                          polCts,
                          saleAmount,
                          salePrice,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="depth"
                    type="number"
                    value={data.depth || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;
                      handleValueChange(
                        {
                          ...data,
                          depth: value,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="table"
                    type="number"
                    value={data.table || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;
                      handleValueChange(
                        {
                          ...data,
                          table: value,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="ratio"
                    type="number"
                    value={data.ratio || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;
                      handleValueChange(
                        {
                          ...data,
                          ratio: value,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="salePrice"
                    type="number"
                    value={data.salePrice || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;

                      // let polPercent = 0
                      // let polCts = 0
                      let saleAmount = 0
  
                      // if(!isNaN(data.polPercent) && !isNaN(data.roughCts)) {
                      //   polCts = parseFloat(((data.polPercent * data.roughCts) / 100).toFixed(2))
                      // }

                      // if(!isNaN(data.roughCts) && isNaN(polCts)) {
                      //   polPercent = parseFloat(((polCts / data.roughCts) * 100).toFixed(2))
                      // }

                      if(!isNaN(data.polCts) && !isNaN(value)) {
                        saleAmount = parseFloat((value * data.polCts).toFixed(2))
                      }

                      handleValueChange(
                        {
                          ...data,
                          salePrice: value,
                          // polCts,
                          // polPercent,
                          saleAmount,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="saleAmount"
                    type="number"
                    value={data.saleAmount || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;

                      // let polPercent = 0
                      // let polCts = 0
                      let salePrice = 0
    
                      // if(!isNaN(data.polPercent) && !isNaN(data.roughCts)) {
                      //   polCts = parseFloat(((data.polPercent * data.roughCts) / 100).toFixed(2))
                      // }
  
                      // if(!isNaN(data.roughCts) && isNaN(polCts)) {
                      //   polPercent = parseFloat(((polCts / data.roughCts) * 100).toFixed(2))
                      // }
  
                      if(!isNaN(data.polCts) && !isNaN(value)) {
                        salePrice = parseFloat((value / data.polCts).toFixed(2))
                      }
  
                      handleValueChange(
                        {
                          ...data,
                          saleAmount: value,
                          // polCts,
                          // polPercent,
                          salePrice,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="costPrice"
                    type="number"
                    value={data.costPrice || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;
                      handleValueChange(
                        {
                          ...data,
                          costPrice: value,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="costAmount"
                    type="number"
                    value={data.costAmount || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;
                      handleValueChange(
                        {
                          ...data,
                          costAmount: value,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="topsAmount"
                    type="number"
                    value={data.topsAmount || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;
                      handleValueChange(
                        {
                          ...data,
                          topsAmount: value,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20"
                    name="incription"
                    type="text"
                    value={data.incription || ""}
                    onChange={(e) => {
                      handleValueChange(
                        {
                          ...data,
                          incription: e.target.value,
                        },
                      );
                    }}
                    placeholder="RD-2.35"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="resultTotal"
                    type="number"
                    value={data.resultTotal || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;
                      handleValueChange(
                        {
                          ...data,
                          resultTotal: value,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="border-collapse border border-gray-300">
                  <Input
                    className="w-20 text-right"
                    name="finalBidPrice"
                    type="number"
                    value={data.finalBidPrice || ""}
                    step={0.01}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseFloat(e.target.value)
                        : 0;
                      handleValueChange(
                        {
                          ...data,
                          finalBidPrice: value,
                        },
                      );
                    }}
                    placeholder="0"
                  />
                </TableCell>
              </TableRow>
                
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center border-collapse border border-gray-300"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="px-10 flex items-center gap-10 h-10 bg-gray-100">
        <p className="text-gray-600 w-28 text-sm font-semibold">
          Pcs: {totalValues.pcs}
        </p>
        <p className="text-gray-600 w-28 text-sm font-semibold">
          Cts: {totalValues.carats}
        </p>
        <p className="text-gray-600 w-28 text-sm font-semibold">
          Pol Cts: {totalValues.polCts}
        </p>
        <p className="text-gray-600 w-28 text-sm font-semibold">
          Pol %: {totalValues.polPercent}%
        </p>
        <p className="text-gray-600 w-36 text-sm font-semibold">
          Sale Price: {totalValues.salePrice}
        </p>
        <p className="text-gray-600 w-36 text-sm font-semibold">
          Cost Price: {totalValues.costPrice}
        </p>
        <p className="text-gray-600 w-28 text-sm font-semibold">
          Tops Amount: {totalValues.topsAmount}
        </p>
      </div>
    </>
  );
}
