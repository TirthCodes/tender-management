// Types for hierarchical data structure
export interface BaseTender {
  id: number;
  dcLabour: string;
  dcNetPercentage: string;
  stTenderName: string;
  stPersonName: string;
}

export interface SingleTenderDetail {
  singleTender: {
    id: number;
    stRemark: string | null;
    dcNetPercentage: string;
    dcLabour: string;
    baseTender: BaseTender;
  };
  dcBidPrice: string;
  dcPolCts: string;
  dcPolPercent: string;
  dcSalePrice: string;
  dcSaleAmount: string;
  dcCostPrice: string;
  dcTotalAmount: string;
  dcResultCost: string | null;
  dcResultPerCt: string | null;
  dcResultTotal: string | null;
  inRoughPcs: number;
  stLotNo: string;
  clarity: { id: number; stShortName: string };
  shape: { id: number; stShortName: string };
  color: { id: number; stShortName: string };
  flr: { id: number; stShortName: string };
  dcRoughCts: string;
  dcSize: string;
  dcTopsAmount: string | null;
  inColorGrade: number;
  stIncription: string | null;
  margin?: number | null;
  isWon?: boolean | null;
  dcFinalBidPrice?: string | null;
  dcFinalCostPrice?: string | null;
}

export interface OtherTenderDetail {
  tender: {
    id: number;
    stRemark: string;
    stLotNo: string;
    stTenderType: string;
    baseTender: BaseTender;
  };
  dcCostAmount: string | null;
  dcCostPrice: string | null;
  dcPolCts: string;
  dcPolPer: string;
  dcSaleAmount: string;
  dcSalePrice: string;
  clarity: { id: number; stShortName: string };
  shape: { id: number; stShortName: string };
  color: { id: number; stShortName: string };
  fluorescence: { id: number; stShortName: string };
  dcRoughCts: string;
  inRoughPcs: number;
  stRemark: string;
  inColorGrade: number;
}

export interface HierarchicalData {
  baseTender: BaseTender;
  singleTenders: Array<{
    singleTender: SingleTenderDetail["singleTender"];
    details: SingleTenderDetail[];
  }>;
  roughLots: Array<{
    tender: OtherTenderDetail["tender"];
    details: OtherTenderDetail[];
  }>;
  mixLots: Array<{
    tender: OtherTenderDetail["tender"];
    details: OtherTenderDetail[];
  }>;
}

/**
 * Creates hierarchical data structure from single tender and other tender details
 * Groups details by base tender, then by individual tenders within each base tender
 *
 * @param singleTenderDetails - Array of single tender details from database
 * @param otherTenderDetails - Array of other tender details (rough-lot and mix-lot) from database
 * @returns Array of hierarchically structured tender data
 */
export function createHierarchicalData(
  singleTenderDetails: any[],
  otherTenderDetails: any[]
): HierarchicalData[] {
  const hierarchyMap = new Map<number, HierarchicalData>();

  // Check if data is in tender format (with nested details) or detail format (direct details)
  const isTenderFormat = singleTenderDetails.some(item =>
    item.singleTenderDetails || item.otherTenderDetails
  );

  if (isTenderFormat) {
    // Process single tenders with nested details
    for (const tender of singleTenderDetails) {
      const baseTenderId = tender.baseTender.id;
      const singleTenderId = tender.id;

      // Initialize hierarchy for base tender if not exists
      if (!hierarchyMap.has(baseTenderId)) {
        hierarchyMap.set(baseTenderId, {
          baseTender: tender.baseTender,
          singleTenders: [],
          roughLots: [],
          mixLots: [],
        });
      }

      const hierarchy = hierarchyMap.get(baseTenderId)!;

      // Find or create single tender group
      let singleTender = hierarchy.singleTenders.find(
        (st) => st.singleTender.id === singleTenderId
      );

      if (!singleTender) {
        singleTender = {
          singleTender: tender,
          details: [],
        };
        hierarchy.singleTenders.push(singleTender);
      }

      // Add all nested details
      if (tender.singleTenderDetails) {
        singleTender.details.push(...tender.singleTenderDetails);
      }
    }

    // Process other tenders with nested details
    for (const tender of otherTenderDetails) {
      const baseTenderId = tender.baseTender.id;
      const tenderId = tender.id;
      const tenderType = tender.stTenderType;

      // Initialize hierarchy for base tender if not exists
      if (!hierarchyMap.has(baseTenderId)) {
        hierarchyMap.set(baseTenderId, {
          baseTender: tender.baseTender,
          singleTenders: [],
          roughLots: [],
          mixLots: [],
        });
      }

      const hierarchy = hierarchyMap.get(baseTenderId)!;

      // Determine target array based on tender type
      const targetArray =
        tenderType === "rough-lot" ? hierarchy.roughLots : hierarchy.mixLots;

      // Find or create tender group
      let tenderGroup = targetArray.find((t) => t.tender.id === tenderId);
      if (!tenderGroup) {
        tenderGroup = {
          tender: tender,
          details: [],
        };
        targetArray.push(tenderGroup);
      }

      // Add all nested details
      if (tender.otherTenderDetails) {
        tenderGroup.details.push(...tender.otherTenderDetails);
      }
    }
  } else {
    // Original logic for direct detail objects
    // Process single tender details
    for (const detail of singleTenderDetails) {
      const baseTenderId = detail.singleTender.baseTender.id;
      const singleTenderId = detail.singleTender.id;

      // Initialize hierarchy for base tender if not exists
      if (!hierarchyMap.has(baseTenderId)) {
        hierarchyMap.set(baseTenderId, {
          baseTender: detail.singleTender.baseTender,
          singleTenders: [],
          roughLots: [],
          mixLots: [],
        });
      }

      const hierarchy = hierarchyMap.get(baseTenderId)!;

      // Find or create single tender group
      let singleTender = hierarchy.singleTenders.find(
        (st) => st.singleTender.id === singleTenderId
      );

      if (!singleTender) {
        singleTender = {
          singleTender: detail.singleTender,
          details: [],
        };
        hierarchy.singleTenders.push(singleTender);
      }

      singleTender.details.push(detail);
    }

    // Process other tender details (rough-lot and mix-lot)
    for (const detail of otherTenderDetails) {
      const baseTenderId = detail.tender.baseTender.id;
      const tenderId = detail.tender.id;
      const tenderType = detail.tender.stTenderType;

      // Initialize hierarchy for base tender if not exists
      if (!hierarchyMap.has(baseTenderId)) {
        hierarchyMap.set(baseTenderId, {
          baseTender: detail.tender.baseTender,
          singleTenders: [],
          roughLots: [],
          mixLots: [],
        });
      }

      const hierarchy = hierarchyMap.get(baseTenderId)!;

      // Determine target array based on tender type
      const targetArray =
        tenderType === "rough-lot" ? hierarchy.roughLots : hierarchy.mixLots;

      // Find or create tender group
      let tender = targetArray.find((t) => t.tender.id === tenderId);
      if (!tender) {
        tender = {
          tender: detail.tender,
          details: [],
        };
        targetArray.push(tender);
      }

      tender.details.push(detail);
    }
  }

  return Array.from(hierarchyMap.values());
}

/**
 * Legacy function name for backward compatibility
 * @deprecated Use createHierarchicalData instead
 */
export const createHierarchicalDataWithMap = createHierarchicalData;