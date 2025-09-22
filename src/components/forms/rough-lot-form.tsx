"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { z } from "zod";
// import { Option } from "@/lib/types/common";
import {
  RoughLotPaylod,
  RoughLotTenderDetails,
  TotalValues,
} from "@/lib/types/tender";
import { RoughLotDetails } from "../data-table/rough-lot-detail";
import { useRouter, useSearchParams } from "next/navigation";
import { getBaseTenderById } from "@/services/base-tender";
import { createRoughLot, getRoughLotById } from "@/services/rough-lot";
import { toast } from "react-toastify";
import useEffectAfterMount from "@/hooks/useEffectAfterMount";
import { Switch } from "../ui/switch";
import { invalidateQuery } from "@/lib/invalidate";

export const initialRow: RoughLotTenderDetails = {
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
  dcLabour: 0,
  dcCostPrice: 0,
  dcCostAmount: 0,
};

export const initialTenderDetails = (labour?: number) => [
  {
    ...initialRow,
    dcLabour: labour || 0,
  },
];

const createRoughLotSchema = z.object({
  // voucherDate: z.string(),
  // tenderName: z.string().trim().min(2, { message: "Tender name is required!" }),
  // personName: z.string().trim().min(2, { message: "Person name is required!" }),
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
  rate: z.preprocess((val) => (val ? Number(val) : 0), z.number().optional()),
  amount: z.preprocess((val) => (val ? Number(val) : 0), z.number().optional()),
  bidPrice: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Bid price is required!")
  ),
  totalAmount: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Total amount is required!")
  ),
  resultPerCarat: z.preprocess(
    (val) => (val ? Number(val) : 0),
    z.number().optional()
  ),
  resultTotal: z.preprocess(
    (val) => (val ? Number(val) : 0),
    z.number().optional()
  ),
  costPrice: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Cost price is required!")
  ),
  costAmount: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Cost amount is required!")
  ),
  isWon: z.boolean().optional(),
});

type CreateRoughLotFormValues = z.infer<typeof createRoughLotSchema>;

