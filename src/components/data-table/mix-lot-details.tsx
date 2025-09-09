"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import AutoCompleteInput from "@/components/ui/auto-complete-input";
import ColorDialog from "@/components/dialog/color-dialog";
import { MixLotTenderDetails, TotalValues } from "@/lib/types/tender";
import { Option } from "@/lib/types/common";
import ClarityDialog from "@/components/dialog/clarity-dialog";
import FlrDialog from "@/components/dialog/flr-dialog";
import ShapeDialog from "@/components/dialog/shape-dialog";
import { initialRow } from "../forms/rough-lot-form";

const columns = [
  "Lot",
  "Pcs.",
  "Cts.",
  "Color",
  "C.GD",
  "Clarity",
  "FLR",
  "Shape",
  "Remark",
  "Pol. Cts.",
  "Pol. %",
  "Depth",
  "Table",
  "Ratio",
  "Sale Price",
  "Sale Amnt",
  <Button key={1} className="p-0" variant="ghost" type="button">
    <PlusCircle className="h-4 w-4" />
  </Button>,
];

interface MixLotDetailsProps {
  data: MixLotTenderDetails[];
  handleValueChange: (
    value: MixLotTenderDetails,
    index: number,
    action?: string
  ) => void;
  // handleCostDetails: (values: CostDetails) => void;
  // costDetails: CostDetails;
  lotNo: string;
  colors: Option[];
  clarities: Option[];
  fluorescences: Option[];
  shapes: Option[];
  totalValues: TotalValues;
  setTotalValues: React.Dispatch<React.SetStateAction<TotalValues>>;
}

