"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
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
import { Option } from "@/lib/types/common";
import { TenderDetails, TotalValues } from "@/lib/types/tender";
// import { createTender } from "@/services/tender";
// import { toast } from "react-toastify";
// import { redirect } from "next/navigation";
import Link from "next/link";
import { TenderDetailsDataTable } from "../pages/create-tender/tender-details-data-table";

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
  personName: z.string().trim().min(2, { message: "Person name is required!" }),
  netPercent: z.string().trim().min(2, { message: "Note % is required!" }),
  labour: z.string().trim().min(1, { message: "Labour is required!" }),
  remark: z.string().trim().optional(),
  lotNo: z.string().trim().min(1, { message: "Lot no.is required!" }),
  roughName: z.string().trim().min(2, { message: "Rough name is required!" }),
  roughPcs: z.string().trim().min(1, { message: "Rough pcs is required!" }),
  roughCts: z.string().trim().min(1, { message: "Rough cts is required!" }),
  roughSize: z.string().trim().min(1, { message: "Rough size is required!" }),
  roughPrice: z.string().trim().min(1, { message: "Rough price is required!" }),
  roughTotal: z.string().trim().min(1, { message: "Rough total is required!" }),
  bidPrice: z.number().min(1, { message: "Bid price is required!" }),
  totalAmount: z.number().min(1, { message: "Total amount is required!" }),
  resultCost: z.number().optional(),
  resultPerCarat: z
    .number()
    .min(1, { message: "Result per carat is required!" }),
  resultTotal: z.string().min(1, { message: "Result total is required!" }),
  finalCostPrice: z.number().optional(),
  finalBidPrice: z
    .string()
    .trim()
    .min(1, { message: "Final bid price is required!" }),
  finalTotalAmount: z
    .number()
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
    initialData: {
      data: colorOptions,
      success: true,
      message: "Initial data loaded successfully",
    },
  });

  const { data: claritiesOptions } = useQuery({
    queryKey: ["clarity-options"],
    queryFn: getClarityOptions,
    initialData: {
      data: clarityOptions,
      success: true,
      message: "Initial data loaded successfully",
    },
  });

  const { data: fluorescencesOptions } = useQuery({
    queryKey: ["fluorescence-options"],
    queryFn: getFluorescenceOptions,
    initialData: {
      data: fluorescenceOptions,
      success: true,
      message: "Initial data loaded successfully",
    },
  });

  const { data: shapesOptions } = useQuery({
    queryKey: ["shape-options"],
    queryFn: getShapeOptions,
    initialData: {
      data: shapeOptions,
      success: true,
      message: "Initial data loaded successfully",
    },
  });

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

  const [isPending, setIsPending] = useState(false);

  const [tenderDetails, setTenderDetails] =
    useState<TenderDetails[]>(initialTenderDetails);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [totalValues, setTotalValues] = useState<TotalValues>({
    pcs: 0,
    carats: 0,
    polCts: 0,
    polPercent: 0,
    salePrice: 0,
    saleAmount: 0,
    costPrice: 0,
    topsAmount: 0,
    totalAmount: 0,
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
  }, [date, setValue, errors, setError]);

  const netPercent = watch("netPercent");
  const resultTotal = watch("resultTotal");
  const tendetType = watch("tenderType");
  const finalBidPrice = watch("finalBidPrice");
  const roughCts = watch("roughCts");
  const labour = watch("labour");

  useEffect(() => {
    if (netPercent && tendetType && labour) {
      const netPercentValue = parseFloat(netPercent);
      const labourValue = parseFloat(labour);

      const netPercentage = netPercentValue / 100;

      let calculatedBidPrice = 0;

      if (tendetType === "singleStone") {
        calculatedBidPrice = parseFloat(
          (
            ((((totalValues.costPrice + (totalValues?.topsAmount ?? 0)) * 0.97 - 230) *
              totalValues.polCts) /
              totalValues.carats -
              labourValue) /
            netPercentage
          ).toFixed(2)
        );
      } else if (tendetType === "mixLot") {
        calculatedBidPrice = parseFloat(
          (
            (((totalValues.salePrice * 0.97 - 230) * totalValues.polCts) /
              totalValues.carats -
              labourValue) /
            netPercentage
          ).toFixed(2)
        );
      } else if (tendetType === "roughLot") {
        calculatedBidPrice = parseFloat(
          (totalValues.costPrice / netPercentage).toFixed(2)
        );
      }

      if (!isNaN(calculatedBidPrice)) {
        setValue("bidPrice", calculatedBidPrice);
        let totalAmount = 0;
        if (tendetType === "singleStone") {
          totalAmount = parseFloat(
            (totalValues.carats * calculatedBidPrice).toFixed(2)
          );
        } else if (
          (tendetType === "mixLot" || tendetType === "roughLot") &&
          roughCts
        ) {
          const roughCtsValue = parseFloat(roughCts);
          if (!isNaN(roughCtsValue)) {
            totalAmount = parseFloat(
              (calculatedBidPrice * roughCtsValue).toFixed(2)
            );
          }
        }
        setValue("totalAmount", totalAmount);
      }

      if (resultTotal) {
        const resultTotalValue = parseFloat(resultTotal);
        if (!isNaN(resultTotalValue)) {
          let resultPerCarat = 0;
          if (tendetType === "singleStone") {
            resultPerCarat = parseFloat(
              (resultTotalValue / totalValues.carats).toFixed(2)
            );
          } else if (
            (tendetType === "mixLot" || tendetType === "roughLot") &&
            roughCts
          ) {
            const roughCtsValue = parseFloat(roughCts);
            if (!isNaN(roughCtsValue)) {
              resultPerCarat = parseFloat(
                (resultTotalValue / roughCtsValue).toFixed(2)
              );
            }
          }

          if (!isNaN(resultPerCarat)) {
            setValue("resultPerCarat", resultPerCarat);
            let resultCost = 0;
            if (tendetType === "singleStone") {
              resultCost = parseFloat(
                (
                  (((resultPerCarat * 0.06 + resultPerCarat + labourValue) *
                    totalValues.carats) /
                    totalValues.polCts +
                    230) /
                    0.97 -
                  (totalValues?.topsAmount ?? 0)
                ).toFixed(2)
              );
            } else if (tendetType === "mixLot") {
              resultCost = parseFloat(
                (
                  (((resultPerCarat * 0.06 + resultPerCarat + labourValue) *
                    totalValues.carats) /
                    totalValues.polCts +
                    230) /
                  0.97
                ).toFixed(2)
              );
            }
            if (!isNaN(resultCost)) {
              setValue("resultCost", resultCost);
            }
          }
        }
      }

      if (finalBidPrice) {
        const finalBidPriceValue = parseFloat(finalBidPrice);
        let finalCostPrice = 0;
        if (!isNaN(finalBidPriceValue)) {
          if (tendetType === "singleStone") {
            finalCostPrice = parseFloat(
              (
                (((finalBidPriceValue * 0.06 + finalBidPriceValue + labourValue) *
                  totalValues.carats) /
                  totalValues.polCts +
                  230) /
                  0.97 -
                (totalValues?.topsAmount ?? 0)
              ).toFixed(2)
            );
          } else if (tendetType === "mixLot") {
            finalCostPrice = parseFloat(
              (
                (((finalBidPriceValue * 0.06 + finalBidPriceValue + labourValue) *
                  totalValues.carats) /
                  totalValues.polCts +
                  230) /
                0.97
              ).toFixed(2)
            );
          }

          if (!isNaN(finalCostPrice)) {
            setValue("finalCostPrice", finalCostPrice);
          }

          let finalTotalAmount = 0;
          if (tendetType === "singleStone") {
            finalTotalAmount = parseFloat(
              (finalBidPriceValue * totalValues.carats).toFixed(2)
            );
          } else if (
            (tendetType === "mixLot" || tendetType === "roughLot") &&
            roughCts
          ) {
            const roughCtsValue = parseFloat(roughCts);
            if (!isNaN(roughCtsValue)) {
              finalTotalAmount = parseFloat(
                (finalBidPriceValue * roughCtsValue).toFixed(2)
              );
            }
          }
          setValue("finalTotalAmount", finalTotalAmount);
        }
      }
    }
  }, [
    labour,
    totalValues,
    setValue,
    netPercent,
    tendetType,
    resultTotal,
    finalBidPrice,
    roughCts,
  ]);

  const roughPcs = watch("roughPcs");

  useEffect(() => {
    if (roughPcs) {
      const roughPcsValue = parseFloat(roughPcs);
      const roughCtsValue = parseFloat(roughCts);

      if (!isNaN(roughPcsValue)) {
        const roughSize = parseFloat((roughPcsValue / roughCtsValue).toFixed(2));
        setValue("roughSize", String(roughSize));
      }
    }
  }, [roughPcs, roughCts, setValue]);

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
    setIsPending(true);

    const payload = {
      ...data,
      tenderDetails: JSON.stringify(tenderDetails),
    };

    console.log(payload, "payload");

    // const response = await createTender(payload);
    // if (response.success) {
    //   toast.success(response.message);
    //   redirect("/tenders");
    // } else {
    //   toast.error(response.message);
    // }
    setIsPending(false);
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
                      {/* <SelectItem value="singleStone">Single Stone</SelectItem> */}
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
                <Label className="w-[94px] shrink-0">Net %</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("netPercent")}
                  className={cn(
                    errors.netPercent?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                  placeholder="106"
                />
              </div>
              <div className="flex w-full items-center justify-between">
                <Label className="w-[100px] shrink-0">Person</Label>
                <Input
                  type="text"
                  {...register("personName")}
                  className={cn(
                    errors.personName?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                  placeholder="Raj"
                />
              </div>
              <div className="flex w-full items-center justify-between">
                <Label className="w-[94px] shrink-0">Labour</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("labour")}
                  className={cn(
                    errors.labour?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                  defaultValue={50}
                  placeholder="50"
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
              <div className="flex w-full items-center col-span-3">
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
              <div className="flex w-full items-center col-span-3">
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
                <Label className="w-[88px] shrink-0">Rough Pcs.</Label>
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
              <div className="flex w-full items-center col-span-2">
                <Label className="w-[88px] shrink-0">Rough Cts.</Label>
                <Input
                  type="number"
                  {...register("roughCts")}
                  placeholder="24.4"
                  step={0.01}
                  className={cn(
                    errors.roughCts?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                />
              </div>
              <div className="flex w-full items-center col-span-2">
                <Label className="w-[88px] shrink-0">Rough Size</Label>
                <Input
                  {...register("roughSize")}
                  disabled
                  readOnly
                  type="number"
                  step={0.01}
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
                  step={0.01}
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
                  step={0.01}
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
          handleValueChange={handleDetailsValueChange}
          data={tenderDetails}
          colors={colorsOptions?.data}
          clarities={claritiesOptions?.data}
          fluorescences={fluorescencesOptions?.data}
          shapes={shapesOptions?.data}
        />
      </div>

      <div className="grid grid-cols-1 mt-4">
        <Card>
          {/* <CardHeader>
            <CardTitle>Cost Details</CardTitle>
          </CardHeader> */}
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
                    step={0.01}
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
                    step={0.01}
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
      <div className="flex justify-end gap-2 items-center">
        <Button className="mt-4" type="button" asChild>
          <Link href={"/tenders"}>Cancel</Link>
        </Button>
        <Button disabled={isPending} className="mt-4" type="submit">
          Submit {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        </Button>
      </div>
    </form>
  );
}

// Pol % - (polcts / cts) * 100
// PolCts - (pol% * cts) / 100
// Sale Amount - (PolCts * salePricr)
// Sale Price - (Sale Amount / polcts)
