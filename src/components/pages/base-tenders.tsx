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
import { PDFViewer } from "@react-pdf/renderer";
import { TenderPDF } from "../pdf-preview/tender-pdf";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { getSingleStoneTender } from "@/services/single-stone";
import { getRoughLotByBaseTenderId } from "@/services/rough-lot";
import { getMixLotByBaseTenderId } from "@/services/mix-lot";
import { getMultiLotTenderByBaseTenderId } from "@/services/multi-lot";

export function BaseTendersPage({
  tenders,
  totalCount,
}: {
  tenders: TenderColumns[];
  totalCount: number;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<TenderColumns | null>(null);
  const [pdfData, setPdfData] = useState<TenderColumns | null>(null);
  const [tenderId, setTenderId] = useState<number | null>(null);

  const [page, setPage] = useState(1);

  const [showPDFPreview, setShowPDFPreview] = useState(false);

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

  const { data: singleStoneTender, isLoading: isSingleStoneLoading } = useQuery({
    queryKey: ["single-stone-tender", tenderId],
    queryFn: () => getSingleStoneTender(tenderId as number),
    enabled: !!tenderId,
  });

  const { data: roughLotTender, isLoading: isRoughLotLoading } = useQuery({
    queryKey: ["rough-lot-by-base-tender", tenderId],
    queryFn: () => getRoughLotByBaseTenderId(tenderId as number),
    enabled: !!tenderId,
  });

  const { data: mixLotTender, isLoading: isMixLotLoading } = useQuery({
    queryKey: ["mix-lot-by-base-tender", tenderId],
    queryFn: () => getMixLotByBaseTenderId(tenderId as number),
    enabled: !!tenderId,
  });

  const { data: multiLotTenders, isLoading: isMultiLotLoading } = useQuery({
    queryKey: ["multi-lot-tender-by-base-tender", tenderId],
    queryFn: () => getMultiLotTenderByBaseTenderId(tenderId as number),
    enabled: !!tenderId,
  });

  const handlePdf = (id: number) => {
    setTenderId(id)
    const tender = tendersResponse?.data?.find((i: TenderColumns) => i.id === id);
    if (!tender) {
      return;
    }
    setPdfData(tender);
    setShowPDFPreview(true);
  };

  const isPdfDataLoading = isSingleStoneLoading || isRoughLotLoading || isMixLotLoading || isMultiLotLoading; 

  return (
    <PageWrapper>
      {showPDFPreview && pdfData && !isPdfDataLoading  && (
        <Dialog open={showPDFPreview} onOpenChange={setShowPDFPreview}>
          <DialogContent className="min-w-[90dvw] h-[calc(100dvh-130px)]">
            <DialogHeader className="h-fit">
              <DialogTitle>Tender PDF Report</DialogTitle>
              <DialogDescription>
                {pdfData.stTenderName} | {pdfData.stPersonName}
              </DialogDescription>
            </DialogHeader>
            <PDFViewer className="w-full h-[calc(100dvh-230px)]">
              <TenderPDF
                baseTender={pdfData}
                singleTender={singleStoneTender?.data}
                roughtLotTenders={roughLotTender?.data}
                mixLotTenders={mixLotTender?.data}
                multiLotTenders={multiLotTenders?.data}
              />
            </PDFViewer>
          </DialogContent>
        </Dialog>
      )}
      <PageHeader
        title="Base Tenders"
        handleDialog={handleDialog}
        isBackButton={false}
      />
      <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        action={editData ? "Edit" : "Add"}
        title={editData ? editData.stTenderName : "Tender"}
        widthClass="md:max-w-[35dvw] md:w-[35dvw]"
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
        isPdf={true}
        handlePdf={handlePdf}
        loadingPdf={isPdfDataLoading}
        deleteEndpoint="base-tender"
      />
      <Pagination
        setPage={setPage}
        nextPage={tendersResponse?.nextPage}
        page={page}
      />
    </PageWrapper>
  );
}
