import React from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { TenderColumns } from "@/app/(protected)/tenders/columns";

export function PageHeader({
  title,
  setDialogOpen,
  editPath,
  setEditData
}: {
  title: string;
  setDialogOpen?: (value: boolean) => void;
  editPath?: string;
  setEditData?: (value: TenderColumns | null) => void;
}) {

  const router = useRouter();

  const handleCreate = () => {
    if(editPath) {
      router.push(editPath);
    } else {
      setEditData?.(null);
      setDialogOpen?.(true);
    }
  }

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button className="rounded-sm" onClick={handleCreate}>
        Create <PlusCircle />{" "}
      </Button>
    </div>
  );
}
