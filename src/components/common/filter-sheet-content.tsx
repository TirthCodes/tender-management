"use client";

import {
  getColorOptions,
  getClarityOptions,
  getFluorescenceOptions,
  getShapeOptions,
} from "@/services/options";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Option } from "@/lib/types/common";
import { getAllTenderFiltered } from "@/services/base-tender";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export function FilterSheetContent({ setSheetClose }: { setSheetClose: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { data: colorsOptions } = useQuery({
    queryKey: ["color-options"],
    queryFn: getColorOptions,
  });

  const { data: claritiesOptions } = useQuery({
    queryKey: ["clarity-options"],
    queryFn: getClarityOptions,
  });

  const { data: fluorescencesOptions } = useQuery({
    queryKey: ["fluorescence-options"],
    queryFn: getFluorescenceOptions,
  });

  const { data: shapesOptions } = useQuery({
    queryKey: ["shape-options"],
    queryFn: getShapeOptions,
  });

  const [selectedFilters, setSelectedFilters] = useState({
    shapes: [] as number[],
    colors: [] as number[],
    clarities: [] as number[],
    fluorescences: [] as number[],
    remark: {
      tenderRemark: "",
      lotRemark: "",
    },
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: getAllTenderFiltered,
    onSuccess: (data) => {
      if(data.success) {
        if(data.data) {
          localStorage.setItem("base-tender-filters", JSON.stringify(data.data));
        }
        setSheetClose(false);
        router.push("/filter-results");
      }
    },
    onError: (error) => {
      console.log(error, "error");
    },
  });

  const handleFilterSelection = (value: number, filterType: string) => {
    const selectedShapes = selectedFilters.shapes;
    const selectedColors = selectedFilters.colors;
    const selectedClarities = selectedFilters.clarities;
    const selectedFluorescences = selectedFilters.fluorescences;

    let selected = selectedShapes;
    if (filterType === "shapes") {
      selected = selectedShapes;
    } else if (filterType === "colors") {
      selected = selectedColors;
    } else if (filterType === "clarities") {
      selected = selectedClarities;
    } else if (filterType === "fluorescences") {
      selected = selectedFluorescences;
    }

    if (selected.includes(value)) {
      selected.splice(selected.indexOf(value), 1);
    } else {
      selected.push(value);
    }

    setSelectedFilters({
      ...selectedFilters,
      [filterType]: selected.filter(Boolean),
    });
  };

  const filterByRemarkDisabled =
    selectedFilters.shapes.length > 0 ||
    selectedFilters.colors.length > 0 ||
    selectedFilters.clarities.length > 0 ||
    selectedFilters.fluorescences.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="h-full overflow-y-auto">
        <Accordion
          defaultValue="shape"
          className="w-full"
          type="single"
          collapsible
        >
          <AccordionItem value="shape">
            <AccordionTrigger className="text-neutral-800 focus:outline-none cursor-pointer md:text-lg">
              Shape
            </AccordionTrigger>
            <AccordionContent>
              {/* <div className="flex flex-row gap-2 justify-start flex-wrap w-full"> */}
              <div className="grid grid-cols-3 gap-2 w-full">
                {shapesOptions?.data?.map((shape: Option) => (
                  <button
                    onClick={() => handleFilterSelection(shape.id, "shapes")}
                    key={shape.id}
                    className={`cursor-pointer px-2 py-1 border
                      ${
                        selectedFilters.shapes.includes(shape.id)
                          ? "bg-neutral-50 border-neutral-400"
                          : ""
                      }
                    `}
                  >
                    {shape.stName}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="color">
            <AccordionTrigger className="text-neutral-800 focus:outline-none cursor-pointer md:text-lg">
              Color
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-3 gap-2 w-full">
                {colorsOptions?.data?.map((color: Option) => (
                  <button
                    onClick={() => handleFilterSelection(color.id, "colors")}
                    key={color.id}
                    className={`cursor-pointer border px-2 py-1
                      ${
                        selectedFilters.colors.includes(color.id)
                          ? "bg-neutral-50 border-neutral-400"
                          : ""
                      }
                    `}
                  >
                    {color.stName}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="clarity">
            <AccordionTrigger className="text-neutral-800 focus:outline-none cursor-pointer md:text-lg">
              Clarity
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-4 gap-2 w-full">
                {claritiesOptions?.data?.map((clarity: Option) => (
                  <button
                    onClick={() =>
                      handleFilterSelection(clarity.id, "clarities")
                    }
                    key={clarity.id}
                    className={`cursor-pointer border px-2 py-1
                      ${
                        selectedFilters.clarities.includes(clarity.id)
                          ? "bg-neutral-50 border-neutral-400"
                          : ""
                      }  
                    `}
                  >
                    {clarity.stName}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="fluorescences">
            <AccordionTrigger className="text-neutral-800 focus:outline-none cursor-pointer md:text-lg">
              Fluorescences
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-4 gap-2 w-full">
                {fluorescencesOptions?.data?.map((flr: Option) => (
                  <button
                    onClick={() =>
                      handleFilterSelection(flr.id, "fluorescences")
                    }
                    key={flr.id}
                    className={`cursor-pointer border px-2 py-1
                      ${
                        selectedFilters.fluorescences.includes(flr.id)
                          ? "bg-neutral-50 border-neutral-400"
                          : ""
                      }  
                    `}
                  >
                    {flr.stName}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="remark"
            disabled={filterByRemarkDisabled}
            className={`${filterByRemarkDisabled && "opacity-50"}`}
          >
            <AccordionTrigger
              className={`text-neutral-800 focus:outline-none cursor-pointer md:text-lg ${
                filterByRemarkDisabled && "cursor-not-allowed"
              }`}
            >
              Remark
            </AccordionTrigger>
            <AccordionContent>
              <div className="mb-4 rounded-xs px-3 py-1.5 md:pb-1.5 md:pt-2.5 shadow-sm ring-1 ring-inset ring-neutral-300 focus-within:ring-2 focus-within:ring-neutral-600">
                <label className="block text-xs font-semibold text-neutral-900">
                  Tender Remark
                </label>
                <input
                  value={selectedFilters.remark.tenderRemark}
                  onChange={(e) => {
                    setSelectedFilters({
                      ...selectedFilters,
                      remark: {
                        ...selectedFilters.remark,
                        tenderRemark: e.target.value,
                      },
                    });
                  }}
                  placeholder="Search by tender remark"
                  className="block w-full border-0 p-0 text-neutral-900 placeholder:text-neutral-400 focus:ring-0 focus:outline-none text-sm sm:text-sm/6"
                />
              </div>
              <div className="rounded-xs px-3 py-1.5 md:pb-1.5 md:pt-2.5 shadow-sm ring-1 ring-inset ring-neutral-300 focus-within:ring-2 focus-within:ring-neutral-600">
                <label className="block text-xs font-semibold text-neutral-900">
                  Lot Remark
                </label>
                <input
                  value={selectedFilters.remark.lotRemark}
                  onChange={(e) => {
                    setSelectedFilters({
                      ...selectedFilters,
                      remark: {
                        ...selectedFilters.remark,
                        lotRemark: e.target.value,
                      },
                    });
                  }}
                  placeholder="Search by tender remark"
                  className="block w-full border-0 p-0 text-neutral-900 placeholder:text-neutral-400 focus:ring-0 focus:outline-none text-sm sm:text-sm/6"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="mt-auto w-full flex items-center gap-4 justify-between pb-8">
        <button
          onClick={() =>
            setSelectedFilters({
              shapes: [],
              colors: [],
              clarities: [],
              fluorescences: [],
              remark: {
                tenderRemark: "",
                lotRemark: "",
              },
            })
          }
          className="cursor-pointer text-base w-full border border-black px-6 py-2"
        >
          Reset
        </button>
        <button
          className="cursor-pointer text-base bg-black flex items-center justify-center w-full text-white border px-6 py-2"
          onClick={() => {
            if (
              !filterByRemarkDisabled &&
              selectedFilters.remark.tenderRemark === "" &&
              selectedFilters.remark.lotRemark === ""
            ) {
              toast.warning("Please select at least one filter");
              return;
            }
            mutate(selectedFilters);
          }}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Apply"}
        </button>
      </div>
    </div>
  );
}