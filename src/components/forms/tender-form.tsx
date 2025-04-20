"use client";

import { createTender } from "@/services/tender";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { TenderColumns } from "@/app/(protected)/tenders/columns";

const tenderFormSchema = z.object({
  dtVoucherDate: z.date().or(z.string()),
  stTenderName: z.string().min(1, "Tender name is required"),
  stPersonName: z.string().min(1, "Person name is required"),
  dcNetPercentage: z.number(), //TODO: getting error for number error in input
  dcLabour: z.number(), //TODO: getting error for number error in input
});

type TenderFormSchema = z.infer<typeof tenderFormSchema> & {
  id?: number;
};

export function TenderForm({
  editData,
}: {
  editData: TenderColumns | null;
}) {
  console.log(JSON.stringify(editData));
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(tenderFormSchema),
    defaultValues: editData
      ? {
        ...editData,
        dtVoucherDate: new Date(editData.dtVoucherDate).toISOString().split('T')[0]
      }
      : {
          dtVoucherDate: new Date(),
          stTenderName: "",
          stPersonName: "",
          dcNetPercentage: 0,
          dcLabour: 0,
        },
  });

  const createMutation = useMutation({
    mutationFn: createTender,
    onSuccess: () => {
      toast.success("Tender created successfully");
      reset();
    },
    onError: (error) => {
      toast.error("Error creating tender");
    },
  });

  const onSubmit = async (data: TenderFormSchema) => {
    try {
      if (editData?.id) {
        createMutation.mutate({ ...data, id: editData.id });
      } else {
        createMutation.mutate(data);
      }
    } catch (error) {
      console.error(
        "Failed to handle tender submission:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  };

  const isPending = createMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div className="space-y-1">
        <label className="text-sm font-medium">Voucher Date</label>
        <Input type="date" {...register("dtVoucherDate")} required />
        {errors.dtVoucherDate && (
          <p className="text-sm text-red-500">{errors.dtVoucherDate.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Tender Name</label>
        <Input {...register("stTenderName")} required />
        {errors.stTenderName && (
          <p className="text-sm text-red-500">{errors.stTenderName.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Person Name</label>
        <Input {...register("stPersonName")} required />
        {errors.stPersonName && (
          <p className="text-sm text-red-500">{errors.stPersonName.message}</p>
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

      <Button disabled={isPending} type="submit">
        {editData?.id ? "Update Tender" : "Create Tender"}
      </Button>
    </form>
  );
}
