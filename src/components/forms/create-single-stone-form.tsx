"use client";

import { useEffect, useRef, useState } from "react";
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
import { createSingleTender } from "@/services/single-stone";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getSingleStoneTender } from "@/services/single-stone";

export const singleInitialRow: SingleStoneTenderDetails = {
  lotNo: "",
  roughPcs: 0,
  roughCts: 0,
  roughSize: 0,
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
  topsAmount: 0,
  incription: "",
  bidPrice: 0,
  totalAmount: 0,
  resultCost: 0,
  resultPerCarat: 0,
  resultTotal: 0,
};

interface CreateTenderFormProps {
  colorOptions: Option[];
  clarityOptions: Option[];
  fluorescenceOptions: Option[];
  shapeOptions: Option[];
  baseTenderData: {
    dtVoucherDate: Date;
    stTenderName: string;
    stPersonName: string;
    dcNetPercentage: number;
    dcLabour: number;
    id: number;
  };
}

const createTenderSchema = z.object({
  netPercent: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Net Percentage is required")
  ),
  labour: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Labour is required!" })
  ),
  remark: z.string().trim().optional(),
});

type CreateTenderFormValues = z.infer<typeof createTenderSchema>;

export function CreateSingleStoneTenderForm({
  colorOptions,
  clarityOptions,
  fluorescenceOptions,
  shapeOptions,
  baseTenderData,
}: CreateTenderFormProps) {
  const { data: tenderRowsData, isLoading: isRowsLoading } = useQuery({
    queryKey: ["single-stone-tender-rows", baseTenderData.id],
    queryFn: () => getSingleStoneTender(baseTenderData.id),
    enabled: !!baseTenderData.id,
  });

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
    reset,
    formState: { errors },
  } = useForm<CreateTenderFormValues>({
    mode: "onBlur",
    defaultValues: {
      netPercent: baseTenderData.dcNetPercentage,
      labour: baseTenderData.dcLabour,
      remark: "",
    },
    resolver: zodResolver(createTenderSchema),
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  const [isPending, setIsPending] = useState(false);

  const [tenderDetails, setTenderDetails] = useState<
    SingleStoneTenderDetails[]
  >([]);

  useEffect(() => {
    if (tenderRowsData && !isRowsLoading) {
      setTenderDetails(
        tenderRowsData?.data?.singleTenderDetails || [singleInitialRow]
      );
      reset({
        remark: tenderRowsData?.data?.stRemark,
        netPercent: tenderRowsData?.data?.dcNetPercentage,
        labour: tenderRowsData?.data?.dcLabour,
      });
    } else {
      setTenderDetails([singleInitialRow]);
    }
  }, [tenderRowsData, isRowsLoading, reset]);

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

  const totalSalePrice = totalValues.saleAmount / totalValues.polCts;

  const netPercent = watch("netPercent");
  const labour = watch("labour");

  const handleDetailsValueChange = (
    value: SingleStoneTenderDetails,
    index: number,
    action?: string
  ) => {
    if (action === "delete") {
      setTenderDetails(tenderDetails?.filter((_i, idx) => idx !== index));
      return;
    }
    if (index > tenderDetails?.length) {
      setTenderDetails([...tenderDetails, value]);
      return;
    }
    const indexToUpdate = tenderDetails?.findIndex((_i, idx) => idx === index);
    setTenderDetails(
      tenderDetails?.map((item, i) => {
        if (i === indexToUpdate) {
          return value;
        }
        return item;
      })
    );
  };

  useKeyPress({ backPath: "/tenders", ref: formRef });

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

  const router = useRouter();

  async function onSubmit(data: CreateTenderFormValues) {
    if (totalValues.pcs <= 0) {
      toast.error("Pcs should be greater than 0");
      return;
    }
    setIsPending(true);

    const payload = {
      ...data,
      //id: baseTenderData.id, // replace with actual singleTenderID
      baseTenderId: baseTenderData.id,
      roughPcs: totalValues.pcs,
      roughCts: totalValues.carats,
      rate: 0,
      amount: 0,
      tenderDetails: JSON.stringify(tenderDetails), //array of singleTenderDetails
    };

    console.log({ payload });

    const response = await createSingleTender(payload);
    if (response.success) {
      toast.success(response.message);
      router.push("/tenders");
    } else {
      toast.error(response.message);
    }
    setIsPending(false);
  }

  // if(isRowsLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-[90dvh]">
  //       <Loader2 className="h-20 w-20 animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center flex-col md:flex-row md:justify-between px-4 py-2 border border-neutral-300 rounded-lg shadow-sm">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">Single Stone Tender</h1>
          <div className="flex items-center gap-2 text-neutral-700">
            <p className="pr-2 border-r-2">
              {baseTenderData.dtVoucherDate.toDateString()}
            </p>
            <p className="pr-2 border-r-2">{baseTenderData.stTenderName}</p>
            <p>{baseTenderData.stPersonName}</p>
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
              defaultValue={50}
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

      <div className="mt-4 overflow-hidden rounded-lg border border-neutral-300 shadow-sm">
        <SingleTenderDataTable
          // totalValues={totalValues}
          isRowsLoading={isRowsLoading}
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
      {/* total values */}
      <div
        className={`mt-2 flex items-center justify-around gap-x-6 gap-y-2 flex-wrap w-full px-4 py-2 border border-neutral-300 rounded-lg shadow-sm ${
          isRowsLoading ? "animate-pulse bg-neutral-50" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Rows:</p>
          <p className="font-semibold">{tenderDetails.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Pcs:</p>
          <p className="font-semibold">{totalValues.pcs}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Carats:</p>
          <p className="font-semibold">{totalValues.carats?.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Polish Carats:</p>
          <p className="font-semibold">{totalValues.polCts?.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Sale Price:</p>
          <p className="font-semibold">
            {isNaN(totalSalePrice) ? 0 : totalSalePrice.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Cost Price:</p>
          <p className="font-semibold">{totalValues.costPrice?.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-nowrap">Total Amount:</p>
          <p className="font-semibold">{totalValues.totalAmount?.toFixed(2)}</p>
        </div>
      </div>

      <div className="fixed bottom-4 left-0 right-4 flex justify-end gap-2 items-center">
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
