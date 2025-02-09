import React from 'react'
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColorForm } from "@/components/color-form";

export default function MainLotPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Colors</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-semibold">+ Create</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Color</DialogTitle>
              {/* <DialogDescription>
                Create a new color for the application.
              </DialogDescription> */}
            </DialogHeader>
            <ColorForm />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={colors} />
    </div>
  )
}
