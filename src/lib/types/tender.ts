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
  totalAmount: number;
  costAmount?: number;
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
  rate?: number;
  amount?: number;
  salePrice?: number;
  saleAmount?: number;
  costPrice?: number;
  costAmount?: number;
  bidPrice: number;
  isWon: boolean;
  margin?: number;
  totalAmount: number; // Bid Amount
  resultPerCarat?: number;
  resultTotal?: number;
  tenderDetails: string; // RoughLotTenderDetails[] || MixLotTenderDetails[]
  mainLotId?: number;
  finalCostPrice: number;
  finalBidPrice: number;
  finalBidAmount: number;
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
  inRoughPcs: number | undefined;
  dcRoughCts: number | undefined;
  color: Option;
  inColorGrade: number | undefined;
  clarity: Option;
  fluorescence: Option;
  shape: Option;
  stRemark: string;
  dcPolCts: number | undefined;
  dcPolPer: number | undefined;
  dcDepth: number | undefined;
  dcTable: number | undefined;
  dcRatio: number | undefined;
  dcSalePrice: number | undefined;
  dcSaleAmount: number | undefined;
  dcLabour: number | undefined;
  dcCostPrice: number | undefined;
  dcCostAmount: number | undefined;
}

export interface MainLot {
  stLotNo: string;
  stName: string;
  inPcs: number;
  dcCts: number;
  dcRemainingCts: number;
  inRemainingPcs: number;
  isWon: boolean;
}

export interface MixLotTenderDetails {
  id?: number;
  inRoughPcs: number | undefined;
  dcRoughCts: number | undefined;
  color: Option;
  inColorGrade: number | undefined;
  clarity: Option;
  fluorescence: Option;
  shape: Option;
  stRemark: string;
  dcPolCts: number | undefined;
  dcPolPer: number | undefined;
  dcDepth: number | undefined;
  dcTable: number | undefined;
  dcRatio: number | undefined;
  dcSalePrice: number | undefined;
  dcSaleAmount: number | undefined;
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
  length: number;
  width: number;
  height: number;
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
  finalCostPrice?: number; 
  finalBidPrice?: number;
  finalBidAmount?: number;
  isWon: boolean;
  margin: number;
}
