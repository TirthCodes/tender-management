"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { PageWrapper } from "../common/page-wrapper";
import { PageHeader } from "../common/page-header";
import { TenderDataTable } from "../ui/tender-data-table";
import { Pagination } from "../common/pagination";
import {
  columns,
  MixMultiLotColumns,
} from "@/app/(protected)/tenders/multi-lot/mix/columns";
import { FormDialog } from "../common/form-dialog";
import { MultiLotForm } from "../forms/multi-lot-form";
import { getMultiLotTenders } from "@/services/multi-lot";
import { OtherBaseTender } from "./rough-lot-tenders";

export function MixMultiLotTendersPage({
  tenders,
  totalCount,
  baseTender,
}: {
  tenders: MixMultiLotColumns[];
  totalCount: number;
  baseTender: OtherBaseTender;
}) {
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const id = searchParams.get("baseTenderId");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<MixMultiLotColumns | null>(null);

  const queryKey = "mix-multi-lot-tenders";

  const { data: multiLotResponse } = useQuery({
    queryKey: [queryKey, id, page],
    queryFn: () => getMultiLotTenders(page, "mix", id as string),
    initialData: {
      data: tenders,
      success: true,
      message: "Success",
      nextPage: totalCount > 10 ? 2 : null,
      totalCount: 20,
    },
    enabled: !!id,
  });

  const handleDialog = () => {
    setEditData?.(null);
    setDialogOpen?.(true);
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Mix Multi Lot Tenders (Main Lot)"
        handleDialog={handleDialog}
        backPath="/tenders"
      />
      <div className="flex items-center gap-2 text-neutral-700">
        <p className="pr-2 border-r-2">
          {baseTender.dtVoucherDate.toDateString()}
        </p>
        <p className="pr-2 border-r-2">{baseTender.stTenderName}</p>
        <p>{baseTender.stPersonName}</p>
      </div>
      <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        action={editData ? "Edit" : "Add"}
        title={editData ? editData.stName : "Main Lot"}
        widthClass="md:max-w-[35dvw] md:w-[35dvw]"
      >
        <MultiLotForm
          editData={editData}
          setDialogOpen={setDialogOpen}
          tenderType="mix"
        />
      </FormDialog>
      <TenderDataTable
        columns={columns}
        data={multiLotResponse?.data || []}
        isDialog={true}
        setEditDialogOpen={setDialogOpen}
        setEditData={setEditData}
        queryKey={queryKey}
        deleteEndpoint="multi-lot-tender"
      />
      <Pagination
        setPage={setPage}
        nextPage={multiLotResponse?.nextPage}
        page={page}
      />
    </PageWrapper>
  );
}
