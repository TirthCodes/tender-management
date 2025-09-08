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
import {
  MixLotPaylod,
  MixLotTenderDetails,
  TotalValues,
} from "@/lib/types/tender";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { getBaseTenderById } from "@/services/base-tender";
import { MixLotDetails } from "../data-table/mix-lot-details";
import { createMixLot, getMixLotById } from "@/services/mix-lot";
import { toast } from "react-toastify";
import useEffectAfterMount from "@/hooks/useEffectAfterMount";

export const initialRow: MixLotTenderDetails = {
  inRoughPcs: 0,
  dcRoughCts: 0,
  color: { id: 0, stShortName: "" },
  inColorGrade: 0,
  clarity: { id: 0, stShortName: "" },
  fluorescence: { id: 0, stShortName: "" },
  shape: { id: 0, stShortName: "" },
  stRemark: "",
  dcPolCts: 0,
  dcPolPer: 0,
  dcDepth: 0,
  dcTable: 0,
  dcRatio: 0,
  dcSalePrice: 0,
  dcSaleAmount: 0,
};

const initialTenderDetails = [initialRow];

interface MixLotFormProps {
  colorOptions: Option[];
  clarityOptions: Option[];
  fluorescenceOptions: Option[];
  shapeOptions: Option[];
}

const mixLotSchema = z.object({
  voucherDate: z.string(),
  tenderName: z.string().trim().min(2, { message: "Tender name is required!" }),
  personName: z.string().trim().min(2, { message: "Person name is required!" }),
  netPercent: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Net % is required!" })
  ),
  labour: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Labour is required!" })
  ),
  remark: z.string().trim().optional(),
  lotNo: z.string().trim().min(1, { message: "Lot no.is required!" }),
  roughPcs: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Rough pcs is required!" })
  ),
  roughCts: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Rough cts is required!" })
  ),
  lotSize: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Lot size is required!" })
  ),
  rate: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Rate is required!" })
  ),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Amount is required!" })
  ),
  // bidPrice: z.number().min(1, { message: "Bid price is required!" }),
  bidPrice: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Bid price is required!")
  ),
  totalAmount: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Total amount is required!")
  ),
  resultPerCarat: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Result per carat is required!")
  ),
  resultTotal: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Result total is required!")
  ),
  resultCost: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Result cost is required!")
  ),
});

type MixLotFormValues = z.infer<typeof mixLotSchema>;

