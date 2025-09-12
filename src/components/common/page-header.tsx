"use client";

import { Button, buttonVariants } from "../ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LinkLoadingIndicator } from "./link-loading-indicator";
import { Input } from "../ui/input";

export function PageHeader({
  title,
  handleDialog,
  createPath,
  mainLotInfo,
  isBackButton = true,
  isSearch = false,
}: {
  title: string;
  handleDialog?: () => void;
  createPath?: string;
  mainLotInfo?: React.ReactNode;
  isBackButton?: boolean;
  isSearch?: boolean;
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
        <h1 className="text-xl lg:text-2xl font-bold">{title}</h1>
        {mainLotInfo}
      </div>
      <div className="flex items-center gap-2"> 
        {isSearch &&
          <Input
            
          />
        }
        {createPath ? (
          <Link
            className={`${buttonVariants({
              variant: "default",
            })} px-2 lg:px-4 h-7 lg:h-9 bg-neutral-800 rounded-sm`}
            href={createPath}
          >
            Create <LinkLoadingIndicator element={<PlusCircle />} />
          </Link>
        ) : (
          <Button
            className="rounded-sm bg-neutral-800 h-7 lg:h-9 px-2 lg:px-4"
            onClick={() => handleDialog?.()}
          >
            Create <PlusCircle />
          </Button>
        )}
      </div>
    </div>
  );
}
