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
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { singleInitialRow } from "../../forms/create-single-stone-form";
import {
  calculateBidPrice,
  calculateBidPriceOnAmount,
  calculateCostPrice,
  calculateResultCost,
  calculateResultPerCarat,
  calculateTotalAmount,
} from "@/lib/formula";

const columns = [
  "Lot",
  "Pcs.",
  "Cts.",
  "Size",
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
  "Tops Amnt",
  "Incription",
  "Bid Price",
  "Total Amount",
  "Result Total",
  "Result/Ct",
  "Result Cost",
  <Button key={1} className="p-0" variant="ghost" type="button">
    <PlusCircle className="h-4 w-4" />
  </Button>,
];

interface SingleTenderDataTableProps {
  data: SingleStoneTenderDetails[];
  handleValueChange: (
    value: SingleStoneTenderDetails,
    index: number,
    action?: string
  ) => void;
  colors: Option[];
  clarities: Option[];
  fluorescences: Option[];
  shapes: Option[];
  // totalValues: TotalValues;
  labourValue: number;
  netPercernt: number;
  setTotalValues: React.Dispatch<React.SetStateAction<TotalValues>>;
  isRowsLoading: boolean;
}

export function SingleTenderDataTable({
  data,
  handleValueChange,
  colors,
  clarities,
  fluorescences,
  isRowsLoading,
  // totalValues,
  setTotalValues,
  shapes,
  labourValue,
  netPercernt,
}: SingleTenderDataTableProps) {
  useEffect(() => {
    const totals = data?.reduce(
      (acc, row) => ({
        pcs: acc.pcs + (row.roughPcs || 0),
        carats: acc.carats + (row.roughCts || 0),
        polCts: acc.polCts + (row.polCts || 0),
        polPercent: acc.polPercent + (row.polPercent || 0),
        salePrice: acc.salePrice + (row.salePrice || 0),
        saleAmount: acc.saleAmount + (row.saleAmount || 0),
        costPrice: acc.costPrice + (row.costPrice || 0),
        topsAmount: acc.topsAmount + (row.topsAmount || 0),
        totalAmount: acc.totalAmount + (row.totalAmount || 0),
      }),
      {
        pcs: 0,
        carats: 0,
        polCts: 0,
        polPercent: 0,
        salePrice: 0,
        saleAmount: 0,
        costPrice: 0,
        topsAmount: 0,
        totalAmount: 0,
      }
    );

    setTotalValues(totals);
  }, [data, setTotalValues]);

  return (
    <>
      <div className="rounded-md flex-1 flex flex-col min-h-0 h-[65svh]">
        <div className="overflow-auto w-auto">
          <Table isOverflow={false} className="bg-white mb-[54svh]">
            <TableHeader className="sticky top-0 z-40 bg-white border-b">
              <TableRow>
                {columns.map((header, index) => {
                  const isLast = index === columns.length - 1;
                  return (
                    <TableHead
                      key={index}
                      onClick={
                        isLast
                          ? () =>
                              handleValueChange(singleInitialRow, data?.length + 1 || 1)
                          : undefined
                      }
                      className={`text-nowrap border-collapse border border-gray-300 border-t-0 
                        ${isLast ? "sticky right-0 bg-neutral-50 z-50" : ""}`}
                      style={{ borderTopWidth: 0 }}
                    >
                      {header}
                    </TableHead>
                  );
                  // if (index === columns.length - 1) {
                  //   return (
                  //     <TableHead
                  //       onClick={() =>
                  //         handleValueChange(singleInitialRow, data?.length + 1 || 1)
                  //       }
                  //       style={{ borderTopWidth: 0 }}
                  //       className="border-collapse border border-gray-300 border-t-0"
                  //       key={index}
                  //     >
                  //       {header}
                  //     </TableHead>
                  //   );
                  // }
                  // return (
                  //   <TableHead
                  //     className={`text-nowrap border-collapse border border-gray-300 border-t-0`}
                  //     key={index}
                  //     style={{ borderTopWidth: 0 }}
                  //   >
                  //     {header}
                  //   </TableHead>
                  // );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length > 0 ? (
                data?.map((row, index) => (
                  <TableRow key={index} className={isRowsLoading ? "animate-pulse bg-neutral-50": ""}>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-20"
                        name="lotNo"
                        type="text"
                        value={row.lotNo || ""}
                        onChange={(e) => {
                          handleValueChange(
                            {
                              ...row,
                              lotNo: e.target.value.toUpperCase(),
                            },
                            index
                          );
                        }}
                        placeholder="FS39"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-10 px-1 text-center"
                        name="roughPcs"
                        type="number"
                        value={row.roughPcs || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
                              roughPcs: value,
                              roughSize: parseFloat(
                                (value / row.roughCts).toFixed(2)
                              ),
                            },
                            index
                          );
                        }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-16 px-1 text-right"
                        name="roughCts"
                        type="number"
                        value={row.roughCts || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;

                          let polCts = 0;
                          let polPercent = 0;
                          let saleAmount = 0;
                          let salePrice = 0;

                          if (!isNaN(row.polPercent) && !isNaN(value)) {
                            polCts = parseFloat(
                              ((row.polPercent * value) / 100).toFixed(2)
                            );
                          }

                          if (!isNaN(polCts) && !isNaN(value)) {
                            polPercent = parseFloat(
                              ((polCts / value) * 100).toFixed(2)
                            );
                          }

                          if (!isNaN(polCts) && !isNaN(row.salePrice)) {
                            saleAmount = parseFloat(
                              (row.salePrice * polCts).toFixed(2)
                            );
                          }

                          if (!isNaN(saleAmount) && !isNaN(polCts)) {
                            salePrice = parseFloat(
                              (saleAmount / polCts).toFixed(2)
                            );
                          }

                          handleValueChange(
                            {
                              ...row,
                              roughCts: value,
                              roughSize: parseFloat(
                                (row.roughPcs / value).toFixed(2)
                              ),
                              polCts,
                              polPercent,
                              saleAmount,
                              salePrice,
                            },
                            index
                          );
                        }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-10 px-1 text-right"
                        name="roughSize"
                        type="number"
                        value={row.roughSize || ""}
                        step={0.01}
                        readOnly
                        disabled
                        // onChange={(e) => {
                        //   const value = e.target.value
                        //     ? parseFloat(e.target.value)
                        //     : 0;
                        //   handleValueChange(
                        //     {
                        //       ...row,
                        //       roughSize: value,
                        //     },
                        //   );
                        // }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <AutoCompleteInput
                        data={colors}
                        title="Color"
                        selectedValue={row.color}
                        widthClass="w-24"
                        dropdownClass="w-36"
                        handleValueChange={(value) => {
                          if (value) {
                            handleValueChange(
                              {
                                ...row,
                                color: value,
                              },
                              index
                            );
                          }
                        }}
                        createDialogContent={<ColorDialog />}
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-10 px-1 text-center"
                        name="colorGrade"
                        type="number"
                        value={row.colorGrade || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
                              colorGrade: value,
                            },
                            index
                          );
                        }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <AutoCompleteInput
                        data={clarities}
                        title="Clarity"
                        selectedValue={row.clarity}
                        widthClass="w-24"
                        dropdownClass="w-32"
                        handleValueChange={(value) => {
                          if (value) {
                            handleValueChange(
                              {
                                ...row,
                                clarity: value,
                              },
                              index
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
                        selectedValue={row.flr}
                        widthClass="w-24"
                        dropdownClass="w-32"
                        handleValueChange={(value) => {
                          if (value) {
                            handleValueChange(
                              {
                                ...row,
                                flr: value,
                              },
                              index
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
                        selectedValue={row.shape}
                        widthClass="w-24"
                        dropdownClass="w-32"
                        handleValueChange={(value) => {
                          if (value) {
                            handleValueChange(
                              {
                                ...row,
                                shape: value,
                              },
                              index
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
                        value={row.polCts || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;

                          let polPercent = 0;
                          let saleAmount = 0;
                          let salePrice = 0;

                          if (!isNaN(value) && !isNaN(row.roughCts)) {
                            polPercent = parseFloat(
                              ((value * 100) / row.roughCts).toFixed(2)
                            );
                          }

                          if (!isNaN(value) && !isNaN(row.salePrice)) {
                            saleAmount = parseFloat(
                              (row.salePrice * value).toFixed(2)
                            );
                          }

                          if (!isNaN(saleAmount) && !isNaN(value)) {
                            salePrice = parseFloat(
                              (saleAmount / value).toFixed(2)
                            );
                          }

                          handleValueChange(
                            {
                              ...row,
                              polCts: value,
                              polPercent,
                              saleAmount,
                              salePrice,
                            },
                            index
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
                        value={row.polPercent || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;

                          let polCts = 0;
                          let saleAmount = 0;
                          let salePrice = 0;

                          if (!isNaN(value) && !isNaN(row.roughCts)) {
                            polCts = parseFloat(
                              ((value * row.roughCts) / 100).toFixed(2)
                            );
                          }

                          if (!isNaN(polCts) && !isNaN(row.salePrice)) {
                            saleAmount = parseFloat(
                              (row.salePrice * polCts).toFixed(2)
                            );
                          }

                          if (!isNaN(saleAmount) && !isNaN(polCts)) {
                            salePrice = parseFloat(
                              (saleAmount / polCts).toFixed(2)
                            );
                          }

                          handleValueChange(
                            {
                              ...row,
                              polPercent: value,
                              polCts,
                              saleAmount,
                              salePrice,
                            },
                            index
                          );
                        }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-14 px-1 text-right"
                        name="depth"
                        type="number"
                        value={row.depth || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
                              depth: value,
                            },
                            index
                          );
                        }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-14 px-1 text-right"
                        name="table"
                        type="number"
                        value={row.table || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
                              table: value,
                            },
                            index
                          );
                        }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-10 px-1 text-right"
                        name="ratio"
                        type="number"
                        value={row.ratio || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
                              ratio: value,
                            },
                            index
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
                        value={row.salePrice || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;

                          // let polPercent = 0
                          // let polCts = 0
                          let saleAmount = 0;

                          // if(!isNaN(row.polPercent) && !isNaN(row.roughCts)) {
                          //   polCts = parseFloat(((row.polPercent * row.roughCts) / 100).toFixed(2))
                          // }

                          // if(!isNaN(row.roughCts) && isNaN(polCts)) {
                          //   polPercent = parseFloat(((polCts / row.roughCts) * 100).toFixed(2))
                          // }

                          if (!isNaN(row.polCts) && !isNaN(value)) {
                            saleAmount = parseFloat(
                              (value * row.polCts).toFixed(2)
                            );
                          }

                          handleValueChange(
                            {
                              ...row,
                              salePrice: value,
                              // polCts,
                              // polPercent,
                              saleAmount,
                            },
                            index
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
                        value={row.saleAmount || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;

                          // let polPercent = 0
                          // let polCts = 0
                          let salePrice = 0;

                          // if(!isNaN(row.polPercent) && !isNaN(row.roughCts)) {
                          //   polCts = parseFloat(((row.polPercent * row.roughCts) / 100).toFixed(2))
                          // }

                          // if(!isNaN(row.roughCts) && isNaN(polCts)) {
                          //   polPercent = parseFloat(((polCts / row.roughCts) * 100).toFixed(2))
                          // }

                          if (!isNaN(row.polCts) && !isNaN(value)) {
                            salePrice = parseFloat(
                              (value / row.polCts).toFixed(2)
                            );
                          }

                          handleValueChange(
                            {
                              ...row,
                              saleAmount: value,
                              // polCts,
                              // polPercent,
                              salePrice,
                            },
                            index
                          );
                        }}
                        readOnly
                        disabled
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-24 text-right"
                        name="costPrice"
                        type="number"
                        value={row.costPrice || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;

                          const bidPrice = calculateBidPrice(
                            value,
                            row.topsAmount,
                            row.polCts,
                            row.roughCts,
                            labourValue,
                            netPercernt
                          );

                          const totalAmount = calculateTotalAmount(
                            bidPrice,
                            row.roughCts
                          );

                          handleValueChange(
                            {
                              ...row,
                              bidPrice,
                              totalAmount,
                              costPrice: value,
                            },
                            index
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
                        value={row.topsAmount || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
                              topsAmount: value,
                            },
                            index
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
                        value={row.incription || ""}
                        onChange={(e) => {
                          handleValueChange(
                            {
                              ...row,
                              incription: e.target.value,
                            },
                            index
                          );
                        }}
                        placeholder="RD-2.35"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-20 text-right"
                        name="bidPrice"
                        type="number"
                        value={row.bidPrice || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;

                          const costPrice = calculateCostPrice(
                            value,
                            labourValue,
                            row.roughCts,
                            row.polCts,
                            row.topsAmount
                          );

                          handleValueChange(
                            {
                              ...row,
                              costPrice,
                              bidPrice: value,
                            },
                            index
                          );
                        }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-full text-right"
                        name="totalAmount"
                        type="number"
                        value={row.totalAmount || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;

                          const bidPrice = calculateBidPriceOnAmount(
                            value,
                            row.roughCts
                          );

                          handleValueChange(
                            {
                              ...row,
                              bidPrice,
                              totalAmount: value,
                            },
                            index
                          );
                        }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-20 text-right"
                        name="resultTotal"
                        type="number"
                        value={row.resultTotal || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;

                          const resultPerCarat = calculateResultPerCarat(
                            value,
                            row.roughCts
                          );

                          const resultCost = calculateResultCost(
                            resultPerCarat,
                            labourValue,
                            row.polCts,
                            row.roughCts,
                            row.topsAmount
                          );
                          handleValueChange(
                            {
                              ...row,
                              resultCost,
                              resultPerCarat,
                              resultTotal: value,
                            },
                            index
                          );
                        }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-20 text-right"
                        name="resultPerCarat"
                        type="number"
                        value={row.resultPerCarat || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;

                          const resultCost = calculateResultCost(
                            value,
                            labourValue,
                            row.polCts,
                            row.roughCts,
                            row.topsAmount
                          );

                          handleValueChange(
                            {
                              ...row,
                              resultCost,
                              resultPerCarat: value,
                            },
                            index
                          );
                        }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-20 text-right"
                        name="resultCost"
                        type="number"
                        value={row.resultCost || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
                              resultCost: value,
                            },
                            index
                          );
                        }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="sticky right-0 bg-neutral-50 z-40 border-collapse border border-gray-300">
                      <Button
                        variant="ghost"
                        type="button"
                        className="p-0"
                        onClick={() => {
                          handleValueChange(row, index, "delete");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
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
      {/* <div className="px-10 flex items-center gap-10 h-10 bg-gray-100 border-t">
        <p className="text-gray-600 w-28 text-sm font-semibold">
          Pcs: {totalValues?.pcs}
        </p>
        <p className="text-gray-600 w-28 text-sm font-semibold">
          Cts: {totalValues?.carats}
        </p>
        <p className="text-gray-600 w-28 text-sm font-semibold">
          Pol Cts: {totalValues?.polCts}
        </p>
        <p className="text-gray-600 w-28 text-sm font-semibold">
          Pol %: {totalValues?.polPercent}%
        </p>
        <p className="text-gray-600 w-36 text-sm font-semibold">
          Sale Price: {totalValues?.salePrice}
        </p>
        <p className="text-gray-600 w-36 text-sm font-semibold">
          Cost Price: {totalValues?.costPrice}
        </p>
        <p className="text-gray-600 w-28 text-sm font-semibold">
          Tops Amount: {totalValues?.topsAmount}
        </p>
      </div> */}
    </>
  );
}
