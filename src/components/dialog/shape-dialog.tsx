import React from "react";
import DialogWrapper from "./dialog-wrapper";
import { ShapeForm } from "../shape-form";

export default function ShapeDialog() {
  return (
    <DialogWrapper title="Shape" isEdit={false}>
      <ShapeForm />
    </DialogWrapper>
  );
}
