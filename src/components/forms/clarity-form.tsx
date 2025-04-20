"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClarity, updateClarity } from "@/app/(protected)/clarity/actions";
import { Clarity } from "@/app/(protected)/clarity/columns";
import { toast } from "react-toastify";
import { getQueryClient } from "@/app/providers";
import { useState } from "react";

export function ClarityForm({
  initialData,
  closeDialog,
}: {
  initialData?: Clarity;
  closeDialog?: () => void;
}) {
  
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    setIsPending(true);

    try {
      const formData = new FormData(e.currentTarget);
      const queryClient = getQueryClient();

      if (initialData) {
        const response = await updateClarity(initialData.id, formData);
        if (response.success) {
          toast.success(response.message);
          queryClient.invalidateQueries({ queryKey: ["clarity-options"] });
          closeDialog?.();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await createClarity(formData);
        if (response.success) {
          toast.success(response.message);
          queryClient.invalidateQueries({ queryKey: ["clarity-options"] });
          if(e.currentTarget) {
            e.currentTarget.reset()
          }
        } else {
          toast.error(response.message);
        }
      }
      router.refresh();
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-1">
        <label className="text-sm font-medium">Name</label>
        <Input
          name="stName"
          required
          defaultValue={initialData?.stName || ""}
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Short Name</label>
        <Input
          name="stShortName"
          required
          defaultValue={initialData?.stShortName || ""}
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Serial</label>
        <Input
          name="inSerial"
          type="number"
          required
          defaultValue={initialData?.inSerial || ""}
        />
      </div>
      <Button disabled={isPending} type="submit">{initialData ? "Update" : "Create"}</Button>
    </form>
  );
}
