"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Option } from "@/lib/types/common";
import { TenderDetails, TotalValues } from "@/lib/types/tender";
import Link from "next/link";
import { RoughLotDetails } from "../data-table/rough-lot-detail";

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

interface CreateRoughLotFormProps {
  colorOptions: Option[];
  clarityOptions: Option[];
  fluorescenceOptions: Option[];
  shapeOptions: Option[];
}

const createRoughLotSchema = z.object({
  voucherDate: z.string(),
  tenderType: z.string(),
  tenderName: z.string().trim().min(2, { message: "Tender name is required!" }),
  personName: z.string().trim().min(2, { message: "Person name is required!" }),
  netPercent: z.string().trim().min(2, { message: "Note % is required!" }),
  labour: z.string().trim().min(1, { message: "Labour is required!" }),
  remark: z.string().trim().optional(),
  lotNo: z.string().trim().min(1, { message: "Lot no.is required!" }),
  // roughName: z.string().trim().min(2, { message: "Rough name is required!" }),
  roughPcs: z.string().trim().min(1, { message: "Rough pcs is required!" }),
  roughCts: z.string().trim().min(1, { message: "Rough cts is required!" }),
  lotSize: z.string().trim().min(1, { message: "Lot size is required!" }),
  rate: z.string().trim().min(1, { message: "Rate is required!" }),
  amount: z.string().trim().min(1, { message: "Amount is required!" }),
  bidPrice: z.number().min(1, { message: "Bid price is required!" }),
  totalAmount: z.number().min(1, { message: "Total amount is required!" }),
  resultPerCarat: z
    .number()
    .min(1, { message: "Result per carat is required!" }),
  resultTotal: z.string().min(1, { message: "Result total is required!" }),
});

type CreateRoughLotFormValues = z.infer<typeof createRoughLotSchema>;

export function CreateRoughLotForm({
  colorOptions,
  clarityOptions,
  fluorescenceOptions,
  shapeOptions,
}: CreateRoughLotFormProps) {
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
  } = useForm<CreateRoughLotFormValues>({
    mode: "onBlur",
    resolver: zodResolver(createRoughLotSchema),
  });

  const [isPending, setIsPending] = useState(false);

  const [tenderDetails, setTenderDetails] =
    useState<TenderDetails[]>(initialTenderDetails);
  const [totalValues, setTotalValues] = useState<TotalValues>({
    pcs: 0,
    carats: 0,
    polCts: 0,
    polPercent: 0,
    salePrice: 0,
    costPrice: 0,
    topsAmount: 0,
  });

  const netPercent = watch("netPercent");
  const resultTotal = watch("resultTotal");
  const roughCts = watch("roughCts");
  const labour = watch("labour");

  useEffect(() => {
    if (netPercent && labour) {
      const netPercentValue = parseFloat(netPercent);

      const netPercentage = netPercentValue / 100;

      const calculatedBidPrice = parseFloat(
        (totalValues.costPrice / netPercentage).toFixed(2)
      );

      if (!isNaN(calculatedBidPrice)) {
        setValue("bidPrice", calculatedBidPrice);
        let totalAmount = 0;
        if (roughCts) {
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
          if (roughCts) {
            const roughCtsValue = parseFloat(roughCts);
            if (!isNaN(roughCtsValue)) {
              resultPerCarat = parseFloat(
                (resultTotalValue / roughCtsValue).toFixed(2)
              );
            }
          }

          if (!isNaN(resultPerCarat)) {
            setValue("resultPerCarat", resultPerCarat);
          }
        }
      }
    }
  }, [labour, totalValues, setValue, netPercent, resultTotal, roughCts]);

  const roughPcs = watch("roughPcs");

  useEffect(() => {
    if (roughPcs) {
      const roughPcsValue = parseFloat(roughPcs);
      const roughCtsValue = parseFloat(roughCts);

      if (!isNaN(roughPcsValue)) {
        const roughSize = parseFloat(
          (roughPcsValue / roughCtsValue).toFixed(2)
        );
        setValue("lotSize", String(roughSize));
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

  async function onSubmit(data: CreateRoughLotFormValues) {
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
      <div className="flex items-center flex-col md:flex-row md:justify-between p-3 border border-neutral-300 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">Rough Lot Tender</h1>
          <div className="flex items-center gap-2 text-neutral-700">
            <p className="pr-2 border-r-2">{new Date().toDateString()}</p>
            <p className="pr-2 border-r-2">Tender 1</p>
            <p>Test</p>
            {/* <p className="pr-2 border-r-2">
              {tenderData.dtVoucherDate.toDateString()}
            </p>
            <p className="pr-2 border-r-2">{tenderData.stTenderName}</p>
            <p>{tenderData.stPersonName}</p> */}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="">
            <Label>Labour</Label>
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
          <div className="">
            <Label>Net %</Label>
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
          <div className="w-full">
            <Label>Remark</Label>
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

      <div className="p-3 border border-neutral-300 rounded-lg shadow-sm mb-4">
        <h1 className="text-base font-semibold mb-2">Rough Details</h1>
        <div className="grid grid-cols-4 gap-x-3 gap-y-4">
          <div className="flex w-full items-center">
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
          {/* <div className="flex w-full items-center col-span-2">
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
          </div> */}
          <div className="flex w-full items-center">
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
          <div className="flex w-full items-center">
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
          <div className="flex w-full items-center">
            <Label className="w-[88px] shrink-0">Lot Size</Label>
            <Input
              {...register("lotSize")}
              disabled
              readOnly
              type="number"
              step={0.01}
              placeholder="4.96"
              className={cn(
                errors.lotSize?.message &&
                  "border border-red-500 placeholder:text-red-500"
              )}
            />
          </div>
          <div className="flex w-full items-center">
            <Label className="w-[88px] shrink-0">Rate</Label>
            <Input
              {...register("rate")}
              type="number"
              placeholder="243"
              step={0.01}
              className={cn(
                errors.rate?.message &&
                  "border border-red-500 placeholder:text-red-500"
              )}
            />
          </div>

          <div className="flex w-full items-center">
            <Label className="w-[88px] shrink-0">Amount</Label>
            <Input
              {...register("amount")}
              type="number"
              placeholder="999"
              step={0.01}
              className={cn(
                errors.amount?.message &&
                  "border border-red-500 placeholder:text-red-500"
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-neutral-300 shadow-sm">
        <RoughLotDetails
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

      <div className="p-3 border border-neutral-300 rounded-lg shadow-sm mt-4">
        <div className="grid grid-cols-4 gap-6">
          <div className="flex w-full max-w-sm items-center gap-2">
            <Label className="text-nowrap">Bid Price</Label>
            <Input type="number" {...register("bidPrice")} readOnly disabled />
          </div>
          <div className="flex w-full max-w-sm items-center gap-2">
            <Label className="text-nowrap">Total Amount</Label>

            <Input
              type="number"
              {...register("totalAmount")}
              readOnly
              disabled
            />
          </div>
          <div className="flex w-full max-w-sm items-center gap-2">
            <Label className="text-nowrap">Result Total</Label>
            <Input
              type="number"
              {...register("resultTotal")}
              step={0.01}
              placeholder="10000"
            />
          </div>
          <div className="flex w-full max-w-sm items-center gap-2">
            <Label className="text-nowrap">Result / Cts</Label>
            <Input
              type="number"
              {...register("resultPerCarat")}
              readOnly
              disabled
            />
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 left-0 right-4 flex justify-end gap-2 items-center">
        <Button className="mt-4" type="button">
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
