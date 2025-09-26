"use client";

import { columns, TenderColumns } from "@/app/(protected)/tenders/columns";
import { FormDialog } from "@/components/common/form-dialog";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Pagination } from "@/components/common/pagination";
import { TenderDataTable } from "@/components/ui/tender-data-table";
import { getBaseTenders } from "@/services/base-tender";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useCallback } from "react";
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
import { Button } from "../ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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

  const [filters, setFilters] = useState({
    search: "",
    fromDate: "",
    toDate: "",
  });

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  const [showPDFPreview, setShowPDFPreview] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: debouncedSearch,
    }));
  }, [debouncedSearch]);

  const handleDateFilter = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      fromDate: fromDate ? format(fromDate, "yyyy-MM-dd") : "",
      toDate: toDate ? format(toDate, "yyyy-MM-dd") : "",
    }));
  }, [fromDate, toDate]);

  const clearDateFilter = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setFilters((prev) => ({
      ...prev,
      fromDate: "",
      toDate: "",
    }));
  };

  const queryKey = "tenders";

  const { data: tendersResponse, isLoading } = useQuery({
    queryKey: [
      queryKey,
      filters.search,
      filters.fromDate,
      filters.toDate,
      page,
    ],
    queryFn: () =>
      getBaseTenders({
        ...filters,
        page,
      }),
    initialData: filters.search || filters.fromDate || filters.toDate
      ? undefined
      : {
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

  const { data: singleStoneTender, isLoading: isSingleStoneLoading } = useQuery(
    {
      queryKey: ["single-stone-tender", tenderId],
      queryFn: () => getSingleStoneTender(tenderId as number),
      enabled: !!tenderId,
    }
  );

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
    setTenderId(id);
    const tender = tendersResponse?.data?.find(
      (i: TenderColumns) => i.id === id
    );
    if (!tender) {
      return;
    }
    setPdfData(tender);
    setShowPDFPreview(true);
  };

  const isPdfDataLoading =
    isSingleStoneLoading ||
    isRoughLotLoading ||
    isMixLotLoading ||
    isMultiLotLoading;

  return (
    <PageWrapper>
      {showPDFPreview && pdfData && !isPdfDataLoading && (
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-xl lg:text-2xl font-bold">Base Tenders</h1>
        </div>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-8 w-8">
                <FunnelIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Date Range Filter</h4>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">
                          From Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {fromDate
                                ? format(fromDate, "dd/MM/yyyy")
                                : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={fromDate}
                              onSelect={setFromDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          To Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {toDate
                                ? format(toDate, "dd/MM/yyyy")
                                : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={toDate}
                              onSelect={setToDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleDateFilter}
                        className="flex-1"
                        size="sm"
                      >
                        Apply Filter
                      </Button>
                      <Button
                        onClick={clearDateFilter}
                        variant="outline"
                        size="sm"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Input
            placeholder="Search By Name or Person Name"
            className="w-[300px]"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button
            className="rounded-sm bg-neutral-800 h-7 lg:h-9 px-2 lg:px-4 w-24"
            onClick={() => handleDialog()}
          >
            Create <PlusCircle />
          </Button>
        </div>
      </div>
      <FormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        action={editData ? "Edit" : "Add"}
        title={editData ? editData.stTenderName : "Tender"}
        widthClass="md:max-w-[35dvw] md:w-[35dvw]"
      >
        <BaseTenderForm editData={editData} setDialogOpen={setDialogOpen} />
      </FormDialog>
      {isLoading ? (
        <div className="flex justify-center items-center h-[90dvh]">
          <Loader2 className="h-20 w-20 animate-spin" />
        </div>
      ) : (
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
      )}
      <Pagination
        setPage={setPage}
        nextPage={tendersResponse?.nextPage}
        page={page}
      />
    </PageWrapper>
  );
}
