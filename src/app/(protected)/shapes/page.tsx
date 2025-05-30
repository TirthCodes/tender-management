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
import { ShapeForm } from "@/components/forms/shape-form";
import { PlusCircle } from "lucide-react";

export default async function ShapesPage() {
  const shapes = await prisma.shape.findMany();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Shapes</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-semibold"><PlusCircle /> Create</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Shape</DialogTitle>
            </DialogHeader>
            <ShapeForm />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={shapes} />
    </div>
  );
}
