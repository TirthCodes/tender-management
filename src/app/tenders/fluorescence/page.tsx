import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { prisma } from "@/lib/prisma";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FluorescenceForm } from "@/components/fluorescence-form";

export default async function FluorescencePage() {
  const fluorescence = await prisma.fluorescence.findMany();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fluorescence</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-semibold">+ Create</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Fluorenscence</DialogTitle>
              {/* <DialogDescription>
                Create a new color for the application.
              </DialogDescription> */}
            </DialogHeader>
            <FluorescenceForm />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={fluorescence} />
    </div>
  );
}
