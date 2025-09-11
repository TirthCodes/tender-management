import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LinkLoadingIndicator } from "./link-loading-indicator";

export function PageHeader({
  title,
  handleDialog,
  createPath,
  mainLotInfo,
  isBackButton = true,
}: {
  title: string;
  handleDialog?: () => void;
  createPath?: string;
  mainLotInfo?: React.ReactNode;
  isBackButton?: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {isBackButton && (
          <Button
            variant={"ghost"}
            size="icon"
            className="rounded-full border"
            onClick={() => router.back()}
          >
            <ArrowLeft />
          </Button>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
        {mainLotInfo}
      </div>
      {createPath ? (
        <Link
          className={`${buttonVariants({ variant: "default" })} rounded-sm`}
          href={createPath}
        >
          Create <LinkLoadingIndicator element={<PlusCircle />} />
        </Link>
      ) : (
        <Button className="rounded-sm" onClick={() => handleDialog?.()}>
          Create <PlusCircle />
        </Button>
      )}
    </div>
  );
}
