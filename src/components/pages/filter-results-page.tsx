"use client";

import React, { useState } from "react";
import { PageWrapper } from "../common/page-wrapper";
import { PageHeader } from "../common/page-header";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  GemIcon,
  Package,
  TrendingUp,
} from "lucide-react";
import dynamic from "next/dynamic";

function FilterResultsPage() {
  const results = localStorage.getItem("base-tender-filters");
  const filterResults = results ? JSON.parse(results) : "";

  const [expandedBaseTenders, setExpandedBaseTenders] = useState<Set<number>>(
    new Set()
  );
  const [expandedTenders, setExpandedTenders] = useState<Set<string>>(
    new Set()
  );

  const toggleBaseTender = (id: number) => {
    const newExpanded = new Set(expandedBaseTenders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedBaseTenders(newExpanded);
  };

  const toggleTender = (key: string) => {
    const newExpanded = new Set(expandedTenders);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedTenders(newExpanded);
  };

  const formatCurrency = (value: string | null) => {
    if (!value) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(parseFloat(value));
  };

  const formatNumber = (value: string | null) => {
    if (!value) return "—";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(value));
  };

  const DetailCard: React.FC<{
    detail: any;
    type: "single" | "rough" | "mix";
  }> = ({ detail }) => (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">
          {detail.stLotNo}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Grade {detail.inColorGrade || 0}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Polish Cts
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {formatNumber(detail.dcPolCts)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Rough Cts
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {formatNumber(detail.dcRoughCts)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Sale Price
          </p>
          <p className="text-sm font-semibold text-green-700">
            {formatCurrency(detail.dcSalePrice)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Cost Price
          </p>
          <p className="text-sm font-semibold text-red-700">
            {formatCurrency(detail.dcCostPrice)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <GemIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {detail.shape?.stShortName}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {detail.clarity?.stShortName}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-yellow-300 border border-gray-300"></div>
          <span className="text-sm text-gray-600">
            {detail.color?.stShortName}
          </span>
        </div>
        {detail.fluorescence && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-200 border border-gray-300"></div>
            <span className="text-sm text-gray-600">
              {detail.fluorescence.stShortName}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const TenderSection: React.FC<{
    title: string;
    icon: React.ReactNode;
    tenders: any[];
    type: "single" | "rough" | "mix";
    baseTenderId: number;
  }> = ({ title, icon, tenders, type, baseTenderId }) => {
    if (!tenders || tenders.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
            {icon}
          </div>
          <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {tenders.length}
          </span>
        </div>

        <div className="space-y-4">
          {tenders.map((tender, index) => {
            const tenderKey = `${baseTenderId}-${type}-${
              tender.tender?.id || tender.singleTender?.id
            }-${index}`;
            const isExpanded = expandedTenders.has(tenderKey);
            const tenderInfo = tender.tender || tender.singleTender;

            return (
              <div
                key={tenderKey}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleTender(tenderKey)}
                  className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {tenderInfo.stLotNo || `Tender #${tenderInfo.id}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {tenderInfo.stRemark}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {tender.details.length} items
                      </span>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200">
                    <div className="grid gap-4 mt-4">
                      {tender.details.map(
                        (detail: any, detailIndex: number) => (
                          <DetailCard
                            key={detailIndex}
                            detail={detail}
                            type={type}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <PageWrapper>
      <PageHeader title="Filter Results" isBackButton={true} />
      <div className="min-h-screen mt-6">
        <div className="space-y-6">
          {filterResults.map((baseTenderGroup: any) => {
            const isExpanded = expandedBaseTenders.has(
              baseTenderGroup.baseTender.id
            );
            const totalItems =
              baseTenderGroup.singleTenders.reduce(
                (sum: number, t: any) => sum + t.details.length,
                0
              ) +
              baseTenderGroup.roughLots.reduce(
                (sum: number, t: any) => sum + t.details.length,
                0
              ) +
              baseTenderGroup.mixLots.reduce(
                (sum: number, t: any) => sum + t.details.length,
                0
              );

            return (
              <div
                key={baseTenderGroup.baseTender.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() =>
                    toggleBaseTender(baseTenderGroup.baseTender.id)
                  }
                  className="w-full px-8 py-6 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {isExpanded ? (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-gray-400" />
                      )}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {baseTenderGroup.baseTender.stTenderName}
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">
                            {baseTenderGroup.baseTender.stPersonName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Labour</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {baseTenderGroup.baseTender.dcLabour}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Net %</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {baseTenderGroup.baseTender.dcNetPercentage}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Items</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {totalItems}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-8 pb-8 bg-gray-50 border-t border-gray-200">
                    <div className="grid lg:grid-cols-3 gap-8 mt-8">
                      <TenderSection
                        title="Single Tenders"
                        icon={<FileText className="w-5 h-5 text-green-600" />}
                        tenders={baseTenderGroup.singleTenders}
                        type="single"
                        baseTenderId={baseTenderGroup.baseTender.id}
                      />

                      <TenderSection
                        title="Rough Lots"
                        icon={<Package className="w-5 h-5 text-orange-600" />}
                        tenders={baseTenderGroup.roughLots}
                        type="rough"
                        baseTenderId={baseTenderGroup.baseTender.id}
                      />

                      <TenderSection
                        title="Mix Lots"
                        icon={
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                        }
                        tenders={baseTenderGroup.mixLots}
                        type="mix"
                        baseTenderId={baseTenderGroup.baseTender.id}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}

export const FilterResults =  dynamic(() => Promise.resolve(FilterResultsPage), { ssr: false });