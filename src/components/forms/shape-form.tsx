"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createShape, updateShape } from "@/app/(protected)/shapes/actions";
import { Shape } from "@/app/(protected)/shapes/columns";
import { useRef, useState } from "react";
import { getQueryClient } from "@/app/providers";
import { toast } from "react-toastify";

export function ShapeForm({
  initialData,
  closeDialog,
}: {
  initialData?: Shape;
  closeDialog?: () => void;
}) {
  const [isPending, setIsPending] = useState(false);
  
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    setIsPending(true);

    try {
      const formData = new FormData(e.currentTarget);
      const queryClient = getQueryClient();

      if (initialData) {
        const response = await updateShape(initialData.id, formData);
        if (response.success) {
          toast.success(response.message);
          queryClient.invalidateQueries({ queryKey: ["shape-options"] });
          closeDialog?.();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await createShape(formData);
        if (response.success) {
          toast.success(response.message);
          queryClient.invalidateQueries({ queryKey: ["shape-options"] });
          if(formRef.current) {
            formRef.current.reset() 
          }
        } else {
          toast.error(response.message);
        }
      }
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error submitting form");
      console.error("Form submission failed:", error);
    } finally { 
      setIsPending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 max-w-md">
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
