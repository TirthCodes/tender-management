"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export type SummaryConfig<TData> = {
  [key: string]: {
    type: 'sum' | 'count' | 'average' | 'custom';
    accessor: keyof TData | ((data: TData[]) => number);
    label?: string;
    format?: (value: number) => string;
  }
};

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Pencil, Printer, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { deleteFn } from "@/services/delete";
import { toast } from "react-toastify";
import { invalidateQuery } from "@/lib/invalidate";
import useEffectAfterMount from "@/hooks/useEffectAfterMount";

interface DataTableProps<TData extends { id?: number }> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  setEditDialogOpen?: (open: boolean) => void;
  setEditData?: (data: TData) => void;
  isDialog: boolean;
  editPath?: string;
  deleteEndpoint?: string;
  queryKey: string;
  isPdf?: boolean;
  handlePdf?: (id: number) => void;
  loadingPdf?: boolean;
  summaryConfig?: SummaryConfig<TData>;
  showSummary?: boolean;
  totals?: Record<string, number | string>;
}

export function TenderDataTable<TData extends { id?: number }>({
  data,
  columns,
  setEditDialogOpen,
  setEditData,
  isDialog,
  editPath,
  deleteEndpoint,
  queryKey,
  isPdf,
  handlePdf,
  loadingPdf,
  summaryConfig,
  showSummary = false,
  totals,
}: DataTableProps<TData>) {
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [pdfId, setPdfId] = React.useState<number | null>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const router = useRouter();

  const {
    mutate: deleteData,
    isPending,
    data: deleteResponse,
  } = useMutation({
    mutationFn: (id: number) => deleteFn(`/api/${deleteEndpoint}/${id}`),
  });

  useEffectAfterMount(() => {
    if (deleteResponse) {
      if (deleteResponse?.success) {
        toast.success(deleteResponse.message);
        invalidateQuery(queryKey);
        setDeletingId(null);
      } else {
        toast.error(deleteResponse.error || deleteResponse.message);
        setDeletingId(null);
      }
    }
  }, [deleteResponse]);

  const handleDelete = async (id?: number) => {
    if (deleteEndpoint && id) {
      setDeletingId(id);
      deleteData(id);
    }
  };

  const calculateSummaryValue = (config: SummaryConfig<TData>[string], data: TData[]): number => {
    if (typeof config.accessor === 'function') {
      return config.accessor(data);
    }

    const values = data
      .map((item) => {
        const value = item[config.accessor as keyof TData];
        return typeof value === 'number' ? value : 0;
      })
      .filter((value) => !isNaN(value));

    switch (config.type) {
      case 'sum':
        return values.reduce((sum: number, value: number) => sum + value, 0);
      case 'count':
        return values.length;
      case 'average':
        return values.length > 0 ? values.reduce((sum: number, value: number) => sum + value, 0) / values.length : 0;
      default:
        return 0;
    }
  };

  const renderSummaryRow = () => {
    if (!showSummary || (!summaryConfig && !totals)) return null;

    return (
      <TableRow className="bg-neutral-100 font-medium border-t-2 sticky bottom-0">
        {columns.map((column, index) => {
          const columnId = column.id || (column as any).accessorKey;
          const summaryItem = summaryConfig?.[columnId];

          if (index === 0) {
            return (
              <TableCell key={columnId || index} className="text-neutral-700 font-semibold">
                Total
              </TableCell>
            );
          }

          // Use totals if provided, otherwise fall back to summaryConfig
          if (totals && totals[columnId]) {
            const value = totals[columnId];
            const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

            return (
              <TableCell key={columnId || index} className="text-neutral-700 font-semibold">
                {formattedValue}
              </TableCell>
            );
          }

          if (summaryItem) {
            const value = calculateSummaryValue(summaryItem, data);
            const formattedValue = summaryItem.format ? summaryItem.format(value) : value.toLocaleString();

            return (
              <TableCell key={columnId || index} className="text-neutral-700 font-semibold">
                {formattedValue}
              </TableCell>
            );
          }

          return <TableCell key={columnId || index}></TableCell>;
        })}
      </TableRow>
    );
  };

  return (
    <div className="w-full pt-4">
      <div className="rounded-sm bg-neutral-50 border border-neutral-300">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="sticky ring-black top-0 z-10 border-b-2 text-nowrap bg-neutral-100 shadow-sm hover:bg-neutral-100"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={(header.column.columnDef.meta as any)?.style}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table?.getRowModel().rows?.length ? (
              table?.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={(cell.column.columnDef.meta as any)?.style}
                      className="text-neutral-800"
                    >
                      {cell.column.id === "actions" ? (
                        <div className="flex items-center gap-1.5 w-fit">
                          {isPdf && (
                            <Button
                              variant={"outline"}
                              className="text-neutral-600 bg-neutral-50 p-1.5 h-fit shadow-sm border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 hover:text-neutral-700 [&_svg]:size-3.5"
                              disabled={loadingPdf && pdfId === row.original?.id}
                              onClick={() => {
                                setPdfId(row.original?.id as number);
                                handlePdf?.(row.original?.id as number);
                              }}
                            >
                              {loadingPdf && pdfId === row.original?.id ? <Loader2 className="animate-spin" /> : <Printer />}
                            </Button>
                          )}
                          <Button
                            variant={"outline"}
                            className="text-blue-600 bg-blue-50 p-1.5 h-fit shadow-sm border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700 [&_svg]:size-3.5"
                            onClick={() => {
                              if (isDialog) {
                                setEditDialogOpen?.(true);
                                setEditData?.(row.original);
                              } else if (editPath) {
                                if (editPath.includes("?")) {
                                  router.push(
                                    `${editPath}&id=${row.original?.id}`
                                  );
                                } else {
                                  router.push(
                                    `${editPath}?id=${row.original?.id}`
                                  );
                                }
                              }
                            }}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant={"outline"}
                            className="text-red-600 bg-red-50 p-1.5 h-fit shadow-sm border-red-200 hover:bg-red-100 hover:border-red-300 hover:text-red-700 [&_svg]:size-3.5"
                            onClick={() => handleDelete(row.original?.id)}
                            disabled={
                              isPending && deletingId === row.original?.id
                            }
                          >
                            {isPending && deletingId === row.original?.id ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Trash />
                            )}
                          </Button>
                        </div>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns?.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
            {renderSummaryRow()}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
