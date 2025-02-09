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
import { initialRow } from "./create-tender-form";
import AutoCompleteInput from "@/components/ui/auto-complete-input";
import ColorDialog from "@/components/dialog/color-dialog";
import { TenderDetails, TotalValues } from "@/lib/types/tender";
import { Option } from "@/lib/types/common";
import ClarityDialog from "@/components/dialog/clarity-dialog";
import FlrDialog from "@/components/dialog/flr-dialog";
import ShapeDialog from "@/components/dialog/shape-dialog";

const columns = [
  "Lot",
  "Pcs.",
  "Cts.",
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
  "Labour",
  "Sale Price",
  "Sale Amnt",
  "Cost Price",
  "Cost Amnt",
  "Tops Amnt",
  "Incription",
  <Button key={1} className="p-0" variant="ghost" type="button">
    <PlusCircle className="h-4 w-4" />
  </Button>,
];

interface TenderDetailsDataTableProps {
  data: TenderDetails[];
  handleValueChange: (
    value: TenderDetails,
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

export function TenderDetailsDataTable({
  data,
  handleValueChange,
  colors,
  clarities,
  fluorescences,
  totalValues,
  setTotalValues,
  shapes,
  lotNo,
}: TenderDetailsDataTableProps) {
  useEffect(() => {
    const totals = data.reduce(
      (acc, row) => ({
        pcs: acc.pcs + (row.pcs || 0),
        carats: acc.carats + (row.carats || 0),
        polCts: acc.polCts + (row.polCts || 0),
        polPercent: acc.polPercent + (row.polPercent || 0),
        salePrice: acc.salePrice + (row.salePrice || 0),
        costPrice: acc.costPrice + (row.costPrice || 0),
        topsAmount: acc.topsAmount + (row.topsAmount || 0),
      }),
      {
        pcs: 0,
        carats: 0,
        polCts: 0,
        polPercent: 0,
        salePrice: 0,
        costPrice: 0,
        topsAmount: 0,
      }
    );

    setTotalValues(totals);
  }, [data, setTotalValues]);

  return (
    <>
      <div className="rounded-md flex-1 flex flex-col min-h-0 h-[25svh]">
        <div className="overflow-x-auto w-auto">
          <Table className="bg-white mb-14 ">
            <TableHeader className="sticky top-0 z-40 bg-white border-b">
              <TableRow>
                {columns.map((header, index) => {
                  if (index === columns.length - 1) {
                    return (
                      <TableHead
                        onClick={() =>
                          handleValueChange(initialRow, data.length + 1)
                        }
                        className="border-collapse border border-gray-300"
                        key={index}
                      >
                        {header}
                      </TableHead>
                    );
                  }
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
              {data.length > 0 ? (
                data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="border-collapse border border-gray-300">
                      {lotNo}
                    </TableCell>
                    <TableCell className="border-collapse border border-gray-300">
                      <Input
                        className="w-20"
                        name="pcs"
                        type="number"
                        value={row.pcs || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
                              pcs: value,
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
                        name="carats"
                        type="number"
                        value={row.carats || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
                              carats: value,
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
                        className="w-20"
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
                        className="w-20"
                        name="polCts"
                        type="number"
                        value={row.polCts || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
                              polCts: value,
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
                        name="polPercent"
                        type="number"
                        value={row.polPercent || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
                              polPercent: value,
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
                        className="w-20"
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
                        className="w-20"
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
                        className="w-20"
                        name="labour"
                        type="number"
                        value={row.labour || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
                              labour: value,
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
                        name="salePrice"
                        type="number"
                        value={row.salePrice || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
                              salePrice: value,
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
                        name="saleAmount"
                        type="number"
                        value={row.saleAmount || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
                              saleAmount: value,
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
                        name="costPrice"
                        type="number"
                        value={row.costPrice || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
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
                        className="w-20"
                        name="costAmount"
                        type="number"
                        value={row.costAmount || ""}
                        step={0.01}
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          handleValueChange(
                            {
                              ...row,
                              costAmount: value,
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
