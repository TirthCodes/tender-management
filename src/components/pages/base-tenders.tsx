"use client";

import { columns, TenderColumns } from "@/app/(protected)/tenders/columns";
import { FormDialog } from "@/components/common/form-dialog";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Pagination } from "@/components/common/pagination";
import { TenderDataTable } from "@/components/ui/tender-data-table";
import { getBaseTenders } from "@/services/base-tender";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { BaseTenderForm } from "../forms/base-tender-form";

export function BaseTendersPage({
  tenders,
  totalCount,
}: {
  tenders: TenderColumns[];
  totalCount: number;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<TenderColumns | null>(null);
  const [page, setPage] = useState(1);

  const queryKey = "tenders";

  const { data: tendersResponse } = useQuery({
    queryKey: [queryKey, page],
    queryFn: () => getBaseTenders(page),
    initialData: {
      data: tenders,
      success: true,
      message: "Success",
      nextPage: totalCount > 10 ? 2 : null,
      totalCount,
    },
  });

  const handleDialog = () => {
    setEditData?.(null);
    setDialogOpen?.(true);
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Base Tenders"
        handleDialog={handleDialog}
      />
      <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        action={editData ? "Edit" : "Add"}
        title={editData ? editData.stTenderName : "Tender"}
        widthClass="md:max-w-[30dvw] md:w-[30dvw]"
      >
        <BaseTenderForm editData={editData} setDialogOpen={setDialogOpen} />
      </FormDialog>
      <TenderDataTable
        columns={columns}
        data={tendersResponse?.data || []}
        isDialog={true}
        setEditDialogOpen={setDialogOpen}
        setEditData={setEditData}
        queryKey={queryKey}
        deleteEndpoint="/api/tender"
      />
      <Pagination
        setPage={setPage}
        nextPage={tendersResponse?.nextPage}
        page={page}
      />
    </PageWrapper>
  );
}
