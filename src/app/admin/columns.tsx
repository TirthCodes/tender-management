"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { deleteUser } from "./actions";

export type User = {
  id: number;
  username: string;
  role: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href={`/admin/users/${row.original.id}/edit`}>Edit</Link>
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={async () => {
            await deleteUser(row.original.id);
            window.location.reload();
          }}
        >
          Delete
        </Button>
      </div>
    ),
  },
];