export function RoughLotForm() {
  // const { data: colorsOptions } = useQuery({
  //   queryKey: ["color-options"],
  //   queryFn: getColorOptions,
  // });

  // const { data: claritiesOptions } = useQuery({
  //   queryKey: ["clarity-options"],
  //   queryFn: getClarityOptions,
  // });

  // const { data: fluorescencesOptions } = useQuery({
  //   queryKey: ["fluorescence-options"],
  //   queryFn: getFluorescenceOptions,
  // });

  // const { data: shapesOptions } = useQuery({
  //   queryKey: ["shape-options"],
  //   queryFn: getShapeOptions,
  // });

  const searchParams = useSearchParams();
  const baseTenderId = searchParams.get("baseTenderId") as string;
  const mainLotId = searchParams.get("mainLotId") as string;
  const roughLotId = searchParams.get("id") as string; //otherTenderId

  const { data: baseTender, isLoading: loadingBaseTender } = useQuery({
    queryKey: ["base-tender", baseTenderId],
    queryFn: () => getBaseTenderById(parseInt(baseTenderId)),
    enabled: !!baseTenderId,
  });

  const { data: roughLotTender, isLoading: loadingRoughLot } = useQuery({
    queryKey: ["rough-lot-tender", roughLotId],
    queryFn: () => getRoughLotById(parseInt(roughLotId)),
    enabled: !!roughLotId,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CreateRoughLotFormValues>({
    mode: "onBlur",
    resolver: zodResolver(createRoughLotSchema),
  });

  const [isPending, setIsPending] = useState(false);

  const [tenderDetails, setTenderDetails] = useState<RoughLotTenderDetails[]>(
    []
  );
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
    if (roughLotTender && roughLotTender.data && !loadingRoughLot) {
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
        stLotNo,
        otherTenderDetails,
        dcCostPrice,
        dcCostAmount,
        stRemark,
        isWon
      } = roughLotTender.data;
      reset({
        roughPcs: inRoughPcs,
        roughCts: dcRoughCts,
        remark: stRemark,
        rate: dcRate,
        amount: dcAmount,
        labour: dcLabour,
        netPercent: dcNetPercentage,
        bidPrice: dcBidPrice,
        lotSize: dcLotSize,
        totalAmount: dcTotalAmount,
        resultPerCarat: dcResultPerCt,
        resultTotal: dcResultTotal,
        costPrice: dcCostPrice,
        costAmount: dcCostAmount,
        lotNo: stLotNo,
        isWon,
      });

      const tenderDetails = otherTenderDetails.map((details: any) => ({
        ...details,
        dcRoughCts: parseFloat(details.dcRoughCts),
        dcPolCts: parseFloat(details.dcPolCts),
        dcPolPer: parseFloat(details.dcPolPer),
        // dcDepth: parseFloat(details.dcDepth),
        // dcTable: parseFloat(details.dcTable),
        // dcRatio: parseFloat(details.dcRatio),
        dcSalePrice: parseFloat(details.dcSalePrice),
        dcSaleAmount: parseFloat(details.dcSaleAmount),
        dcLabour: parseFloat(details.dcLabour),
        dcCostPrice: parseFloat(details.dcCostPrice),
        dcCostAmount: parseFloat(details.dcCostAmount),
      }));
      setTenderDetails(tenderDetails);
    }
  }, [roughLotTender, loadingRoughLot, reset]);

  const netPercent = watch("netPercent");

  const roughCts = watch("roughCts");
  const labour = watch("labour");
  const costPrice = watch("costPrice");

  useEffect(() => {
    if (!loadingBaseTender && baseTender?.data) {
      const { dcNetPercentage, dcLabour } = baseTender.data;
      const labour = parseFloat(dcLabour);
      setValue("netPercent", dcNetPercentage);
      setValue("labour", labour);
    }
  }, [baseTender, loadingBaseTender, setValue]);

  useEffect(() => {
    if (!roughLotId) {
      setTenderDetails(initialTenderDetails(labour));
    }
  }, [roughLotId, labour]);

  useEffectAfterMount(() => {
    if (netPercent) {
      // const netPercentValue = parseFloat(netPercent);

      const netPercentage = netPercent / 100;

      const calculatedBidPrice = parseFloat(
        (costPrice / netPercentage).toFixed(2)
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
    }
  }, [totalValues, setValue, netPercent, roughCts, costPrice]);

  // const resultPerCarat = watch("resultPerCarat");

  // useEffectAfterMount(() => {
  //   if (resultPerCarat) {
  //     const resultTotal = parseFloat((resultPerCarat * roughCts).toFixed(1));
  //     setValue("resultTotal", resultTotal);
  //   }
  // }, [resultPerCarat, setValue]);

  // const resultTotal = watch("resultTotal");

  // useEffectAfterMount(() => {
  //   if (resultTotal) {
  //     if (!isNaN(resultTotal)) {
  //       let resultPerCarat = 0;
  //       if (roughCts) {
  //         if (!isNaN(roughCts)) {
  //           resultPerCarat = parseFloat((resultTotal / roughCts).toFixed(2));
  //         }
  //       }

  //       if (!isNaN(resultPerCarat)) {
  //         setValue("resultPerCarat", resultPerCarat);
  //       }
  //     }
  //   }
  // }, [resultTotal, roughCts, setValue]);

  const roughPcs = watch("roughPcs");

  useEffectAfterMount(() => {
    if (roughPcs) {
      if (!isNaN(roughPcs)) {
        const roughSize = parseFloat((roughCts / roughPcs).toFixed(2));
        setValue("lotSize", roughSize);
      }
    }
  }, [roughPcs, roughCts, setValue]);

  // const rate = watch("rate");

  // useEffectAfterMount(() => {
  //   if (rate) {
  //     if (!isNaN(rate)) {
  //       const amount = roughCts * rate;
  //       setValue("amount", amount);
  //     }
  //   } else if (rate === 0) {
  //     setValue("amount", 0);
  //   }
  // }, [rate, roughCts, setValue]);

  useEffectAfterMount(() => {
    if (totalValues.costAmount) {
      setValue("costAmount", parseFloat(totalValues.costAmount?.toFixed(2)));
    }
  }, [totalValues.costAmount, setValue]);

  useEffectAfterMount(() => {
    const costPrice = parseFloat(
      (
        (totalValues.costAmount
          ? totalValues?.costAmount
          : 0) / totalValues.carats
      ).toFixed(2)
    );
    setValue("costPrice", costPrice);
  }, [totalValues.costAmount, totalValues.carats, setValue]);

  const handleDetailsValueChange = (
    value: RoughLotTenderDetails,
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
    // Block plain Enter
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }

    // Submit on Shift+Enter
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      (e.currentTarget as HTMLFormElement).requestSubmit();
    }
  };

  async function onSubmit(data: CreateRoughLotFormValues) {
    setIsPending(true);

    const payload: RoughLotPaylod = {
      ...data,
      isWon: data.isWon ?? false,
      baseTenderId: parseInt(baseTenderId),
      tenderDetails: JSON.stringify(tenderDetails),
    };

    if (roughLotTender?.data?.id) {
      payload.id = parseInt(roughLotTender.data.id);
    }

    if (mainLotId) {
      payload.mainLotId = parseInt(mainLotId);
    }

    console.log(payload, "payload");

    const response = await createRoughLot(payload);
    if (response.success) {
      toast.success(response.message);
      reset();
      invalidateQuery("rough-lot-tenders")

      if (mainLotId) {
        router.push(
          "/tenders/rough-lot?baseTenderId=" +
            baseTenderId +
            "&mainLotId=" +
            mainLotId
        );
      } else {
        router.push("/tenders/rough-lot?baseTenderId=" + baseTenderId);
      }
    } else {
      toast.error(response.message);
    }
    setIsPending(false);
  }

  const router = useRouter();

  if (!roughLotId && loadingBaseTender) {
    return (
      <div className="flex justify-center items-center h-[90dvh]">
        <Loader2 className="h-20 w-20 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
      <div className="flex lg:items-center flex-col lg:flex-row lg:justify-between gap-4 lg:gap-10 p-3 border border-neutral-300 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center text-nowrap gap-2">
            <h1 className="text-lg font-semibold">Rough Lot Tender</h1>
            <p className="text-neutral-500">
              {new Date(baseTender?.data?.dtVoucherDate).toDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2 text-neutral-700">
            <p className="pr-2 border-r-2 text-sm">
              {baseTender?.data?.stTenderName}
            </p>
            <p className="text-sm">{baseTender?.data?.stPersonName}</p>
          </div>
        </div>
        <div className="flex lg:flex-row flex-wrap lg:items-center gap-2 lg:gap-4">
          <div className="w-24">
            <Label className="text-nowrap shrink-0 text-neutral-700">Lot No.</Label>
            <Input
              type="text"
              {...register("lotNo")}
              placeholder="FS39"
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                e.target.value = value;
                setValue("lotNo", value);
              }}
              className={cn(
                errors.lotNo?.message &&
                  "border border-red-500 placeholder:text-red-500"
              )}
            />
          </div>
          <div className="w-36">
            <Label className="text-nowrap shrink-0 text-neutral-700">Rough Pcs. & Cts.</Label>
            <div className="flex items-center gap-[1px]">
              <Input
                type="number"
                {...register("roughPcs", { valueAsNumber: true })}
                placeholder="4"
                className={`rounded-r-none ${cn(
                  errors.roughPcs?.message &&
                    "border border-red-500 placeholder:text-red-500"
                )}`}
              />
              <Input
                type="number"
                {...register("roughCts", { valueAsNumber: true })}
                placeholder="24.4"
                step={0.01}
                className={`rounded-l-none ${cn(
                  errors.roughCts?.message &&
                    "border border-red-500 placeholder:text-red-500"
                )}`}
              />
            </div>
          </div>
          <div className="w-20">
            <Label className="text-nowrap shrink-0 text-neutral-700">Lot Size</Label>
            <Input
              {...register("lotSize", { valueAsNumber: true })}
              disabled
              readOnly
              type="number"
              step={0.01}
              placeholder="4.96"
              className={cn(
                errors.lotSize?.message &&
                  "w-14 border border-red-500 placeholder:text-red-500"
              )}
            />
          </div>
          <div className="w-20">
            <Label className="text-nowrap shrink-0 text-neutral-700">Labour</Label>
            <Input
              type="number"
              step="0.01"
              {...register("labour", { valueAsNumber: true })}
              disabled
              className={cn(
                errors.labour?.message &&
                  "border border-red-500 placeholder:text-red-500"
              )}
              placeholder="50"
            />
          </div>
          <div className="w-20">
            <Label className="text-nowrap shrink-0 text-neutral-700">Net %</Label>
            <Input
              type="number"
              step="0.01"
              {...register("netPercent", { valueAsNumber: true })}
              disabled
              className={cn(
                errors.netPercent?.message &&
                  "border border-red-500 placeholder:text-red-500"
              )}
              placeholder="106"
            />
          </div>
          <div className="w-80">
            <Label className="text-nowrap shrink-0 text-neutral-700">Remark</Label>
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

      {/* <div
        className={`p-3 border border-neutral-300 rounded-lg shadow-sm mb-4 ${
          loadingRoughLot ? "animate-pulse bg-neutral-100" : ""
        }`}
      >
        <div className="grid grid-cols-4 gap-x-3 gap-y-4">
          <div className="flex w-full items-center gap-2">
            <Label className="text-nowrap shrink-0">Lot No.</Label>
            <Input
              type="text"
              {...register("lotNo")}
              placeholder="FS39"
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                e.target.value = value;
                setValue("lotNo", value);
              }}
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
        </div>
      </div> */}

      <div className="mt-4 overflow-hidden rounded-lg border border-neutral-300 shadow-sm">
        <RoughLotDetails
          lotNo={watch("lotNo")}
          isDataLoading={loadingRoughLot}
          totalValues={totalValues}
          setTotalValues={setTotalValues}
          handleValueChange={handleDetailsValueChange}
          data={tenderDetails}
          // colors={colorsOptions?.data}
          // clarities={claritiesOptions?.data}
          // fluorescences={fluorescencesOptions?.data}
          // shapes={shapesOptions?.data}
          labour={labour}
        />
      </div>

      <div
        className={`p-3 border border-neutral-300 rounded-lg shadow-sm mt-4 mb-10 ${
          loadingRoughLot ? "animate-pulse bg-neutral-100" : ""
        }`}
      >
        <div className="grid grid-cols-4 gap-x-6 gap-y-3">
          <div className="flex w-full max-w-sm items-center gap-2">
            <Label className="text-nowrap w-32">Cost Price</Label>
            <Input
              type="number"
              {...register("costPrice", { valueAsNumber: true })}
              step={0.01}
              className="w-full"
            />
          </div>

          <div className="flex w-full max-w-sm items-center gap-2">
            <Label className="text-nowrap w-32">Bid Price</Label>
            <Input
              type="number"
              {...register("bidPrice", { valueAsNumber: true })}
              step={0.01}
              readOnly
              disabled
              className="w-full"
            />
          </div>
          <div className="flex w-full items-center gap-2">
            <Label className="text-nowrap w-40">Result Total</Label>
            <Input
              type="number"
              {...register("resultTotal", { valueAsNumber: true })}
              step={0.01}
              // placeholder="10000"
              className="w-full"
              onChange={(e) => {
                const value = e.target.value
                  ? parseFloat(e.target.value)
                  : undefined;

                const resultPerCarat = parseFloat(
                  ((value ?? 0) / roughCts).toFixed(2)
                );

                setValue("resultPerCarat", resultPerCarat);
              }}
            />
          </div>
          <div className="flex w-full items-center justify-center gap-2">
            <label className="font-semibold text-red-600">Loss</label>
            <Switch
              checked={watch("isWon") ? true : false}
              onCheckedChange={(value) => {
                setValue("isWon", value);
              }}
            />
            <label className="font-semibold text-green-600">Win</label>
          </div>
          <div className="flex w-full max-w-sm items-center gap-2">
            <Label className="text-nowrap w-32">Cost Amount</Label>
            <Input
              type="number"
              {...register("costAmount", { valueAsNumber: true })}
              step={0.01}
              className="w-full"
            />
          </div>
          <div className="flex w-full max-w-sm items-center gap-2">
            <Label className="text-nowrap w-32">Bid Amount</Label>
            <Input
              type="number"
              {...register("totalAmount", { valueAsNumber: true })}
              step={0.01}
              className="w-full"
              readOnly
              disabled
            />
          </div>

          <div className="flex w-full items-center gap-2">
            <Label className="text-nowrap w-40">Result Per Cts.</Label>
            <Input
              type="number"
              {...register("resultPerCarat", { valueAsNumber: true })}
              step={0.01}
              className="w-full"
              onChange={(e) => {
                const value = e.target.value
                  ? parseFloat(e.target.value)
                  : undefined;

                const resultTotal = parseFloat(
                  ((value ?? 0) * roughCts).toFixed(2)
                );

                setValue("resultTotal", resultTotal);
              }}
            />
          </div>
          {/* <div className="flex w-full items-center opacity-50 justify-center gap-2">
            <p className="font-semibold">Margin:</p>     
            <p className="font-semibold">0%</p>
          </div> */}
        </div>
      </div>
      <div className="fixed bottom-4 left-0 right-4 flex justify-end gap-2 items-center">
        <Button className="mt-4" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button disabled={isPending} className="mt-4" type="submit">
          Submit {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        </Button>
      </div>
    </form>
  );
}
