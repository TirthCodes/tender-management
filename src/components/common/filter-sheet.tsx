"use client";

import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { FilterSheetContent } from "./filter-sheet-content";
import { Filter } from "lucide-react";

import React from "react";

export function FilterSheet() {
  const [filterSheetOpen, setFilterSheetOpen] = React.useState(false);

  return (
    <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant={"outline"}
          className="rounded-sm text-neutral-800 border-neutral-700 h-7 lg:h-9 px-2 lg:px-4"
        >
          Filter <Filter />
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[200] sm:max-w-xl" dir="left">
        <SheetHeader className="mb-2">
          <SheetTitle className="text-xl">Filters</SheetTitle>
          <SheetDescription className="sr-only">
            Filter by shape, color, clarity, fluorescence
          </SheetDescription>
        </SheetHeader>
        {filterSheetOpen && <FilterSheetContent setSheetClose={setFilterSheetOpen} />}
      </SheetContent>
    </Sheet>
  );
}
