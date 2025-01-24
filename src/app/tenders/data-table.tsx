"use client";

import { getTenders } from "@/app/tenders/actions";

interface TenderTableProps {
  data: Awaited<ReturnType<typeof getTenders>>;
}

const columnHelper =
  createColumnHelper<Awaited<ReturnType<typeof getTenders>>[number]>();

const columns: ColumnDef<Awaited<ReturnType<typeof getTenders>>[number]>[] = [
  columnHelper.accessor("voucherNumber", { header: "Voucher Number" }),
  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("type", { header: "Type" }),
  columnHelper.accessor("notePercentage", { header: "Note Percentage" }),
  columnHelper.accessor("roughCts", { header: "Rough CTS" }),
  columnHelper.accessor("roughSize", { header: "Rough Size" }),
  columnHelper.accessor("pndCts", { header: "PnD CTS" }),
  columnHelper.accessor("roughPrice", { header: "Rough Price" }),
  columnHelper.accessor("roughTotal", { header: "Rough Total" }),
];

export default function TendersTable({ data }: TenderTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 text-sm text-gray-900">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
