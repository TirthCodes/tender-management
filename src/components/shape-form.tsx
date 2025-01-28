"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createShape, updateShape } from "@/app/tenders/shapes/actions";
import { Shape } from "@/app/tenders/shapes/columns";

export function ShapeForm({
  initialData,
  onSuccess,
}: {
  initialData?: Shape;
  onSuccess?: () => void;
}) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
      if (initialData) {
        await updateShape(initialData.id, formData);
      } else {
        await createShape(formData);
      }
      router.refresh();
      onSuccess?.();
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-md">
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
      <Button type="submit">{initialData ? "Update" : "Create"}</Button>
    </form>
  );
}