export function MixLotForm({
  colorOptions,
  clarityOptions,
  fluorescenceOptions,
  shapeOptions,
}: MixLotFormProps) {
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

  const searchParams = useSearchParams();
  const baseTenderId = searchParams.get("baseTenderId") as string;
  const mainLotId = searchParams.get("mainLotId") as string;
  const mixLotId = searchParams.get("id") as string; //otherTenderId

  const { data: baseTender, isLoading: lodingBaseTender } = useQuery({
    queryKey: ["base-tender"],
    queryFn: () => getBaseTenderById(parseInt(baseTenderId)),
    enabled: !!baseTenderId,
  });

  const { data: mixLotTender, isLoading: loadingMixLot } = useQuery({
    queryKey: ["mix-lot-tender"],
    queryFn: () => getMixLotById(parseInt(mixLotId)),
    enabled: !!mixLotId,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm<MixLotFormValues>({
    mode: "onBlur",
    resolver: zodResolver(mixLotSchema),
  });

  const [isPending, setIsPending] = useState(false);

  const [tenderDetails, setTenderDetails] =
    useState<MixLotTenderDetails[]>(initialTenderDetails);
  const [totalValues, setTotalValues] = useState<TotalValues>({
    pcs: 0,
    carats: 0,
    polCts: 0,
    polPercent: 0,
    salePrice: 0,
    saleAmount: 0,
    costPrice: 0,
    topsAmount: 0,
  });

  useEffect(() => {
    if (mixLotTender && mixLotTender.data && !loadingMixLot) {
      const {
        inRoughPcs,
        dcRoughCts,
        dcRate,
        dcAmount,
        dcLabour,
        dcNetPercentage,
        dcBidPrice,
        dcLotSize,
        dcTotalAmount,
        dcResultPerCt,
        dcResultTotal,
        dcResultCost,
        stLotNo,
        otherTenderDetails,
      } = mixLotTender.data;
      reset({
        roughPcs: inRoughPcs,
        roughCts: dcRoughCts,
        rate: dcRate,
        amount: dcAmount,
        labour: dcLabour,
        netPercent: dcNetPercentage,
        bidPrice: dcBidPrice,
        lotSize: dcLotSize,
        totalAmount: dcTotalAmount,
        resultPerCarat: dcResultPerCt,
        resultTotal: dcResultTotal,
        resultCost: dcResultCost,
        lotNo: stLotNo,
      });
      setTenderDetails(otherTenderDetails);
    }
  }, [mixLotTender, loadingMixLot, reset]);

  const netPercent = watch("netPercent");
  const resultTotal = watch("resultTotal");
  const roughCts = watch("roughCts");
  const labour = watch("labour");

  useEffect(() => {
    if (!lodingBaseTender && baseTender?.data) {
      setValue("netPercent", baseTender.data.dcNetPercentage);
      setValue("labour", baseTender.data.dcLabour);
    }
  }, [baseTender, lodingBaseTender, setValue]);

  useEffectAfterMount(() => {
    if (netPercent && labour) {
      const netPercentage = netPercent / 100;

      const calculatedBidPrice = parseFloat(
        (
          (((totalValues.salePrice * 0.97 - 180) * totalValues.polCts) /
            totalValues.carats -
            labour) /
          netPercentage
        ).toFixed(2)
      );

      if (!isNaN(calculatedBidPrice)) {
        setValue("bidPrice", calculatedBidPrice);
        let totalAmount = 0;
        if (roughCts) {
          if (!isNaN(roughCts)) {
            totalAmount = parseFloat(
              (calculatedBidPrice * roughCts).toFixed(2)
            );
          }
        }
        setValue("totalAmount", totalAmount);
      }

      if (resultTotal) {
        if (!isNaN(resultTotal)) {
          let resultPerCarat = 0;
          if (roughCts) {
            if (!isNaN(roughCts)) {
              resultPerCarat = parseFloat((resultTotal / roughCts).toFixed(2));
            }
          }

          if (!isNaN(resultPerCarat)) {
            setValue("resultPerCarat", resultPerCarat);
            let resultCost = 0;
            if (roughCts) {
              resultCost = parseFloat(
                (
                  (((resultPerCarat * 0.06 + resultPerCarat + labour) *
                    totalValues.carats) /
                    totalValues.polCts +
                    180) /
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
    }
  }, [labour, totalValues, setValue, netPercent, resultTotal, roughCts]);

  const roughPcs = watch("roughPcs");

  useEffectAfterMount(() => {
    if (roughPcs) {
      if (!isNaN(roughPcs)) {
        const roughSize = parseFloat((roughPcs / roughCts).toFixed(2));
        setValue("lotSize", roughSize);
      }
    }
  }, [roughPcs, roughCts, setValue]);

  const handleDetailsValueChange = (
    value: MixLotTenderDetails,
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // Prevent normal Enter from submitting
    if (e.key === "Enter" && !e.ctrlKey) {
      e.preventDefault();
    }

    // Submit on Ctrl+Enter
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      onSubmit(watch());
    }
  };

  async function onSubmit(data: MixLotFormValues) {
    setIsPending(true);

    const payload: MixLotPaylod = {
      ...data,
      baseTenderId: parseInt(baseTenderId),
      tenderDetails: JSON.stringify(tenderDetails),
    };

    if (mixLotTender?.data?.id) {
      payload.id = parseInt(mixLotTender.data.id);
    }

    if (mainLotId) {
      payload.mainLotId = parseInt(mainLotId);
    }

    console.log(payload, "payload");

    const response = await createMixLot(payload);
    if (response.success) {
      toast.success(response.message);
      if (mainLotId) {
        redirect(
          "/tenders/mix-lot?baseTenderId=" +
            baseTenderId +
            "&mainLotId=" +
            mainLotId
        );
      } else {
        redirect("/tenders/mix-lot?baseTenderId=" + baseTenderId);
      }
    } else {
      toast.error(response.message);
    }
    setIsPending(false);
  }

  if (lodingBaseTender || loadingMixLot) {
    return (
      <div className="flex justify-center items-center h-[90dvh]">
        <Loader2 className="h-20 w-20 animate-spin" />
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit);
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center flex-col md:flex-row md:justify-between p-3 border border-neutral-300 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">Mix Lot Tender</h1>
          <div className="flex items-center gap-2 text-neutral-700">
            <p className="pr-2 border-r-2">
              {new Date(baseTender?.data?.dtVoucherDate).toDateString()}
            </p>
            <p className="pr-2 border-r-2">{baseTender?.data?.stTenderName}</p>
            <p>{baseTender?.data?.stPersonName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="">
            <Label>Labour</Label>
            <Input
              type="number"
              step="0.01"
              {...register("labour", { valueAsNumber: true })}
              className={cn(
                errors.labour?.message &&
                  "border border-red-500 placeholder:text-red-500"
              )}
              placeholder="50"
            />
          </div>
          <div className="">
            <Label>Net %</Label>
            <Input
              type="number"
              step="0.01"
              {...register("netPercent", { valueAsNumber: true })}
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
        <div className="grid grid-cols-6 gap-x-3 gap-y-4">
          <div className="flex w-full items-center gap-2">
            <Label className="text-nowrap shrink-0">Lot No.</Label>
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
          <div className="flex w-full items-center gap-2">
            <Label className="text-nowrap shrink-0">Rough Pcs.</Label>
            <Input
              type="number"
              {...register("roughPcs", { valueAsNumber: true })}
              placeholder="4"
              className={cn(
                errors.roughPcs?.message &&
                  "border border-red-500 placeholder:text-red-500"
              )}
            />
          </div>
          <div className="flex w-full items-center gap-2">
            <Label className="text-nowrap shrink-0">Rough Cts.</Label>
            <Input
              type="number"
              {...register("roughCts", { valueAsNumber: true })}
              placeholder="24.4"
              step={0.01}
              className={cn(
                errors.roughCts?.message &&
                  "border border-red-500 placeholder:text-red-500"
              )}
            />
          </div>
          <div className="flex w-full items-center gap-2">
            <Label className="text-nowrap shrink-0">Lot Size</Label>
            <Input
              {...register("lotSize", { valueAsNumber: true })}
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
          <div className="flex w-full items-center gap-2">
            <Label className="text-nowrap shrink-0">Rate</Label>
            <Input
              {...register("rate", { valueAsNumber: true })}
              type="number"
              placeholder="243"
              step={0.01}
              className={cn(
                errors.rate?.message &&
                  "border border-red-500 placeholder:text-red-500"
              )}
            />
          </div>

          <div className="flex w-full items-center gap-2">
            <Label className="text-nowrap shrink-0">Amount</Label>
            <Input
              {...register("amount", { valueAsNumber: true })}
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
        <MixLotDetails
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
        <div className="grid grid-cols-5 gap-6">
          <div className="flex w-full max-w-sm items-center gap-2">
            <Label className="text-nowrap">Bid Price</Label>
            <Input
              type="number"
              {...register("bidPrice", { valueAsNumber: true })}
              readOnly
              disabled
            />
          </div>
          <div className="flex w-full max-w-sm items-center gap-2">
            <Label className="text-nowrap">Total Amount</Label>

            <Input
              type="number"
              {...register("totalAmount", { valueAsNumber: true })}
              readOnly
              disabled
            />
          </div>
          <div className="flex w-full max-w-sm items-center gap-2">
            <Label className="text-nowrap">Result Total</Label>
            <Input
              type="number"
              {...register("resultTotal", { valueAsNumber: true })}
              step={0.01}
              placeholder="10000"
            />
          </div>
          <div className="flex w-full max-w-sm items-center gap-2">
            <Label className="text-nowrap">Result / Cts</Label>
            <Input
              type="number"
              {...register("resultPerCarat", { valueAsNumber: true })}
              readOnly
              disabled
            />
          </div>
          <div className="flex w-full max-w-sm items-center gap-2">
            <Label className="text-nowrap">Result cost</Label>
            <Input
              type="number"
              {...register("resultCost", { valueAsNumber: true })}
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
