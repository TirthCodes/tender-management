import { Option } from "./common";

export interface CostDetails {
  bidPrice: number;
  totalAmount: number;
  resultCost: number;
  resultPerCarat: number;
  resultTotal?: number;
  finalCostPrice: number;
  finalBidPrice?: number;
  finalTotalAmount: number;
}

export interface TotalValues {
  pcs: number;
  carats: number;
  polCts: number;
  polPercent: number;
  salePrice: number;
  costPrice: number;
  topsAmount?: number;
}

export interface TenderDetails {
  pcs: number;
  carats: number;
  color: Option;
  colorGrade: number;
  clarity: Option;
  flr: Option;
  shape: Option;
  polCts: number;
  polPercent: number;
  depth: number;
  table: number;
  ratio: number;
  salePrice: number;
  saleAmount: number;
  costPrice: number;
  costAmount: number;
  topsAmount: number;
  incription: string;
}

export interface RoughLotTenderDetails {
  inRoughPcs: number;
  dcRoughCts: number;
  color: Option;
  inColorGrade: number;
  clarity: Option;
  fluorescence: Option;
  shape: Option;
  stRemark: string;
  dcPolCts: number;
  dcPolPer: number;
  dcDepth: number;
  dcTable: number;
  dcRatio: number;
  dcSalePrice: number;
  dcSaleAmount: number;
  dcLabour: number;
  dcCostPrice: number;
  dcCostAmount: number;
}

export interface MixLotTenderDetails {
  inRoughPcs: number;
  dcRoughCts: number;
  color: Option;
  inColorGrade: number;
  clarity: Option;
  fluorescence: Option;
  shape: Option;
  stRemark: string;
  dcPolCts: number;
  dcPolPer: number;
  dcDepth: number;
  dcTable: number;
  dcRatio: number;
  dcSalePrice: number;
  dcSaleAmount: number;
}

export interface SingleStoneTenderDetails {
  lotNo: string;
  roughName: string;
  roughPcs: number;
  roughCts: number;
  roughSize: number;
  roughPrice: number;
  roughTotal: number;
  color: Option;
  colorGrade: number;
  clarity: Option;
  flr: Option;
  shape: Option;
  polCts: number;
  polPercent: number;
  depth: number;
  table: number;
  ratio: number;
  salePrice: number;
  saleAmount: number;
  costPrice: number;
  costAmount: number;
  topsAmount: number;
  incription: string;
  bidPrice: number;
  totalAmount: number;
  resultCost: number;
  resultPerCarat: number;
  resultTotal: number;
  // finalBidPrice: number;
}
