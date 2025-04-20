import React from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

export function PageHeader({
  title,
  handleModal,
}: {
  title: string;
  handleModal: () => void;
}) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button className="rounded-sm" onClick={() => handleModal()}>
        Create <PlusCircle />{" "}
      </Button>
    </div>
  );
}
