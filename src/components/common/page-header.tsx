import React from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function PageHeader({
  title,
  handleDialog,
  createPath,
}: {
  title: string;
  handleDialog?: () => void;
  createPath?: string;
}) {

  const router = useRouter();

  const handleCreate = () => {
    if(createPath) {
      router.push(createPath);
    } else {
      handleDialog?.();
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
