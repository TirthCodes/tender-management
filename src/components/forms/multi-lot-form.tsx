"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import { FormButtons } from "../common/form-buttons";
import { invalidateQuery } from "@/lib/invalidate";
import { RoughMultiLotColumns } from "@/app/(protected)/tenders/multi-lot/rough/columns";
import { createMultiLotTender } from "@/services/multi-lot";
import { MixMultiLotColumns } from "@/app/(protected)/tenders/multi-lot/mix/columns";
import { useSearchParams } from "next/navigation";

const multiLotFormSchema = z.object({
  stName: z.string().min(1, "Name is required"),
  stRemarks: z.optional(z.string().min(1, "Remarks is required")),
  stLotNo: z.string().min(1, "Lot No is required"),
  inPcs: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Pcs is required")
  ),
  dcCts: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Carats is required")
  ),
});

type TenderFormSchema = z.infer<typeof multiLotFormSchema> & {
  id?: number;
};

export function MultiLotForm({
  editData,
  setDialogOpen,
  tenderType,
}: {
  editData: RoughMultiLotColumns | MixMultiLotColumns | null;
  setDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  tenderType: string;
}) {
  const searchParams = useSearchParams();
  const baseTenderId = searchParams.get("baseTenderId") as string;

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(multiLotFormSchema),
    defaultValues: editData
      ? {
          ...editData,
          stRemarks: editData.stRemarks ?? "",
        }
      : {
          stName: "",
          stRemarks: "",
          stLotNo: "",
          inPcs: 0,
          dcCts: 0,
        },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createMultiLotTender,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        invalidateQuery(`${tenderType}-multi-lot-tenders`);
        reset();
        if (editData && setDialogOpen) {
          setDialogOpen(false);
        }
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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

  const onSubmit = async (data: TenderFormSchema) => {
    try {
      const tenderId = parseInt(baseTenderId);
      if (editData?.id) {
        mutate({
          ...data,
          stTenderType: tenderType,
          id: editData.id,
          baseTenderId: tenderId,
        });
      } else {
        mutate({ ...data, stTenderType: tenderType, baseTenderId: tenderId });
      }
    } catch (error) {
      console.error(
        "Failed to handle tender submission:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  return (
    <form
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1 col-span-2">
          <label className="text-sm font-medium">Main Lot Name</label>
          <Input {...register("stName")} required />
          {errors?.stName && (
            <p className="text-sm text-red-500">
              {errors?.stName?.message?.toString()}
            </p>
          )}
        </div>
        <div className="space-y-1 col-span-2">
          <label className="text-sm font-medium">Main Lot No</label>
          <Input {...register("stLotNo")} required />
          {errors?.stLotNo && (
            <p className="text-sm text-red-500">{errors.stLotNo?.message}</p>
          )}
        </div>
        <div className="space-y-1 col-span-2">
          <label className="text-sm font-medium">Lot Remark</label>
          <Input {...register("stRemarks")} required />
          {errors.stRemarks && (
            <p className="text-sm text-red-500">{errors?.stRemarks.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Pcs</label>
          <Input type="number" {...register("inPcs")} required />
          {errors.inPcs && (
            <p className="text-sm text-red-500">{errors?.inPcs.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Carats</label>
          <Input type="number" step="0.01" {...register("dcCts")} required />
          {errors.dcCts && (
            <p className="text-sm text-red-500">{errors?.dcCts.message}</p>
          )}
        </div>
      </div>

      <FormButtons isPending={isPending} submitText={"Submit"} />
    </form>
  );
}
