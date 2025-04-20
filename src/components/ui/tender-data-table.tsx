"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
// import { useMutation } from "@tanstack/react-query";
// import { deleteFn } from "@/services/delete";
// import useEffectAfterMount from "@/hooks/useEffectAfterMount";
// import toast from "react-toastify";
// import { invalidateQuery } from "@/lib/invalidate";

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
  // deleteEndpoint,
  // queryKey,
}: DataTableProps<TData>) {
  // const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const router = useRouter();

  // const {
  //   mutate: deleteData,
  //   isPending,
  //   data: deleteResponse,
  // } = useMutation({
  //   mutationFn: (id: string) => deleteFn(`${deleteEndpoint}/${id}`),
  // });

  // useEffectAfterMount(() => {
  //   if (deleteResponse) {
  //     if (deleteResponse?.success) {
  //       toast.success(deleteResponse.message);
  //       invalidateQuery(queryKey);
  //       setDeletingId(null);
  //     } else {
  //       toast.error(deleteResponse.error || deleteResponse.message);
  //       setDeletingId(null);
  //     }
  //   }
  // }, [deleteResponse]);

  // const handleDelete = async (id?: string) => {
  //   if (deleteEndpoint && id) {
  //     setDeletingId(id);
  //     // deleteData(id);
  //   }
  // };

  return (
    <div className="w-full pt-4">
      <div className="rounded-sm bg-neutral-50 border border-neutral-300">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="sticky ring-black top-0 z-10 border-b-2 bg-neutral-100 shadow-sm hover:bg-neutral-100">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                    <TableCell key={cell.id}>
                      {cell.column.id === "actions" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            // variant={"outline"}
                            onClick={() => {
                              if (isDialog) {
                                setEditDialogOpen?.(true);
                                setEditData?.(row.original);
                              } else if (editPath) {
                                router.push(
                                  `${editPath}?id=${row.original?.id}`
                                );
                              }
                            }}
                          >
                            <Pencil /> Edit
                          </Button>
                          {/* <Button
                            onClick={() => handleDelete(row.original?.id)}
                            disabled={
                              isPending && deletingId === row.original?.id
                            }
                          >
                            <Trash /> Delete
                          </Button> */}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
