"use client";

import { Loader2 } from "lucide-react";
import { useLinkStatus } from "next/link";

export function LinkLoadingIndicator({ element }: { element?: React.ReactNode }) {
  const { pending } = useLinkStatus();
  return pending ? <Loader2 className="h-4 w-4 animate-spin" /> : element;
}
