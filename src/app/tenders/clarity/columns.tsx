"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { deleteClarity } from "./actions";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClarityForm } from "@/components/clarity-form";

export type Clarity = {
  id: number;
  stName: string;
  stShortName: string;
  inSerial: number;
};

export const columns: ColumnDef<Clarity>[] = [
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
        <ClarityDialogForm initialData={row.original} />
        <Button
          variant="destructive"
          onClick={async () => {
            await deleteClarity(row.original.id);
            window.location.reload();
          }}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

function ClarityDialogForm({ initialData }: { initialData?: Clarity }) {
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
            {initialData ? "Edit Clarity" : "Create New Clarity"}
          </DialogTitle>
          {/* <DialogDescription>
            Create a new color for the application.
          </DialogDescription> */}
        </DialogHeader>
        <ClarityForm
          initialData={initialData}
          closeDialog={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
