"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  getClarityOptions,
  getColorOptions,
  getFluorescenceOptions,
  getShapeOptions,
} from "@/services/options";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import {
  TenderDetailsDataTable,
} from "./tender-details-data-table";
import { Option } from "@/lib/types/common";
import { CostDetails, TenderDetails, TotalValues } from "@/lib/types/tender";

export const initialRow = {
  pcs: 0,
  carats: 0,
  color: { id: 0, stShortName: "" },
  colorGrade: 0,
  clarity: { id: 0, stShortName: "" },
  flr: { id: 0, stShortName: "" },
  shape: { id: 0, stShortName: "" },
  polCts: 0,
  polPercent: 0,
  depth: 0,
  table: 0,
  ratio: 0,
  labour: 0,
  salePrice: 0,
  saleAmount: 0,
  costPrice: 0,
  costAmount: 0,
  topsAmount: 0,
  incription: "",
};

const initialTenderDetails = [initialRow];

interface CreateTenderFormProps {
  colorOptions: Option[];
  clarityOptions: Option[];
  fluorescenceOptions: Option[];
  shapeOptions: Option[];
}

const createTenderSchema = z.object({
  voucherDate: z.string(),
  tenderType: z.string(),
  tenderName: z.string().trim().min(2, { message: "Tender name is required!" }),
  notePercent: z.string().trim().min(2, { message: "Note % is required!" }),
  remark: z.string().trim().optional(),
  lotNo: z.string().trim().min(1, { message: "Lot no.is required!" }),
  roughName: z.string().trim().min(2, { message: "Rough name is required!" }),
  roughPcs: z.string().trim().min(1, { message: "Rough pcs is required!" }),
  roughCts: z.string().trim().min(1, { message: "Rough cts is required!" }),
  roughSize: z.string().trim().min(1, { message: "Rough size is required!" }),
  roughPrice: z.string().trim().min(1, { message: "Rough price is required!" }),
  roughTotal: z.string().trim().min(1, { message: "Rough total is required!" }),
  bidPrice: z.string().trim().min(1, { message: "Bid price is required!" }),
  totalAmount: z
    .string()
    .trim()
    .min(1, { message: "Total amount is required!" }),
  resultCost: z.string().trim().min(1, { message: "Result cost is required!" }),
  resultPerCarat: z
    .string()
    .trim()
    .min(1, { message: "Result per carat is required!" }),
  resultTotal: z
    .string()
    .trim()
    .min(1, { message: "Result total is required!" }),
  finalCostPrice: z
    .string()
    .trim()
    .min(1, { message: "Final cost price is required!" }),
  finalBidPrice: z
    .string()
    .trim()
    .min(1, { message: "Final bid price is required!" }),
  finalTotalAmount: z
    .string()
    .trim()
    .min(1, { message: "Final total amount is required!" }),
});

type CreateTenderFormValues = z.infer<typeof createTenderSchema>;

