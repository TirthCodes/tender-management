"use client"

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { PageWrapper } from '../common/page-wrapper';
import { PageHeader } from '../common/page-header';
import { FormDialog } from '../common/form-dialog';
import { TenderDataTable } from '../ui/tender-data-table';
import { Pagination } from '../common/pagination';

export function RoughLotTendersPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<null>(null);
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const queryKey = "rought-lot-tenders";

  const { data: roughLotResponse } = useQuery({
    queryKey: [queryKey, id, page],
    // queryFn: () => getTenders(page),
    initialData: {
      // data: tenders,
      success: true,
      message: "Success",
      nextPage: 2,
      totalCount: 20,
    },
  });

  console.log(roughLotResponse, "roughLotResponse");

  const handleDialog = () => {
    setEditData?.(null);
    setDialogOpen?.(true);
  };

  return (
    <PageWrapper>
      <PageHeader title="Rough Lot Tenders" handleDialog={handleDialog} />
      <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        action={editData ? "Edit" : "Add"}
        title={"Rough Lot Tender"}
      >
        <></> {/* form */}
      </FormDialog>
      <TenderDataTable
        columns={[]}
        data={[]}
        isDialog={true}
        setEditDialogOpen={setDialogOpen}
        setEditData={setEditData}
        queryKey={queryKey}
      />
      <Pagination 
        setPage={setPage}
        nextPage={2}
        page={page}
      />
    </PageWrapper>
  )
}
