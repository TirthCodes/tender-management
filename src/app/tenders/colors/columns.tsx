"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { deleteColor } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColorForm } from "@/components/color-form";
import { useState } from "react";

export type Color = {
  id: number;
  stName: string;
  stShortName: string;
  inSerial: number;
};

export const columns: ColumnDef<Color>[] = [
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
        <ColorDialogForm initialData={row.original} />
        <Button
          variant="destructive"
          onClick={async () => {
            await deleteColor(row.original.id);
            window.location.reload();
          }}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

function ColorDialogForm({ initialData }: { initialData?: Color }) {
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
            {initialData ? "Edit Color" : "Create New Color"}
          </DialogTitle>
          {/* <DialogDescription>
            Create a new color for the application.
          </DialogDescription> */}
        </DialogHeader>
        <ColorForm initialData={initialData} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
