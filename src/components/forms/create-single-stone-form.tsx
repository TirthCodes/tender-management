"use client";

import { useRef, useState } from "react";
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
import { SingleStoneTenderDetails, TotalValues } from "@/lib/types/tender";
import Link from "next/link";
import { SingleTenderDataTable } from "../pages/create-tender/single-tender-data-table";
import useKeyPress from "@/hooks/useKeyPress";

export const singleInitialRow: SingleStoneTenderDetails = {
  lotNo: "",
  roughName: "",
  roughPcs: 0,
  roughCts: 0,
  roughSize: 0,
  roughPrice: 0,
  roughTotal: 0,
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
  bidPrice: 0,
  totalAmount: 0,
  resultCost: 0,
  resultPerCarat: 0,
  resultTotal: 0,
  // finalBidPrice: 0,
};

interface CreateTenderFormProps {
  colorOptions: Option[];
  clarityOptions: Option[];
  fluorescenceOptions: Option[];
  shapeOptions: Option[];
  tenderData: {
    dtVoucherDate: Date;
    stTenderName: string;
    stPersonName: string;
    dcNetPercentage: number;
    dcLabour: number;
  };
}

const createTenderSchema = z.object({
  // voucherDate: z.string(),
  // tenderType: z.string(),
  // tenderName: z.string().trim().min(2, { message: "Tender name is required!" }),
  // personName: z.string().trim().min(2, { message: "Person name is required!" }),
  netPercent: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Net Percentage is required")
  ),
  labour: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Labour is required!" })
  ),
  remark: z.string().trim().optional(),
  // lotNo: z.string().trim().min(1, { message: "Lot no.is required!" }),
  // roughName: z.string().trim().min(2, { message: "Rough name is required!" }),
  // roughPcs: z.string().trim().min(1, { message: "Rough pcs is required!" }),
  // roughCts: z.string().trim().min(1, { message: "Rough cts is required!" }),
  // roughSize: z.string().trim().min(1, { message: "Rough size is required!" }),
  // roughPrice: z.string().trim().min(1, { message: "Rough price is required!" }),
  // roughTotal: z.string().trim().min(1, { message: "Rough total is required!" }),
  // bidPrice: z.number().min(1, { message: "Bid price is required!" }),
  // totalAmount: z.number().min(1, { message: "Total amount is required!" }),
  // resultCost: z.number().optional(),
  // resultPerCarat: z
  //   .number()
  //   .min(1, { message: "Result per carat is required!" }),
  // resultTotal: z.string().min(1, { message: "Result total is required!" }),
});

type CreateTenderFormValues = z.infer<typeof createTenderSchema>;

