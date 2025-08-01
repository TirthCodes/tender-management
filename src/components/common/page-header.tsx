import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function PageHeader({
  title,
  handleDialog,
  createPath,
  isBackButton = true,
}: {
  title: string;
  handleDialog?: () => void;
  createPath?: string;
  isBackButton?: boolean;
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
      <div className="flex items-center gap-2">
        {isBackButton && (
          <Button variant={"ghost"} size="icon" className="rounded-full border" onClick={() => router.back()}>
            <ArrowLeft />
          </Button>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <Button className="rounded-sm" onClick={handleCreate}>
        Create <PlusCircle />{" "}
      </Button>
    </div>
  );
}
