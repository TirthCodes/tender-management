"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { PageWrapper } from "../common/page-wrapper";
import { PageHeader } from "../common/page-header";
import { TenderDataTable } from "../ui/tender-data-table";
import { Pagination } from "../common/pagination";
import { columns, MultiLotColumns } from "@/app/(protected)/tenders/multi-lot/columns";
import { FormDialog } from "../common/form-dialog";
import { MultiLotForm } from "../forms/multi-lot-form";
import { getMultiLotTenders } from "@/services/multi-lot";

export function MultiLotTendersPage({ tenders, totalCount }: { tenders: MultiLotColumns[], totalCount: number }) {
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const id = searchParams.get("tenderId");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<MultiLotColumns | null>(null);

  const queryKey = "multi-lot-tenders";

  const { data: multiLotResponse } = useQuery({
    queryKey: [queryKey, id, page],
    queryFn: () => getMultiLotTenders(page),
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
        title="Multi Lot Tenders"
        handleDialog={handleDialog}
      />
      <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        action={editData ? "Edit" : "Add"}
        title={editData ? editData.stName : "Tender"}
        widthClass="md:max-w-[35dvw] md:w-[35dvw]"
      >
        <MultiLotForm editData={editData} setDialogOpen={setDialogOpen} />
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