export function MixLotDetails({
  data,
  handleValueChange,
  colors,
  clarities,
  fluorescences,
  totalValues,
  setTotalValues,
  shapes,
  lotNo,
}: MixLotDetailsProps) {
  useEffect(() => {
    const totals = data.reduce(
      (acc, row) => ({
        pcs: acc.pcs + (row.inRoughPcs || 0),
        carats: acc.carats + (row.dcRoughCts || 0),
        polCts: acc.polCts + (row.dcPolCts || 0),
        polPercent: acc.polPercent + (row.dcPolPer || 0),
        salePrice: acc.salePrice + (row.dcSalePrice || 0),
        saleAmount: acc.saleAmount + (row.dcSaleAmount || 0),
        costPrice: 0,
        totalAmount: 0,
      }),
      {
        pcs: 0,
        carats: 0,
        polCts: 0,
        polPercent: 0,
        salePrice: 0,
        saleAmount: 0,
        costPrice: 0,
        totalAmount: 0,
      }
    );

    setTotalValues(totals);
  }, [data, setTotalValues]);

  return (
    <>
      <div className="rounded-md flex-1 flex flex-col min-h-0 h-[45svh]">
        <div className="overflow-auto w-auto">
          <Table isOverflow={false} className="bg-white mb-[34svh]">
            <TableHeader className="sticky top-0 z-40 bg-white border-b">
              <TableRow>
                {columns.map((header, index) => {
                  if (index === columns.length - 1) {
                    return (
                      <TableHead
                        onClick={() =>
                          handleValueChange(initialRow, data.length + 1)
                        }
                        className="border-collapse border border-gray-300 border-t-0"
                        key={index}
                      >
                        {header}
                      </TableHead>
                    );
                  }
                  return (
                    <TableHead
                      className={`border-collapse border border-gray-300 border-t-0`}
                      key={index}
                    >
                      {header}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="border-collapse border border-gray-300">
                      {lotNo}
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-20 text-center"
                        name="pcs"
                        type="number"
                        value={row.inRoughPcs}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined;

                          handleValueChange(
                            {
                              ...row,
                              inRoughPcs: value,
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
                        name="carats"
                        type="number"
                        value={row.dcRoughCts}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined;

                          handleValueChange(
                            {
                              ...row,
                              dcRoughCts: value,
                            },
                            index
                          );
                        }}
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
                        className="w-20 text-right"
                        name="colorGrade"
                        type="number"
                        value={row.inColorGrade}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined;
                          handleValueChange(
                            {
                              ...row,
                              inColorGrade: value,
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
                        selectedValue={row.fluorescence}
                        widthClass="w-24"
                        dropdownClass="w-32"
                        handleValueChange={(value) => {
                          if (value) {
                            handleValueChange(
                              {
                                ...row,
                                fluorescence: value,
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
                        className="w-22"
                        name="remark"
                        type="text"
                        value={row.stRemark}
                        onChange={(e) => {
                          handleValueChange(
                            {
                              ...row,
                              stRemark: e.target.value,
                            },
                            index
                          );
                        }}
                        placeholder="Remark"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-20 text-right"
                        name="polCts"
                        type="number"
                        disabled
                        value={row.dcPolCts}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined;

                          handleValueChange(
                            {
                              ...row,
                              dcPolCts: value,
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
                        value={row.dcPolPer}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined;

                          if (value && row.dcRoughCts) {
                            const polCts = parseFloat(
                              ((value * row.dcRoughCts) / 100).toFixed(2)
                            );

                            handleValueChange(
                              {
                                ...row,
                                dcPolCts: polCts,
                                dcPolPer: value,
                              },
                              index
                            );
                          } else {
                            handleValueChange(
                              {
                                ...row,
                                dcPolCts: undefined,
                                dcPolPer: undefined,
                              },
                              index
                            );
                          }
                        }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-20 text-right"
                        name="depth"
                        type="number"
                        value={row.dcDepth}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined;
                          handleValueChange(
                            {
                              ...row,
                              dcDepth: value,
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
                        name="table"
                        type="number"
                        value={row.dcTable}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined;
                          handleValueChange(
                            {
                              ...row,
                              dcTable: value,
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
                        name="ratio"
                        type="number"
                        value={row.dcRatio}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined;
                          handleValueChange(
                            {
                              ...row,
                              dcRatio: value,
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
                        value={row.dcSalePrice}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined;

                          if (value && row.dcPolCts) {
                            const saleAmount = parseFloat(
                              (value * row.dcPolCts).toFixed(2)
                            );

                            handleValueChange(
                              {
                                ...row,
                                dcSalePrice: value,
                                dcSaleAmount: saleAmount,
                              },
                              index
                            );
                          } else {
                            handleValueChange(
                              {
                                ...row,
                                dcSalePrice: undefined,
                                dcSaleAmount: undefined,
                              },
                              index
                            );
                          }
                        }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-20 text-right"
                        name="saleAmount"
                        type="number"
                        value={row.dcSaleAmount}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined;

                          if (value && row.dcPolCts) {
                            const salePrice = parseFloat(
                              (value / row.dcPolCts).toFixed(2)
                            );
                            handleValueChange(
                              {
                                ...row,
                                dcSalePrice: salePrice,
                                dcSaleAmount: value,
                              },
                              index
                            );
                          } else {
                            handleValueChange(
                              {
                                ...row,
                                dcSalePrice: undefined,
                                dcSaleAmount: undefined,
                              },
                              index
                            );
                          }
                        }}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Button
                        variant="ghost"
                        type="button"
                        className="p-0"
                        onClick={() => handleValueChange(row, index, "delete")}
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
      <div className="px-10 flex items-center justify-around flex-wrap w-full gap-6 h-10 bg-gray-100">
        <p className="text-gray-600 text-sm font-semibold">
          Pcs: {totalValues.pcs}
        </p>
        <p className="text-gray-600 text-sm font-semibold">
          Cts: {totalValues.carats?.toFixed(2)}
        </p>
        <p className="text-gray-600 text-sm font-semibold">
          Pol Cts: {totalValues.polCts?.toFixed(2)}
        </p>
        <p className="text-gray-600 text-sm font-semibold">
          Pol Percent: {totalValues.polPercent}%
        </p>
        <p className="text-gray-600 text-sm font-semibold">
          Sale Price: {totalValues.salePrice?.toFixed(2)}
        </p>
      </div>
    </>
  );
}
