"use client"

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { PageWrapper } from '../common/page-wrapper';
import { PageHeader } from '../common/page-header';
import { FormDialog } from '../common/form-dialog';
import { TenderDataTable } from '../ui/tender-data-table';
import { Pagination } from '../common/pagination';

export function SingleStoneTendersPage() {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<null>(null);
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const queryKey = "single-stone-tenders";

  const { data: singleStoneResponse } = useQuery({
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

  console.log(singleStoneResponse, "singleStoneResponse");

  return (
    <PageWrapper>
      <PageHeader title="Single Stone Tenders" setDialogOpen={setDialogOpen} />
      <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        action={editData ? "Edit" : "Add"}
        title={"Single Stone Tender"}
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
