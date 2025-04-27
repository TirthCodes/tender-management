"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import { TenderColumns } from "@/app/(protected)/tenders/columns";
import { FormButtons } from "../common/form-buttons";
import { invalidateQuery } from "@/lib/invalidate";
import { createBaseTender } from "@/services/base-tender";

const tenderFormSchema = z.object({
  dtVoucherDate: z.date().or(z.string()),
  stTenderName: z.string().min(1, "Tender name is required"),
  stPersonName: z.string().min(1, "Person name is required"),
  dcNetPercentage: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Net Percentage is required")
  ),
  dcLabour: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Labour is required")
  ),
});

type TenderFormSchema = z.infer<typeof tenderFormSchema> & {
  id?: number;
};

export function BaseTenderForm({
  editData,
  setDialogOpen,
}: {
  editData: TenderColumns | null;
  setDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(tenderFormSchema),
    defaultValues: editData
      ? {
          ...editData,
          dtVoucherDate: new Date(editData.dtVoucherDate)
            .toISOString()
            .split("T")[0],
        }
      : {
          dtVoucherDate: new Date(),
          stTenderName: "",
          stPersonName: "",
          dcNetPercentage: 0,
          dcLabour: 0,
        },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createBaseTender,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        invalidateQuery("tenders");
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

  const onSubmit = async (data: TenderFormSchema) => {
    try {
      if (editData?.id) {
        mutate({ ...data, id: editData.id });
      } else {
        mutate(data);
      }
    } catch (error) {
      console.error(
        "Failed to handle tender submission:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1 col-span-2">
          <label className="text-sm font-medium">Voucher Date</label>
          <Input type="date" {...register("dtVoucherDate")} required />
          {errors.dtVoucherDate && (
            <p className="text-sm text-red-500">
              {errors.dtVoucherDate.message}
            </p>
          )}
        </div>

        <div className="space-y-1 col-span-2">
          <label className="text-sm font-medium">Tender Name</label>
          <Input {...register("stTenderName")} required />
          {errors.stTenderName && (
            <p className="text-sm text-red-500">
              {errors.stTenderName.message}
            </p>
          )}
        </div>

        <div className="space-y-1 col-span-2">
          <label className="text-sm font-medium">Person Name</label>
          <Input {...register("stPersonName")} required />
          {errors.stPersonName && (
            <p className="text-sm text-red-500">
              {errors.stPersonName.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Net Percentage</label>
          <Input
            type="number"
            step="0.01"
            {...register("dcNetPercentage")}
            required
          />
          {errors.dcNetPercentage && (
            <p className="text-sm text-red-500">
              {errors.dcNetPercentage.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Labour</label>
          <Input type="number" step="0.01" {...register("dcLabour")} required />
          {errors.dcLabour && (
            <p className="text-sm text-red-500">{errors.dcLabour.message}</p>
          )}
        </div>
      </div>

      <FormButtons
        isPending={isPending}
        submitText={editData?.id ? "Update Tender" : "Create Tender"}
      />
    </form>
  );
}