export function CreateTenderForm({
  colorOptions,
  clarityOptions,
  fluorescenceOptions,
  shapeOptions,
}: CreateTenderFormProps) {
  const { data: colorsOptions } = useQuery({
    queryKey: ["color-options"],
    queryFn: getColorOptions,
    initialData: colorOptions,
  });

  const { data: claritiesOptions } = useQuery({
    queryKey: ["clarity-options"],
    queryFn: getClarityOptions,
    initialData: clarityOptions,
  });

  const { data: fluorescencesOptions } = useQuery({
    queryKey: ["fluorescence-options"],
    queryFn: getFluorescenceOptions,
    initialData: fluorescenceOptions,
  });

  const { data: shapesOptions } = useQuery({
    queryKey: ["shape-options"],
    queryFn: getShapeOptions,
    initialData: shapeOptions,
  });

  const [tenderDetails, setTenderDetails] = useState<TenderDetails[]>(initialTenderDetails);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [totalValues, setTotalValues] = useState<TotalValues>({
    pcs: 0,
    carats: 0,
    polCts: 0,
    polPercent: 0,
    salePrice: 0,
    costPrice: 0,
  }); 

  useEffect(() => {
    if (date) {
      setValue("voucherDate", date.toLocaleDateString());
      if (errors.voucherDate) {
        setError("voucherDate", {
          message: undefined,
        });
      }
    }
  }, [date]);

  const {
    register,
    handleSubmit,
    watch,
    // reset,
    formState: { errors },
    setValue,
    setError,
  } = useForm<CreateTenderFormValues>({
    mode: "onBlur",
    resolver: zodResolver(createTenderSchema),
  });

  useEffect(() => {
    if(tenderDetails.length > 0) {
      // const calculatedBidPrice = parseFloat(
      //   (
      //     (((row.costPrice + row.topsAmount) * 0.97 - 180) * row.polCts) /
      //       row.carats -
      //     50 / (notePercent / 100)
      //   ).toFixed(2)
      // );
    }
  }, [tenderDetails])

  const handleDetailsValueChange = (
    value: TenderDetails,
    index: number,
    action?: string
  ) => {
    if (action === "delete") {
      setTenderDetails(tenderDetails.filter((_i, idx) => idx !== index));
      return;
    }
    if (index > tenderDetails.length) {
      setTenderDetails([...tenderDetails, value]);
      return;
    }
    const indexToUpdate = tenderDetails.findIndex((_i, idx) => idx === index);
    setTenderDetails(
      tenderDetails.map((item, i) => {
        if (i === indexToUpdate) {
          return value;
        }
        return item;
      })
    );
  };

  async function onSubmit(data: CreateTenderFormValues) {
    console.log(data, "data");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tender Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex w-full items-center">
                <Label className="w-[100px] shrink-0">Voucher Date</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        `${
                          errors.voucherDate?.message && "border border-red-500"
                        }`
                      )}
                    >
                      <CalendarIcon
                        className={`${
                          errors.voucherDate?.message && "text-red-500"
                        }`}
                      />
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span
                          className={`${
                            errors.voucherDate?.message && "text-red-500"
                          }`}
                        >
                          Pick a date
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate);
                        setCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex w-full items-center">
                <Label className="w-[94px] shrink-0">Tender Type</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("tenderType", value);
                    if (errors.tenderType) {
                      setError("tenderType", {
                        message: undefined,
                      });
                    }
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      errors.tenderType?.message &&
                        "border border-red-500 text-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="singleStone">Single Stone</SelectItem>
                      <SelectItem value="roughLot">Rough Lot</SelectItem>
                      <SelectItem value="mixLot">Mix Lot</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-full items-center">
                <Label className="w-[100px] shrink-0">Tender Name</Label>
                <Input
                  type="text"
                  {...register("tenderName")}
                  className={cn(
                    errors.tenderName?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                  placeholder="Single Stone Tender"
                />
              </div>
              <div className="flex w-full items-center justify-between">
                <Label className="w-[94px] shrink-0">Note %</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("notePercent")}
                  className={cn(
                    errors.notePercent?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                  placeholder="106"
                />
              </div>
              <div className="col-span-full">
                <div className="flex w-full items-center">
                  <Label className="w-[100px] shrink-0">Remark</Label>
                  <Input
                    type="text"
                    {...register("remark")}
                    className={cn(
                      "w-full",
                      errors.remark?.message && "border border-red-500"
                    )}
                    placeholder="MIX SAWABLE-MAKEABLE YELLOW (AVG - 1.83)"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rough Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-x-3 gap-y-4">
              <div className="flex w-full items-center col-span-2">
                <Label className="w-[88px] shrink-0">Lot No.</Label>
                <Input
                  type="text"
                  {...register("lotNo")}
                  placeholder="FS39"
                  className={cn(
                    errors.lotNo?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                />
              </div>
              <div className="flex w-full items-center col-span-2">
                <Label className="w-[94px] shrink-0">Rough Name</Label>
                <Input
                  type="text"
                  {...register("roughName")}
                  placeholder="Name"
                  className={cn(
                    errors.roughName?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                />
              </div>
              <div className="flex w-full items-center col-span-2">
                <Label className="w-[84px] shrink-0">Rough Pcs.</Label>
                <Input
                  type="number"
                  {...register("roughPcs")}
                  placeholder="4"
                  className={cn(
                    errors.roughPcs?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                />
              </div>
              <div className="flex w-full items-center col-span-3">
                <Label className="w-[88px] shrink-0">Rough Cts.</Label>
                <Input
                  type="number"
                  {...register("roughCts")}
                  placeholder="24.4"
                  className={cn(
                    errors.roughCts?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                />
              </div>
              <div className="flex w-full items-center col-span-3">
                <Label className="w-[88px] shrink-0">Rough Size</Label>
                <Input
                  {...register("roughSize")}
                  type="number"
                  placeholder="4.96"
                  className={cn(
                    errors.roughSize?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                />
              </div>
              <div className="flex w-full items-center col-span-3">
                <Label className="w-[88px] shrink-0">Rough Price</Label>
                <Input
                  {...register("roughPrice")}
                  type="number"
                  placeholder="243"
                  className={cn(
                    errors.roughPrice?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                />
              </div>

              <div className="flex w-full items-center col-span-3">
                <Label className="w-[88px] shrink-0">Rough Total</Label>
                <Input
                  {...register("roughTotal")}
                  type="number"
                  placeholder="999"
                  className={cn(
                    errors.roughTotal?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border">
        <TenderDetailsDataTable
          lotNo={watch("lotNo")}
          totalValues={totalValues}
          setTotalValues={setTotalValues}
          notePercent={parseInt(watch("notePercent"))}
          handleValueChange={handleDetailsValueChange}
          data={tenderDetails}
          colors={colorsOptions}
          clarities={claritiesOptions}
          fluorescences={fluorescencesOptions}
          shapes={shapesOptions}
        />
      </div>

      <div className="grid grid-cols-1 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Cost Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-32">Bid Price</Label>
                  <Input
                    type="number"
                    {...register("bidPrice")}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-32">Total Amount</Label>

                  <Input
                    type="number"
                    {...register("totalAmount")}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-32">Result Cost</Label>
                  <Input
                    type="number"
                    {...register("resultCost")}
                    disabled
                    readOnly
                  />
                </div>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-32">Result / Cts</Label>
                  <Input
                    type="number"
                    {...register("resultPerCarat")}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-32">Result Total</Label>
                  <Input
                    type="number"
                    {...register("resultTotal")}
                    placeholder="10000"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-52">Final Cost Price</Label>
                  <Input
                    type="number"
                    {...register("finalCostPrice")}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-52">Final Bid Price</Label>
                  <Input
                    type="number"
                    {...register("finalBidPrice")}
                    placeholder="20000"
                  />
                </div>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-52">Final Total Amount</Label>
                  <Input
                    type="number"
                    {...register("finalTotalAmount")}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end">
        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
}
