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
import React from "react";
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
  notePercent: number;
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

  const handleTotalValuesChange = (value: number, key: keyof TotalValues) => {
    setTotalValues({
      ...totalValues,
      [key]: totalValues[key] + value,
    });
  };

  return (
    <div className="rounded-md flex-1 flex flex-col min-h-0">
      <div className="overflow-x-auto w-auto">
        <Table className="bg-white mb-24">
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
                      value={row.pcs}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        handleTotalValuesChange(value, "pcs");
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
                      value={row.carats}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        handleTotalValuesChange(value, "carats");
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
                      handleValueChange={(value) =>
                        handleValueChange(
                          {
                            ...row,
                            color: value,
                          },
                          index
                        )
                      }
                      createDialogContent={<ColorDialog />}
                    />
                  </TableCell>
                  <TableCell className="border-collapse border border-gray-300">
                    <Input
                      className="w-20"
                      name="colorGrade"
                      type="number"
                      value={row.colorGrade}
                      onChange={(e) =>
                        handleValueChange(
                          {
                            ...row,
                            colorGrade: parseInt(e.target.value),
                          },
                          index
                        )
                      }
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell className="border-collapse border border-gray-300">
                    <AutoCompleteInput
                      data={clarities}
                      title="Clarity"
                      selectedValue={row.clarity}
                      widthClass="w-24"
                      handleValueChange={(value) =>
                        handleValueChange(
                          {
                            ...row,
                            clarity: value,
                          },
                          index
                        )
                      }
                      createDialogContent={<ClarityDialog />}
                    />
                  </TableCell>
                  <TableCell className="border-collapse border border-gray-300">
                    <AutoCompleteInput
                      data={fluorescences}
                      title="FLR"
                      selectedValue={row.flr}
                      widthClass="w-24"
                      handleValueChange={(value) =>
                        handleValueChange(
                          {
                            ...row,
                            flr: value,
                          },
                          index
                        )
                      }
                      createDialogContent={<FlrDialog />}
                    />
                  </TableCell>
                  <TableCell className="border-collapse border border-gray-300">
                    <AutoCompleteInput
                      data={shapes}
                      title="Shape"
                      selectedValue={row.shape}
                      widthClass="w-24"
                      handleValueChange={(value) =>
                        handleValueChange(
                          {
                            ...row,
                            shape: value,
                          },
                          index
                        )
                      }
                      createDialogContent={<ShapeDialog />}
                    />
                  </TableCell>
                  <TableCell className="border-collapse border border-gray-300">
                    <Input
                      className="w-20"
                      name="polCts"
                      type="number"
                      value={row.polCts}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        handleTotalValuesChange(value, "polCts");
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
                      value={row.polPercent}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        handleTotalValuesChange(value, "polPercent");
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
                      value={row.depth}
                      onChange={(e) =>
                        handleValueChange(
                          {
                            ...row,
                            depth: parseInt(e.target.value),
                          },
                          index
                        )
                      }
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell className="border-collapse border border-gray-300">
                    <Input
                      className="w-20"
                      name="table"
                      type="number"
                      value={row.table}
                      onChange={(e) =>
                        handleValueChange(
                          {
                            ...row,
                            table: parseInt(e.target.value),
                          },
                          index
                        )
                      }
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell className="border-collapse border border-gray-300">
                    <Input
                      className="w-20"
                      name="ratio"
                      type="number"
                      value={row.ratio}
                      onChange={(e) =>
                        handleValueChange(
                          {
                            ...row,
                            ratio: parseInt(e.target.value),
                          },
                          index
                        )
                      }
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell className="border-collapse border border-gray-300">
                    <Input
                      className="w-20"
                      name="labour"
                      type="number"
                      value={row.labour}
                      onChange={(e) =>
                        handleValueChange(
                          {
                            ...row,
                            labour: parseInt(e.target.value),
                          },
                          index
                        )
                      }
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell className="border-collapse border border-gray-300">
                    <Input
                      className="w-20"
                      name="salePrice"
                      type="number"
                      value={row.salePrice}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        handleTotalValuesChange(value, "salePrice");
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
                      value={row.saleAmount}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        // handleTotalValuesChange(value, "saleAmount");
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
                      value={row.costPrice}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        handleTotalValuesChange(value, "costPrice");
                        handleValueChange(
                          {
                            ...row,
                            costPrice: value,
                          },
                          index
                        )
                      }
                      }
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell className="border-collapse border border-gray-300">
                    <Input
                      className="w-20"
                      name="costAmount"
                      type="number"
                      value={row.costAmount}
                      onChange={(e) =>
                        handleValueChange(
                          {
                            ...row,
                            costAmount: parseInt(e.target.value),
                          },
                          index
                        )
                      }
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell className="border-collapse border border-gray-300">
                    <Input
                      className="w-20"
                      name="topsAmount"
                      type="number"
                      value={row.topsAmount}
                      onChange={(e) =>
                        handleValueChange(
                          {
                            ...row,
                            topsAmount: parseInt(e.target.value),
                          },
                          index
                        )
                      }
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell className="border-collapse border border-gray-300">
                    <Input
                      className="w-20"
                      name="incription"
                      type="text"
                      value={row.incription}
                      onChange={(e) =>
                        handleValueChange(
                          {
                            ...row,
                            incription: e.target.value,
                          },
                          index
                        )
                      }
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
      <div className="px-6 flex items-center gap-20 h-10 bg-gray-100">
        <p className="text-gray-600 text-sm font-semibold">Pcs: 0</p>
        <p className="text-gray-600 text-sm font-semibold">Cts: 0</p>
        <p className="text-gray-600 text-sm font-semibold">Pol Cts: 0</p>
        <p className="text-gray-600 text-sm font-semibold">Pol %: 0</p>
        <p className="text-gray-600 text-sm font-semibold">Sale Price: 0</p>
        <p className="text-gray-600 text-sm font-semibold">Cost Price: 0</p>
      </div>
    </div>
  );
}
