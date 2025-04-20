"use client";

import { columns, TenderColumns } from "@/app/(protected)/tenders/columns";
import { FormDialog } from "@/components/common/form-dialog";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/common/page-wrapper";
import { TenderDataTable } from "@/components/ui/tender-data-table";
import { getTenders } from "@/services/tender";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

export function TendersPage({
  tenders,
  totalCount,
}: {
  tenders: TenderColumns[];
  totalCount: number;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<TenderColumns | null>(null);

  const queryKey = "tenders";

  const { data: tendersResponse } = useQuery({
    queryKey: [queryKey],
    queryFn: getTenders,
    initialData: {
      data: tenders,
      success: true,
      message: "Success",
      nextPage: totalCount > 10 ? 2 : null,
      totalCount,
    },
  });

  return (
    <PageWrapper>
      <PageHeader title="Tenders" setDialogOpen={setDialogOpen} />
      <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        action={"Add"}
        title={"title"}
      >
        <></> {/* form */}
      </FormDialog>
      <TenderDataTable
        columns={columns}
        data={tendersResponse?.data || []}
        isDialog={true}
        setEditData={setEditData}
        queryKey={queryKey}
      />
    </PageWrapper>
  );
}
