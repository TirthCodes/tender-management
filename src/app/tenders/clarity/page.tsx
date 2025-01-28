import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { prisma } from "@/lib/prisma";
import { ClarityForm } from "@/components/clarity-form";

export default async function ClarityPage() {
  const clarity = await prisma.clarity.findMany();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clarity</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-semibold">+ Create</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Clarity</DialogTitle>
              {/* <DialogDescription>
                Create a new color for the application.
              </DialogDescription> */}
            </DialogHeader>
            <ClarityForm />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={clarity} />
    </div>
  );
}
