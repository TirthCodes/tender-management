"use client";

import React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface DialogWrapperProps {
  contentClass?: string;
  children: React.ReactNode;
  title: string;
  isEdit?: boolean;
}

export default function DialogWrapper({
  contentClass,
  children,
  title,
  isEdit,
}: DialogWrapperProps) {
  return (
    <DialogContent className={contentClass ? contentClass : "z-[100]"}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {isEdit ? "Edit " : "Create a new "}
          {title.toLowerCase()}. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>
      {children}
    </DialogContent>
  );
}
