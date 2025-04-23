import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FormDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: "Edit" | "Add";
  title: string;
  widthClass?: string;
  children: React.ReactNode;
};

export function FormDialog({
  open,
  setOpen,
  action,
  title,
  widthClass,
  children,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={`bg-neutral-50 overflow-y-auto max-sm:h-[90%] w-[90%] max-w-[90%] ${
          widthClass ? widthClass : "md:max-w-[50dvw] md:w-[50dvw]"
        }`}
      >
        <DialogTitle className="sr-only">
          {action} {title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Form dialog for {action} {title}
        </DialogDescription>
        <DialogHeader className="text-lg font-semibold text-neutral-900 flex items-start">
          {action} {title}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
