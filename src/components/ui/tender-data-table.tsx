"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Pencil, Trash } from "lucide-react";
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
}: DataTableProps<TData>) {
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
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
                    <TableHead key={header.id} style={(header.column.columnDef.meta as any)?.style}>
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
                    <TableCell key={cell.id} style={(cell.column.columnDef.meta as any)?.style}>
                      {cell.column.id === "actions" ? (
                        <div className="flex items-center gap-2 w-fit">
                          <Button
                            variant={"outline"}
                            className="text-blue-600 bg-blue-50 p-2 h-fit shadow-sm border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700"
                            onClick={() => {
                              if (isDialog) {
                                setEditDialogOpen?.(true);
                                setEditData?.(row.original);
                              } else if (editPath) {
                                if(editPath.includes("?")) {
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
                            className="text-red-600 bg-red-50 p-2 h-fit shadow-sm border-red-200 hover:bg-red-100 hover:border-red-300 hover:text-red-700"
                            onClick={() => handleDelete(row.original?.id)}
                            disabled={
                              isPending && deletingId === row.original?.id
                            }
                          >
                            {isPending && deletingId === row.original?.id ? <Loader2  className="animate-spin" /> : <Trash />} 
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
