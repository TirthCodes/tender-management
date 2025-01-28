"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { deleteFluorescence } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { FluorescenceForm } from "@/components/fluorescence-form";

export type Fluorescence = {
  id: number;
  stName: string;
  stShortName: string;
  inSerial: number;
};

export const columns: ColumnDef<Fluorescence>[] = [
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
        <FluorescenceDialogForm initialData={row.original} />
        <Button
          variant="destructive"
          onClick={async () => {
            await deleteFluorescence(row.original.id);
            window.location.reload();
          }}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

function FluorescenceDialogForm({
  initialData,
}: {
  initialData?: Fluorescence;
}) {
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
            {initialData ? "Edit Fluorescence" : "Create New Fluorescence"}
          </DialogTitle>
          {/* <DialogDescription>
            Create a new color for the application.
          </DialogDescription> */}
        </DialogHeader>
        <FluorescenceForm
          initialData={initialData}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
