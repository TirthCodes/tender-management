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
  saleAmount: number;
  costPrice: number;
  topsAmount?: number;
}

// type BasePayload = {
//   labour: number;
//   netPercent: number;
//   remark?: string;
// }

type OtherTednerBasePayload = {
  id?: number;
  baseTenderId: number;
  labour: number;
  netPercent: number;
  remark?: string;
  lotNo: string;
  roughPcs: number;
  roughCts: number;
  lotSize: number;
  rate: number;
  amount: number;
  bidPrice: number;
  totalAmount: number; // Bid Amount
  resultPerCarat: number;
  resultTotal: number;
  tenderDetails: string; // RoughLotTenderDetails[] || MixLotTenderDetails[]
  mainLotId?: number;
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
  id?: number;
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
  id?: number;
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

export type RoughLotPaylod = OtherTednerBasePayload

export type MixLotPaylod = OtherTednerBasePayload & {
  resultCost: number;
};

export interface SingleStoneTenderDetails {
  id?: number;
  lotNo: string;
  roughPcs: number;
  roughCts: number;
  roughSize: number;
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
  topsAmount: number;
  incription: string;
  bidPrice: number;
  totalAmount: number;
  resultCost: number;
  resultPerCarat: number;
  resultTotal: number;
}
