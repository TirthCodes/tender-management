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
import {
  MixLotPaylod,
  MixLotTenderDetails,
  TotalValues,
} from "@/lib/types/tender";
import { useRouter, useSearchParams } from "next/navigation";
import { getBaseTenderById } from "@/services/base-tender";
import { MixLotDetails } from "../data-table/mix-lot-details";
import { createMixLot, getMixLotById } from "@/services/mix-lot";
import { toast } from "react-toastify";
import useEffectAfterMount from "@/hooks/useEffectAfterMount";
import { Switch } from "../ui/switch";
import { invalidateQuery } from "@/lib/invalidate";

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

const mixLotSchema = z.object({
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
    (val) => (val ? Number(val) : 0),
    z.number().min(0, "Result per carat is required!")
  ),
  resultTotal: z.preprocess(
    (val) => (val ? Number(val) : 0),
    z.number().min(0, "Result total is required!")
  ),
  resultCost: z.preprocess(
    (val) => (val ? Number(val) : 0),
    z.number().min(0, "Result cost is required!")
  ),
  salePrice: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Sale price is required!")
  ),
  saleAmount: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Sale amount is required!")
  ),
  isWon: z.boolean().optional(),
});

type MixLotFormValues = z.infer<typeof mixLotSchema>;

export function MixLotForm() {
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

  const searchParams = useSearchParams();
  const baseTenderId = searchParams.get("baseTenderId") as string;
  const mainLotId = searchParams.get("mainLotId") as string;
  const mixLotId = searchParams.get("id") as string; //otherTenderId

  const { data: baseTender, isLoading: loadingBaseTender } = useQuery({
    queryKey: ["base-tender", baseTenderId],
    queryFn: () => getBaseTenderById(parseInt(baseTenderId)),
    enabled: !!baseTenderId,
  });

  const { data: mixLotTender, isLoading: loadingMixLot } = useQuery({
    queryKey: ["mix-lot-tender", mixLotId],
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
    totalAmount: 0,
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
        dcSalePrice,
        dcSaleAmount,
        stRemark,
        isWon,
      } = mixLotTender.data;
      reset({
        roughPcs: inRoughPcs,
        roughCts: dcRoughCts,
        rate: dcRate,
        amount: dcAmount,
        labour: dcLabour,
        remark: stRemark,
        netPercent: dcNetPercentage,
        bidPrice: dcBidPrice,
        lotSize: dcLotSize,
        totalAmount: dcTotalAmount,
        resultPerCarat: dcResultPerCt,
        resultTotal: dcResultTotal,
        resultCost: dcResultCost,
        salePrice: dcSalePrice,
        saleAmount: dcSaleAmount,
        lotNo: stLotNo,
        isWon,
      });

      const tenderDetails = otherTenderDetails.map((tender: any) => {
        return {
          ...tender,
          dcRoughCts: parseFloat(tender.dcRoughCts),
          dcPolCts: parseFloat(tender.dcPolCts),
          dcPolPer: parseFloat(tender.dcPolPer),
          // dcDepth: parseFloat(tender.dcDepth),
          // dcTable: parseFloat(tender.dcTable),
          // dcRatio: parseFloat(tender.dcRatio),
          dcSalePrice: parseFloat(tender.dcSalePrice),
          dcSaleAmount: parseFloat(tender.dcSaleAmount),
          dcLabour: parseFloat(tender.dcLabour),
          dcCostPrice: parseFloat(tender.dcCostPrice),
          dcCostAmount: parseFloat(tender.dcCostAmount),
        };
      });
      setTenderDetails(tenderDetails);
    }
  }, [mixLotTender, loadingMixLot, reset]);

  const netPercent = watch("netPercent");
  const roughCts = watch("roughCts");
  const labour = watch("labour");

  const salePrice = watch("salePrice");

  useEffect(() => {
    if (!loadingBaseTender && baseTender?.data) {
      setValue("netPercent", baseTender.data.dcNetPercentage);
      setValue("labour", baseTender.data.dcLabour);
    }
  }, [baseTender, loadingBaseTender, setValue]);

  useEffectAfterMount(() => {
    if (netPercent && labour && salePrice) {
      const netPercentage = netPercent / 100;

      const calculatedBidPrice = parseFloat(
        (
          (((salePrice * 0.97 - 230) * totalValues.polCts) /
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
    }
  }, [labour, totalValues, setValue, netPercent, roughCts, salePrice]);

  const roughPcs = watch("roughPcs");

  useEffectAfterMount(() => {
    if (roughPcs) {
      if (!isNaN(roughPcs)) {
        const roughSize = parseFloat((roughPcs / roughCts).toFixed(2));
        setValue("lotSize", roughSize);
      }
    }
  }, [roughPcs, roughCts, setValue]);

  const rate = watch("rate");

  useEffectAfterMount(() => {
    if (rate) {
      if (!isNaN(rate)) {
        const amount = roughCts * rate;
        setValue("amount", amount);
      }
    } else if (rate === 0) {
      setValue("amount", 0);
    }
  }, [rate, roughCts, setValue]);

  const resultTotal = watch("resultTotal");

  useEffectAfterMount(() => {
    if (roughCts && resultTotal) {
      const resultPerCarat = parseFloat((resultTotal / roughCts).toFixed(2));
      setValue("resultPerCarat", resultPerCarat);

      const newResultTotal = parseFloat((resultPerCarat * roughCts).toFixed(2));
      setValue("resultTotal", newResultTotal);

      const resultPercent = parseFloat(((netPercent - 100) / 100).toFixed(2));

      const resultCost = parseFloat(
        (
          (((resultPerCarat * resultPercent + resultPerCarat + labour) *
            totalValues.carats) /
            totalValues.polCts +
            230) /
          0.97
        ).toFixed(2)
      );

      setValue("resultCost", resultCost);
    }
  }, [roughCts, setValue]);

  useEffectAfterMount(() => {
    if (totalValues.saleAmount) {
      setValue("saleAmount", totalValues.saleAmount);
    }

    const salePrice = parseFloat(
      (totalValues.saleAmount / totalValues.polCts).toFixed(2)
    );
    setValue("salePrice", salePrice);
  }, [totalValues.saleAmount, totalValues.carats, setValue]);

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

  async function onSubmit(data: MixLotFormValues) {
    setIsPending(true);

    const payload: MixLotPaylod = {
      ...data,
      isWon: data.isWon ?? false,
      baseTenderId: parseInt(baseTenderId),
      tenderDetails: JSON.stringify(tenderDetails),
    };

    if (mixLotTender?.data?.id) {
      payload.id = parseInt(mixLotTender.data.id);
    }

    if (mainLotId) {
      payload.mainLotId = parseInt(mainLotId);
    }

    console.log({ payload });

    const response = await createMixLot(payload);
    if (response.success) {
      toast.success(response.message);
      invalidateQuery("mix-lot-tenders");
      if (mainLotId) {
        router.push(
          "/tenders/mix-lot?baseTenderId=" +
            baseTenderId +
            "&mainLotId=" +
            mainLotId
        );
      } else {
        router.push("/tenders/mix-lot?baseTenderId=" + baseTenderId);
      }
    } else {
      toast.error(response.message);
    }
    setIsPending(false);
  }

  const router = useRouter();

  if (!mixLotId && loadingBaseTender) {
    return (
      <div className="flex justify-center items-center h-[90dvh]">
        <Loader2 className="h-20 w-20 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
      <div className="flex items-center flex-col md:flex-row md:justify-between p-3 border border-neutral-300 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Mix Lot Tender</h1>
            <p className="text-neutral-500">
              {new Date(baseTender?.data?.dtVoucherDate).toDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <p className="pr-2 border-r-2">{baseTender?.data?.stTenderName}</p>
            <p>{baseTender?.data?.stPersonName}</p>
          </div>
        </div>
        <div className="flex lg:flex-row flex-wrap lg:items-center gap-2 lg:gap-4">
          <div className="w-24">
            <Label className="text-nowrap shrink-0 text-neutral-700">
              Lot No.
            </Label>
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
            <Label className="text-nowrap shrink-0 text-neutral-700">
              Rough Pcs. & Cts.
            </Label>
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
            <Label className="text-nowrap shrink-0 text-neutral-700">
              Lot Size
            </Label>
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
            <Label>Labour</Label>
            <Input
              type="number"
              step="0.01"
              {...register("labour", { valueAsNumber: true })}
              className={cn(
                errors.labour?.message &&
                  "border border-red-500 placeholder:text-red-500"
              )}
              disabled
              placeholder="50"
            />
          </div>
          <div className="w-20">
            <Label>Net %</Label>
            <Input
              type="number"
              step="0.01"
              {...register("netPercent", { valueAsNumber: true })}
              className={cn(
                errors.netPercent?.message &&
                  "border border-red-500 placeholder:text-red-500"
              )}
              disabled
              placeholder="106"
            />
          </div>
          <div className="w-80">
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

      {/* <div
        className={`p-3 border border-neutral-300 rounded-lg shadow-sm mb-4 ${
          loadingMixLot ? "animate-pulse bg-neutral-100" : ""
        }`}
      >
        <div className="grid grid-cols-4 gap-x-3 gap-y-4">
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
              className="w-full"
            />
          </div>
        </div>
      </div> */}

      <div className="mt-4 overflow-hidden rounded-lg border border-neutral-300 shadow-sm">
        <MixLotDetails
          lotNo={watch("lotNo")}
          isDataLoading={loadingMixLot}
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

      {!mainLotId && (
        <div
          className={`p-3 border border-neutral-300 rounded-lg shadow-sm mt-4 mb-10 ${
            loadingMixLot ? "animate-pulse bg-neutral-100" : ""
          }`}
        >
          <div className="grid grid-cols-4 gap-x-6 gap-y-3">
            <div className="flex w-full max-w-sm items-center gap-2">
              <Label className="text-nowrap w-32">Sale Price</Label>
              <Input
                type="number"
                {...register("salePrice", { valueAsNumber: true })}
                step={0.01}
                className="w-full"
              />
            </div>

            <div className="flex w-full max-w-sm items-center gap-2">
              <Label className="text-nowrap w-32">Bid Price</Label>
              <Input
                type="number"
                step={0.01}
                {...register("bidPrice", { valueAsNumber: true })}
                readOnly
                disabled
                className="w-full"
              />
            </div>
            <div className="flex w-full max-w-sm items-center gap-2">
              <Label className="text-nowrap w-32">Result Total</Label>
              <Input
                type="number"
                {...register("resultTotal", { valueAsNumber: true })}
                step={0.01}
                className={cn(
                  errors.resultTotal?.message &&
                    "border border-red-500 placeholder:text-red-500"
                )}
                onChange={(e) => {
                  const value = e.target.value
                    ? parseFloat(e.target.value)
                    : undefined;

                  if (value) {
                    if (!isNaN(value)) {
                      let resultPerCarat = 0;
                      if (roughCts) {
                        if (!isNaN(roughCts)) {
                          resultPerCarat = parseFloat(
                            (value / roughCts).toFixed(2)
                          );
                        }
                      }

                      if (!isNaN(resultPerCarat)) {
                        setValue("resultPerCarat", resultPerCarat);
                        const resultPercent = parseFloat(
                          ((netPercent - 100) / 100).toFixed(2)
                        );
                        let resultCost = 0;
                        if (roughCts) {
                          resultCost = parseFloat(
                            (
                              (((resultPerCarat * resultPercent +
                                resultPerCarat +
                                labour) *
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
              <Label className="text-nowrap w-32">Sale Amount</Label>
              <Input
                type="number"
                {...register("saleAmount", { valueAsNumber: true })}
                step={0.01}
                className="w-full"
              />
            </div>
            <div className="flex w-full max-w-sm items-center gap-2">
              <Label className="text-nowrap w-32">Total Amount</Label>
              <Input
                type="number"
                step={0.01}
                {...register("totalAmount", { valueAsNumber: true })}
                readOnly
                disabled
                className="w-full"
              />
            </div>

            <div className="flex w-full max-w-sm items-center gap-2">
              <Label className="text-nowrap w-32">Result / Cts</Label>
              <Input
                type="number"
                {...register("resultPerCarat", { valueAsNumber: true })}
                step={0.01}
                className={cn(
                  errors.resultPerCarat?.message &&
                    "w-full border border-rexd-500 placeholder:text-red-500"
                )}
                onChange={(e) => {
                  const value = e.target.value
                    ? parseFloat(e.target.value)
                    : undefined;

                  const resultTotal = parseFloat(
                    ((value ?? 0) * roughCts).toFixed(2)
                  );
                  setValue("resultTotal", resultTotal);

                  const resultPercent = parseFloat(
                    ((netPercent - 100) / 100).toFixed(2)
                  );

                  const resultCost = parseFloat(
                    (
                      ((((value ?? 0) * resultPercent + (value ?? 0) + labour) *
                        totalValues.carats) /
                        totalValues.polCts +
                        230) /
                      0.97
                    ).toFixed(2)
                  );
                  setValue("resultCost", resultCost);
                }}
              />
            </div>
            <div />
            <div />
            <div />
            <div className="flex w-full max-w-sm items-center gap-2">
              <Label className="text-nowrap w-32">Result Cost</Label>
              <Input
                type="number"
                step={0.01}
                {...register("resultCost", { valueAsNumber: true })}
                readOnly
                disabled
              />
            </div>
          </div>
        </div>
      )}
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