export function CreateSingleStoneTenderForm({
  colorOptions,
  clarityOptions,
  fluorescenceOptions,
  shapeOptions,
  tenderData,
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
    // setValue,
    // setError,
  } = useForm<CreateTenderFormValues>({
    mode: "onBlur",
    defaultValues: {
      // voucherDate: tenderData.dtVoucherDate.toLocaleDateString(),
      // tenderName: tenderData.stTenderName,
      // personName: tenderData.stPersonName,
      netPercent: tenderData.dcNetPercentage,
      labour: tenderData.dcLabour,
      remark: "",
    },
    resolver: zodResolver(createTenderSchema),
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  const [isPending, setIsPending] = useState(false);

  const [tenderDetails, setTenderDetails] = useState<
    SingleStoneTenderDetails[]
  >([singleInitialRow]);
  // const [calendarOpen, setCalendarOpen] = useState(false);
  // const [date, setDate] = useState<Date>();
  const [totalValues, setTotalValues] = useState<TotalValues>({
    pcs: 0,
    carats: 0,
    polCts: 0,
    polPercent: 0,
    salePrice: 0,
    costPrice: 0,
    topsAmount: 0,
  });

  // useEffect(() => {
  //   if (date) {
  //     setValue("voucherDate", date.toLocaleDateString());
  //     if (errors.voucherDate) {
  //       setError("voucherDate", {
  //         message: undefined,
  //       });
  //     }
  //   } else if (tenderData.dtVoucherDate) {
  //     setDate(tenderData.dtVoucherDate)
  //   }
  // }, [date, setValue, errors, setError, tenderData]);

  const netPercent = watch("netPercent");
  const labour = watch("labour");

  // useEffect(() => {
  //   if (netPercent && labour) {
  //     const netPercentValue = parseFloat(netPercent);
  //     const labourValue = parseFloat(labour);

  //     const netPercentage = netPercentValue / 100;

  //     const calculatedBidPrice = parseFloat(
  //       (
  //         ((((totalValues.costPrice + totalValues.topsAmount) * 0.97 - 180) *
  //           totalValues.polCts) /
  //           totalValues.carats -
  //           labourValue) /
  //         netPercentage
  //       ).toFixed(2)
  //     );

  //     if (!isNaN(calculatedBidPrice)) {
  //       setValue("bidPrice", calculatedBidPrice);
  //       const totalAmount = parseFloat(
  //         (totalValues.carats * calculatedBidPrice).toFixed(2)
  //       );
  //       if (!isNaN(totalAmount)) {
  //         setValue("totalAmount", totalAmount);
  //       }
  //     }

  //     if (resultTotal) {
  //       const resultTotalValue = parseFloat(resultTotal);
  //       if (!isNaN(resultTotalValue)) {
  //         const resultPerCarat = parseFloat(
  //           (resultTotalValue / totalValues.carats).toFixed(2)
  //         );

  //         if (!isNaN(resultPerCarat)) {
  //           setValue("resultPerCarat", resultPerCarat);
  //           const resultCost = parseFloat(
  //             (
  //               (((resultPerCarat * 0.06 + resultPerCarat + labourValue) *
  //                 totalValues.carats) /
  //                 totalValues.polCts +
  //                 180) /
  //                 0.97 -
  //               totalValues.topsAmount
  //             ).toFixed(2)
  //           );
  //           if (!isNaN(resultCost)) {
  //             setValue("resultCost", resultCost);
  //           }
  //         }
  //       }
  //     }

  //     if (bidPrice) {
  //       if (!isNaN(bidPrice)) {
  //         const finalCostPrice = parseFloat(
  //           (
  //             (((bidPrice * 0.06 + bidPrice + labourValue) *
  //               totalValues.carats) /
  //               totalValues.polCts +
  //               180) /
  //               0.97 -
  //             totalValues.topsAmount
  //           ).toFixed(2)
  //         );

  //         console.log(finalCostPrice, "finalCostPrice")

  // if (!isNaN(finalCostPrice)) {
  //   setValue("finalCostPrice", finalCostPrice);
  // }

  // const finalTotalAmount = parseFloat(
  //   (finalBidPriceValue * totalValues.carats).toFixed(2)
  // );
  // if (!isNaN(finalTotalAmount)) {
  //   setValue("finalTotalAmount", finalTotalAmount);
  // }
  //       }
  //     }
  //   }
  // }, [
  //   labour,
  //   totalValues,
  //   setValue,
  //   netPercent,
  //   resultTotal,
  //   bidPrice,
  //   roughCts,
  // ]);

  // const finalBidPriceDetails = tenderDetails?.finalBidPrice;
  // const resultTotalDetails = tenderDetails?.resultTotal;

  // useEffect(() => {
  //   if(finalBidPriceDetails) {
  //     setValue("finalBidPrice", String(tenderDetails?.finalBidPrice));
  //   }
  //   if(resultTotalDetails) {
  //     setValue("resultTotal", String(tenderDetails?.resultTotal));
  //   }
  // }, [
  //   tenderDetails,
  //   finalBidPriceDetails,
  //   resultTotalDetails,
  //   setValue,
  // ]);

  const handleDetailsValueChange = (
    value: SingleStoneTenderDetails,
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

  useKeyPress({ backPath: "/tenders", ref: formRef });

  async function onSubmit(data: CreateTenderFormValues) {
    setIsPending(true);

    console.log(data, "datra");

    // const payload = {
    //   ...data,
    //   tenderId: tenderDetails.lotNo,
    //   pcs: tenderDetails.roughName,
    //   carats: tenderDetails.roughPcs,
    //   tenderDetails: tenderDetails,
    // };

    // const response = await createSingleTender(payload);
    // if (response.success) {
    //   toast.success(response.message);
    //   redirect("/tenders");
    // } else {
    //   toast.error(response.message);
    // }
    // setIsPending(false);
  }

  // ( ( ( ( ( ( ( ( Res. Per Carat * 6 % ) + Res. Per Carat ) + 50 ) * Rou. Wt. ) / Pol. Wt.) + 180 ) / 97 % ) - Top Amount )
  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center flex-col md:flex-row md:justify-between px-4 py-2 border border-neutral-300 rounded-lg shadow-sm">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">Single Stone Tender</h1>
          <div className="flex items-center gap-2 text-neutral-700">
            <p className="pr-2 border-r-2">
              {tenderData.dtVoucherDate.toDateString()}
            </p>
            <p className="pr-2 border-r-2">{tenderData.stTenderName}</p>
            <p>{tenderData.stPersonName}</p>
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

      <div className="mt-4 overflow-hidden rounded-lg border border-neutral-300 shadow-sm">
        <SingleTenderDataTable
          totalValues={totalValues}
          setTotalValues={setTotalValues}
          handleValueChange={handleDetailsValueChange}
          data={tenderDetails}
          colors={colorsOptions?.data}
          clarities={claritiesOptions?.data}
          fluorescences={fluorescencesOptions?.data}
          shapes={shapesOptions?.data}
          labourValue={labour}
          netPercernt={netPercent}
        />
      </div>

      {/* <div className="grid grid-cols-1 mt-4">
        <Card>
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
      </div> */}
      <div className="flex justify-end gap-2 items-center">
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

// Pol % - (cts * 100) / polcts
// PolCts - (pol% * cts) / 100
// Sale Amount - (PolCts * salePricr)
// Sale Price - (Sale Amount / polcts)
