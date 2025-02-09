"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteShape } from "./actions";
import { useState } from "react";
import { ShapeForm } from "@/components/shape-form";

export type Shape = {
  id: number;
  stName: string;
  stShortName: string;
  inSerial: number;
};

export const columns: ColumnDef<Shape>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "stName",
    header: "Name",
  },
  {
    accessorKey: "stShortName",
    header: "Short Name",
  },
  {
    accessorKey: "inSerial",
    header: "Serial",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <ShapeDialogForm initialData={row.original} />
        <Button
          variant="destructive"
          onClick={async () => {
            await deleteShape(row.original.id);
            window.location.reload();
          }}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

function ShapeDialogForm({ initialData }: { initialData?: Shape }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold">
          {initialData ? "Edit" : "Add New"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Shape" : "Create New Shape"}
          </DialogTitle>
          {/* <DialogDescription>
            Create a new color for the application.
          </DialogDescription> */}
        </DialogHeader>
        <ShapeForm initialData={initialData} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
