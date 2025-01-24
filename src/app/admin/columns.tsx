"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@prisma/client";

export const columns: ColumnDef<Pick<User, "username" | "role">>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];
