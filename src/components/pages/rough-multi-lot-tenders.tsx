"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { PageWrapper } from "../common/page-wrapper";
import { PageHeader } from "../common/page-header";
import { TenderDataTable } from "../ui/tender-data-table";
import { Pagination } from "../common/pagination";
import { columns, RoughMultiLotColumns } from "@/app/(protected)/tenders/multi-lot/rough/columns";
import { FormDialog } from "../common/form-dialog";
import { MultiLotForm } from "../forms/multi-lot-form";
import { getMultiLotTenders } from "@/services/multi-lot";

export function RoughMultiLotTendersPage({ tenders, totalCount }: { tenders: RoughMultiLotColumns[], totalCount: number }) {
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const id = searchParams.get("tenderId");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<RoughMultiLotColumns | null>(null);

  const queryKey = "rough-multi-lot-tenders";

  const { data: multiLotResponse } = useQuery({
    queryKey: [queryKey, id, page],
    queryFn: () => getMultiLotTenders(page, "rough"),
    initialData: {
      data: tenders,
      success: true,
      message: "Success",
      nextPage: totalCount > 10 ? 2 : null,
      totalCount: 20,
    },
  });

  const handleDialog = () => {
    setEditData?.(null);
    setDialogOpen?.(true);
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Rough Multi Lot Tenders (Main Lot)"
        handleDialog={handleDialog}
      />
      <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        action={editData ? "Edit" : "Add"}
        title={editData ? editData.stName : "Main Lot"}
        widthClass="md:max-w-[35dvw] md:w-[35dvw]"
      >
        <MultiLotForm editData={editData} setDialogOpen={setDialogOpen} tenderType="rough" />
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
      <Pagination setPage={setPage} nextPage={multiLotResponse?.nextPage} page={page} />
    </PageWrapper>
  );
}
