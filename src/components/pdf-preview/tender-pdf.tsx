import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { TenderColumns } from "@/app/(protected)/tenders/columns";
import { stringToDecimal } from "@/lib/utils";
import { Option } from "@/lib/types/common";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
    fontSize: 8,
  },
  header: {
    marginBottom: 14,
    textAlign: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5,
    fontSize: 11,
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: "#444",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#444",
    borderBottomStyle: "solid",
    minHeight: 25,
  },
  tableHeader: {
    // margin: "auto",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderBottomWidth: 0.5,
    borderBottomColor: "#444",
    borderBottomStyle: "solid",
    minHeight: 16,
    fontWeight: "bold",
  },
  tableColHeader: {
    borderRightWidth: 0.5,
    borderRightColor: "#444",
    borderRightStyle: "solid",
    height: "100%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 8,
  },
  tableCol: {
    borderRightWidth: 0.5,
    borderRightColor: "#444",
    borderRightStyle: "solid",
    height: "100%",
    fontSize: 8,
  },
  tableCellHeader: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  tableCellCenter: {
    fontSize: 8,
    paddingHorizontal: 2,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  centerMultilineCell: {
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  centerCell: {
    textAlign: "center",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  rightCell: {
    textAlign: "right",
    flexDirection: "row",
    alignContent: "flex-end",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  rightMultilineCell: {
    textAlign: "right",
    flexDirection: "column",
    alignContent: "flex-end",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  leftCell: {
    textAlign: "left",
    flexDirection: "row",
    alignItems: "center",
  },
  cellBorderBottom: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#444",
    borderBottomStyle: "solid",
    paddingBottom: 2,
    marginBottom: 2,
  },
  fontBold: { fontWeight: "bold" },
  // Column widths
  singleColLotNo: { width: "7%", paddingVertical: 2 },
  singleColParticular: { width: "17%", paddingVertical: 2 },
  singleColMeasurement: { width: "11%", paddingVertical: 2 },
  singleColRough: { width: "7%", paddingVertical: 2 },
  singleColPolish: { width: "7%", paddingVertical: 2 },
  singleColSale: { width: "7%", paddingVertical: 2 },
  singleColCost: { width: "7%", paddingVertical: 2 },
  singleColTops: { width: "5%", paddingVertical: 2 },
  singleColBid: { width: "9%", paddingVertical: 2 },
  singleColResult: { width: "16%" },
  singleColWinLoss: { width: "7%", paddingVertical: 2 },

  //Rough Lot
  roughColRough: { width: "14%", paddingVertical: 2 },
  roughColParticular: { width: "28%", paddingVertical: 2 },
  roughColPolish: { width: "7%", paddingVertical: 2 },
  roughColSale: { width: "7%", paddingVertical: 2 },
  roughColLabour: { width: "5%", paddingVertical: 2 },
  roughColCost: { width: "7%", paddingVertical: 2 },
  roughColBid: { width: "9%", paddingVertical: 2 },
  roughColResult: { width: "16%", paddingVertical: 2 },
  roughColWinLoss: { width: "7%", paddingVertical: 2 },

  // Mix Lot
  mixColRough: { width: "14%", paddingVertical: 2 },
  mixColParticular: { width: "28%", paddingVertical: 2 },
  mixColPolish: { width: "7%", paddingVertical: 2 },
  mixColSale: { width: "7%", paddingVertical: 2 },
  mixColCost: { width: "12%", paddingVertical: 2 },
  mixColBid: { width: "9%", paddingVertical: 2 },
  mixColResult: { width: "16%" },
  mixColWinLoss: { width: "7%", paddingVertical: 2 },
});

interface TenderProps {
  singleTender: {
    dcNetPercentage: string;
    dcLabour: string;
    stRemark: string;
    inRoughPcs: number;
    dcRoughCts: string;
    singleTenderDetails:
      | Array<{
          lotNo: string;
          roughPcs: number;
          roughCts: number;
          color: { stShortName: string };
          clarity: { stShortName: string };
          flr: { stShortName: string };
          shape: { stShortName: string };
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
          bidPrice: number;
          totalAmount: number;
          resultCost: number;
          resultPerCarat: number;
          resultTotal: number;
          isWon: boolean;
          margin?: number;
          incription: string;
        }>
      | undefined;
  };
  baseTender: TenderColumns;
  roughtLotTenders: {
    id: string;
    baseTenderId: number;
    inRoughPcs: number;
    dcRoughCts: string;
    dcRate: string;
    dcAmount: string;
    stRemark: string;
    dcLabour: string;
    dcNetPercentage: string;
    dcBidPrice: string;
    dcLotSize: string;
    dcTotalAmount: string;
    dcResultPerCt: string;
    dcResultTotal: string;
    dcCostPrice: string;
    dcCostAmount: string;
    stLotNo: string;
    isWon: boolean;
    margin: string | null;
    otherTenderDetails: {
      id: number;
      inRoughPcs: number;
      dcRoughCts: string;
      stRemark: string;
      dcPolCts: string;
      dcPolPer: string;
      dcSalePrice: string;
      dcSaleAmount: string;
      dcLabour: string;
      dcCostPrice: string;
      dcCostAmount: string;
    }[];
  }[];
  mixLotTenders: {
    id: string;
    baseTenderId: number;
    inRoughPcs: number;
    dcRoughCts: string;
    stRemark: string;
    dcLabour: string;
    dcNetPercentage: string;
    dcBidPrice: string;
    dcLotSize: string;
    dcTotalAmount: string;
    dcResultPerCt: string;
    dcResultTotal: string;
    dcResultCost: string;
    stLotNo: string;
    isWon: boolean;
    margin: string | null;
    otherTenderDetails: {
      id: number;
      inRoughPcs: number;
      dcRoughCts: string;
      stRemark: string;
      dcPolCts: string;
      dcPolPer: string;
      dcSalePrice: string;
      dcSaleAmount: string;
      dcLabour: string;
      dcCostPrice: string;
      dcCostAmount: string;
      color: Option;
      clarity: Option;
      fluorescence: Option;
      shape: Option;
    }[];
  }[];
}

export function TenderPDF({
  baseTender,
  singleTender,
  roughtLotTenders,
  mixLotTenders,
}: TenderProps) {
  const singleTotalValues = singleTender?.singleTenderDetails?.reduce(
    (acc, curr) => {
      return {
        polCts: acc.polCts + curr.polCts,
        salePrice: acc.salePrice + curr.salePrice,
        costPrice: acc.costPrice + curr.costPrice,
        topsAmount: acc.topsAmount + curr.topsAmount,
        bidPrice: acc.bidPrice + curr.bidPrice,
        totalAmount: acc.totalAmount + curr.totalAmount,
        resultCost: acc.resultCost + curr.resultCost,
        resultPerCarat: acc.resultPerCarat + curr.resultPerCarat,
        resultTotal: acc.resultTotal + curr.resultTotal,
      };
    },
    {
      polCts: 0,
      salePrice: 0,
      costPrice: 0,
      topsAmount: 0,
      bidPrice: 0,
      totalAmount: 0,
      resultCost: 0,
      resultPerCarat: 0,
      resultTotal: 0,
    }
  );

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {baseTender.stTenderName} | {baseTender.stPersonName}
          </Text>
          <View style={styles.headerInfo}>
            <Text>Net Percentage: {baseTender.dcNetPercentage}%</Text>
            <Text>
              Date: {new Date(baseTender.dtVoucherDate).toLocaleDateString()}
            </Text>
            <Text>Labour: {baseTender.dcLabour}</Text>
          </View>
        </View>

        {singleTender?.singleTenderDetails &&
          singleTender?.singleTenderDetails?.length > 0 && (
            <>
              {/* Single Stone Tender */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 4,
                  borderWidth: 0.5,
                  backgroundColor: "#fafafa",
                  padding: 4,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: "bold" }}>
                  Single Stone Tender
                </Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Text style={{ fontSize: 11 }}>{singleTender?.stRemark}</Text>
                </View>
              </View>
              <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <View style={[styles.tableColHeader, styles.singleColLotNo]}>
                    <Text style={styles.tableCellHeader}>Lot No</Text>
                  </View>
                  <View style={[styles.tableColHeader, styles.singleColRough]}>
                    <Text style={styles.tableCellHeader}>Rough</Text>
                  </View>
                  <View
                    style={[styles.tableColHeader, styles.singleColParticular]}
                  >
                    <Text style={styles.tableCellHeader}>Particular</Text>
                  </View>
                  <View
                    style={[styles.tableColHeader, styles.singleColMeasurement]}
                  >
                    <Text style={styles.tableCellHeader}>Measurement</Text>
                  </View>
                  <View style={[styles.tableColHeader, styles.singleColPolish]}>
                    <Text style={styles.tableCellHeader}>Polish</Text>
                  </View>
                  <View style={[styles.tableColHeader, styles.singleColSale]}>
                    <Text style={styles.tableCellHeader}>Sale</Text>
                  </View>
                  <View style={[styles.tableColHeader, styles.singleColCost]}>
                    <Text style={styles.tableCellHeader}>Cost</Text>
                  </View>
                  <View style={[styles.tableColHeader, styles.singleColTops]}>
                    <Text style={styles.tableCellHeader}>Tops</Text>
                  </View>
                  <View style={[styles.tableColHeader, styles.singleColBid]}>
                    <Text style={styles.tableCellHeader}>Bid</Text>
                  </View>
                  <View style={[styles.tableColHeader, styles.singleColResult]}>
                    <Text style={styles.tableCellHeader}>Result</Text>
                  </View>
                  <View
                    style={[
                      styles.tableColHeader,
                      styles.singleColWinLoss,
                      { borderRightWidth: 0 },
                    ]}
                  >
                    <Text style={styles.tableCellHeader}>W | L</Text>
                  </View>
                </View>

                {/* Table Rows */}
                {singleTender?.singleTenderDetails?.map((detail, index) => (
                  <View key={index} style={styles.tableRow}>
                    {/* Lot No */}
                    <View
                      style={[
                        styles.tableCol,
                        styles.singleColLotNo,
                        styles.centerCell,
                      ]}
                    >
                      <Text style={[styles.tableCellCenter, styles.fontBold]}>
                        {detail.lotNo}
                      </Text>
                    </View>

                    {/* Rough */}
                    <View
                      style={[
                        styles.tableCol,
                        styles.singleColRough,
                        styles.centerCell,
                      ]}
                    >
                      <Text style={[styles.tableCellCenter, styles.fontBold]}>
                        {detail.roughPcs} | {detail.roughCts}
                      </Text>
                    </View>

                    {/* Particular - Multi-line */}
                    <View style={[styles.tableCol, styles.singleColParticular]}>
                      <Text
                        style={[
                          styles.tableCellCenter,
                          styles.cellBorderBottom,
                          styles.fontBold,
                          { paddingLeft: 4 },
                        ]}
                      >
                        {detail.color.stShortName} |{" "}
                        {detail.clarity.stShortName} | {detail.flr.stShortName}{" "}
                        | {detail.shape.stShortName}
                      </Text>
                      <Text
                        style={[
                          styles.tableCellCenter,
                          { paddingLeft: 4, color: "#777" },
                        ]}
                      >
                        {detail.incription || "---"}
                      </Text>
                    </View>

                    {/* Measurement - Multi-line */}
                    <View
                      style={[styles.tableCol, styles.singleColMeasurement]}
                    >
                      <Text
                        style={[
                          styles.tableCellCenter,
                          styles.cellBorderBottom,
                          styles.centerCell,
                        ]}
                      >
                        {detail.length} x {detail.width} x {detail.height}
                      </Text>
                      <Text style={[styles.tableCellCenter, styles.centerCell]}>
                        D:{detail.depth} T:{detail.table} R:{detail.ratio}
                      </Text>
                    </View>

                    {/* Polish */}
                    <View style={[styles.tableCol, styles.singleColPolish]}>
                      <Text
                        style={[
                          styles.tableCellCenter,
                          styles.rightCell,
                          styles.cellBorderBottom,
                          styles.fontBold,
                        ]}
                      >
                        {detail.polCts.toFixed(2)} cts
                      </Text>
                      <Text style={[styles.tableCellCenter, styles.rightCell]}>
                        {detail.polPercent.toFixed(2)} %
                      </Text>
                    </View>

                    {/* Sale */}
                    <View
                      style={[
                        styles.tableCol,
                        styles.singleColSale,
                        styles.centerCell,
                      ]}
                    >
                      <Text style={[styles.tableCellCenter, styles.fontBold]}>
                        {detail.salePrice.toFixed(2)}
                      </Text>
                    </View>

                    {/* Cost */}
                    <View
                      style={[
                        styles.tableCol,
                        styles.singleColCost,
                        styles.centerCell,
                      ]}
                    >
                      <Text style={[styles.tableCellCenter, styles.fontBold]}>
                        {detail.costPrice.toFixed(2)}
                      </Text>
                    </View>

                    {/* Tops */}
                    <View
                      style={[
                        styles.tableCol,
                        styles.singleColTops,
                        styles.centerCell,
                      ]}
                    >
                      <Text style={styles.tableCellCenter}>
                        {detail.topsAmount}
                      </Text>
                    </View>

                    {/* Bid */}
                    <View style={[styles.tableCol, styles.singleColBid]}>
                      <Text
                        style={[
                          styles.tableCellCenter,
                          styles.cellBorderBottom,
                          styles.fontBold,
                          styles.rightCell,
                        ]}
                      >
                        {detail.bidPrice.toFixed(2)}
                      </Text>
                      <Text
                        style={[
                          styles.tableCellCenter,
                          styles.fontBold,
                          styles.rightCell,
                        ]}
                      >
                        {detail.totalAmount.toFixed(2)}
                      </Text>
                    </View>

                    {/* Result */}
                    <View
                      style={[
                        styles.tableCol,
                        styles.singleColResult,
                        {
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        },
                      ]}
                    >
                      <View
                        style={{
                          borderRight: 0.5,
                          borderRightColor: "#444",
                          borderRightStyle: "solid",
                          width: "50%",
                        }}
                      >
                        <Text
                          style={[
                            styles.tableCellCenter,
                            styles.cellBorderBottom,
                            styles.rightCell,
                            { paddingTop: 2 },
                          ]}
                        >
                          {detail.resultCost.toFixed(2)}
                        </Text>
                        <Text
                          style={[
                            styles.tableCellCenter,
                            { paddingBottom: 2 },
                            styles.rightCell,
                          ]}
                        >
                          {detail.resultPerCarat.toFixed(2)}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.fontBold,
                          styles.rightCell,
                          { width: "50%", paddingRight: 2 },
                        ]}
                      >
                        {detail.resultTotal.toFixed(2)}
                      </Text>
                    </View>

                    {/* Description */}
                    <View
                      style={[
                        styles.tableCol,
                        styles.singleColWinLoss,
                        { borderRightWidth: 0 },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tableCellCenter,
                          styles.cellBorderBottom,
                          styles.centerCell,
                        ]}
                      >
                        {detail.isWon ? "Won" : "Lost"}
                      </Text>
                      <Text style={[styles.tableCellCenter, styles.centerCell]}>
                        ({detail?.margin}%)
                      </Text>
                    </View>
                  </View>
                ))}

                <View style={[styles.tableRow, { backgroundColor: "#f0f0f0" }]}>
                  <View
                    style={[
                      styles.tableCol,
                      styles.singleColLotNo,
                      styles.centerCell,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tableCellCenter,
                        styles.fontBold,
                        { fontSize: 12 },
                      ]}
                    >
                      Total
                    </Text>
                  </View>

                  {/* Rough */}
                  <View
                    style={[
                      styles.tableCol,
                      styles.singleColRough,
                      styles.centerCell,
                    ]}
                  >
                    <Text style={[styles.tableCellCenter, styles.fontBold]}>
                      {singleTender?.inRoughPcs} | {singleTender?.dcRoughCts}
                    </Text>
                  </View>

                  {/* Particular - Multi-line */}
                  <View
                    style={[styles.tableCol, styles.singleColParticular]}
                  ></View>

                  {/* Measurement - Multi-line */}
                  <View
                    style={[styles.tableCol, styles.singleColMeasurement]}
                  ></View>

                  {/* Polish */}
                  <View
                    style={[
                      styles.tableCol,
                      styles.singleColPolish,
                      styles.rightCell,
                    ]}
                  >
                    <Text style={[styles.tableCellCenter, styles.fontBold]}>
                      {singleTotalValues?.polCts?.toFixed(2)} cts
                    </Text>
                  </View>

                  {/* Sale */}
                  <View
                    style={[
                      styles.tableCol,
                      styles.singleColSale,
                      styles.centerCell,
                    ]}
                  >
                    <Text style={[styles.tableCellCenter, styles.fontBold]}>
                      {singleTotalValues?.salePrice?.toFixed(2)}
                    </Text>
                  </View>

                  {/* Cost */}
                  <View
                    style={[
                      styles.tableCol,
                      styles.singleColCost,
                      styles.centerCell,
                    ]}
                  >
                    <Text style={[styles.tableCellCenter, styles.fontBold]}>
                      {singleTotalValues?.costPrice?.toFixed(2)}
                    </Text>
                  </View>

                  {/* Tops */}
                  <View
                    style={[
                      styles.tableCol,
                      styles.singleColTops,
                      styles.centerCell,
                    ]}
                  >
                    <Text style={styles.tableCellCenter}>
                      {singleTotalValues?.topsAmount}
                    </Text>
                  </View>

                  {/* Bid */}
                  <View style={[styles.tableCol, styles.singleColBid]}>
                    <Text
                      style={[
                        styles.tableCellCenter,
                        styles.cellBorderBottom,
                        styles.fontBold,
                        styles.rightCell,
                      ]}
                    >
                      {singleTotalValues?.bidPrice?.toFixed(2)}
                    </Text>
                    <Text
                      style={[
                        styles.tableCellCenter,
                        styles.fontBold,
                        styles.rightCell,
                      ]}
                    >
                      {singleTotalValues?.totalAmount?.toFixed(2)}
                    </Text>
                  </View>

                  {/* Result */}
                  <View
                    style={[
                      styles.tableCol,
                      styles.singleColResult,
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      },
                    ]}
                  >
                    <View
                      style={{
                        borderRight: 0.5,
                        borderRightColor: "#444",
                        borderRightStyle: "solid",
                        width: "50%",
                      }}
                    >
                      <Text
                        style={[
                          styles.tableCellCenter,
                          styles.cellBorderBottom,
                          styles.rightCell,
                          { paddingTop: 2 },
                        ]}
                      >
                        {singleTotalValues?.resultCost?.toFixed(2)}
                      </Text>
                      <Text
                        style={[
                          styles.tableCellCenter,
                          { paddingBottom: 2 },
                          styles.rightCell,
                        ]}
                      >
                        {singleTotalValues?.resultPerCarat?.toFixed(2)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.fontBold,
                        styles.rightCell,
                        { width: "50%", paddingRight: 2 },
                      ]}
                    >
                      {singleTotalValues?.resultTotal?.toFixed(2)}
                    </Text>
                  </View>

                  {/* Description */}
                  <View
                    style={[
                      styles.tableCol,
                      styles.singleColWinLoss,
                      { borderRightWidth: 0 },
                    ]}
                  ></View>
                </View>
              </View>
            </>
          )}

        {/* Rough Lot Tender */}
        {roughtLotTenders?.length > 0 && (
          <>
            {roughtLotTenders?.map((lot, idx) => {
              const roughTotalValues = lot.otherTenderDetails.reduce(
                (acc, curr) => {
                  return {
                    polCts:
                      acc.polCts +
                      (curr.dcPolCts ? parseFloat(curr.dcPolCts) : 0),
                  };
                },
                {
                  polCts: 0,
                }
              );
              return (
                <View key={idx}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 4,
                      borderWidth: 0.5,
                      backgroundColor: "#fafafa",
                      padding: 4,
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: "bold" }}>
                      Rough Lot Tender {idx + 1}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: "600" }}>
                        {lot.stLotNo}
                      </Text>
                      <Text style={{ fontSize: 11, fontWeight: "600" }}>
                        {lot.stRemark}
                      </Text>
                      <Text style={{ fontSize: 11, fontWeight: "600" }}>
                        {lot.dcRoughCts} cts
                      </Text>
                      <Text style={{ fontSize: 11, fontWeight: "600" }}>
                        {lot.inRoughPcs} pcs
                      </Text>
                    </View>
                  </View>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <View
                        style={[styles.tableColHeader, styles.roughColRough]}
                      >
                        <Text style={styles.tableCellHeader}>Rough</Text>
                      </View>
                      <View
                        style={[
                          styles.tableColHeader,
                          styles.roughColParticular,
                        ]}
                      >
                        <Text style={styles.tableCellHeader}>Particular</Text>
                      </View>
                      <View
                        style={[styles.tableColHeader, styles.roughColPolish]}
                      >
                        <Text style={styles.tableCellHeader}>Polish</Text>
                      </View>
                      <View
                        style={[styles.tableColHeader, styles.roughColSale]}
                      >
                        <Text style={styles.tableCellHeader}>Sale</Text>
                      </View>
                      <View
                        style={[styles.tableColHeader, styles.roughColLabour]}
                      >
                        <Text style={styles.tableCellHeader}>Labour</Text>
                      </View>
                      <View
                        style={[styles.tableColHeader, styles.roughColCost]}
                      >
                        <Text style={styles.tableCellHeader}>Cost</Text>
                      </View>
                      <View style={[styles.tableColHeader, styles.roughColBid]}>
                        <Text style={styles.tableCellHeader}>Bid</Text>
                      </View>
                      <View
                        style={[styles.tableColHeader, styles.roughColResult]}
                      >
                        <Text style={styles.tableCellHeader}>Result</Text>
                      </View>
                      <View
                        style={[
                          styles.tableColHeader,
                          styles.roughColWinLoss,
                          { borderRightWidth: 0 },
                        ]}
                      >
                        <Text style={styles.tableCellHeader}>W | L</Text>
                      </View>
                    </View>
                    {lot?.otherTenderDetails?.map((detail, index) => (
                      <View key={index} style={styles.tableRow}>
                        <View
                          style={[
                            styles.tableCol,
                            styles.roughColRough,
                            styles.centerCell,
                          ]}
                        >
                          <Text
                            style={[styles.tableCellCenter, styles.fontBold]}
                          >
                            {detail.inRoughPcs} | {detail.dcRoughCts}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            styles.roughColParticular,
                            styles.centerCell,
                          ]}
                        >
                          {detail.stRemark || "---"}
                        </View>
                        <View style={[styles.tableCol, styles.roughColPolish]}>
                          <Text
                            style={[
                              styles.tableCellCenter,
                              styles.rightCell,
                              styles.cellBorderBottom,
                              styles.fontBold,
                            ]}
                          >
                            {stringToDecimal(detail.dcPolCts)} cts
                          </Text>
                          <Text
                            style={[styles.tableCellCenter, styles.rightCell]}
                          >
                            {stringToDecimal(detail?.dcPolPer)} %
                          </Text>
                        </View>
                        <View style={[styles.tableCol, styles.roughColSale]}>
                          <Text
                            style={[
                              styles.tableCellCenter,
                              styles.rightCell,
                              styles.cellBorderBottom,
                              styles.fontBold,
                            ]}
                          >
                            {stringToDecimal(detail.dcSalePrice)}
                          </Text>
                          <Text
                            style={[styles.tableCellCenter, styles.rightCell]}
                          >
                            {stringToDecimal(detail.dcSaleAmount)}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.tableCol,
                            styles.roughColLabour,
                            styles.centerCell,
                          ]}
                        >
                          <Text
                            style={[styles.tableCellCenter, styles.fontBold]}
                          >
                            {stringToDecimal(detail.dcLabour)}
                          </Text>
                        </View>
                        <View style={[styles.tableCol, styles.roughColCost]}>
                          <Text
                            style={[
                              styles.tableCellCenter,
                              styles.rightCell,
                              styles.cellBorderBottom,
                              styles.fontBold,
                            ]}
                          >
                            {stringToDecimal(detail.dcCostPrice)}
                          </Text>
                          <Text
                            style={[styles.tableCellCenter, styles.rightCell]}
                          >
                            {stringToDecimal(detail.dcCostAmount)}
                          </Text>
                        </View>
                        <View
                          style={[styles.tableCol, styles.roughColBid]}
                        ></View>
                        <View
                          style={[styles.tableCol, styles.roughColResult]}
                        ></View>
                        <View
                          style={[
                            styles.tableCol,
                            styles.roughColWinLoss,
                            { borderRightWidth: 0 },
                          ]}
                        ></View>
                      </View>
                    ))}
                    <View
                      style={[styles.tableRow, { backgroundColor: "#f0f0f0" }]}
                    >
                      <View
                        style={[
                          styles.tableCol,
                          styles.roughColRough,
                          styles.centerCell,
                        ]}
                      >
                        <Text style={[styles.tableCellCenter, styles.fontBold]}>
                          {lot.inRoughPcs} | {lot.dcRoughCts}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.tableCol,
                          styles.roughColParticular,
                          styles.centerCell,
                        ]}
                      ></View>
                      <View
                        style={[
                          styles.tableCol,
                          styles.roughColPolish,
                          styles.rightCell,
                        ]}
                      >
                        <Text style={[styles.tableCellCenter, styles.fontBold]}>
                          {roughTotalValues.polCts?.toFixed(2)} cts
                        </Text>
                      </View>
                      <View
                        style={[styles.tableCol, styles.roughColSale]}
                      ></View>
                      <View
                        style={[
                          styles.tableCol,
                          styles.roughColLabour,
                          styles.centerCell,
                        ]}
                      ></View>
                      <View style={[styles.tableCol, styles.roughColCost]}>
                        <Text
                          style={[
                            styles.tableCellCenter,
                            styles.rightCell,
                            styles.cellBorderBottom,
                            styles.fontBold,
                          ]}
                        >
                          {stringToDecimal(lot.dcCostPrice)}
                        </Text>
                        <Text
                          style={[styles.tableCellCenter, styles.rightCell]}
                        >
                          {stringToDecimal(lot.dcCostAmount)}
                        </Text>
                      </View>
                      <View style={[styles.tableCol, styles.roughColBid]}>
                        <Text
                          style={[
                            styles.tableCellCenter,
                            styles.cellBorderBottom,
                            styles.fontBold,
                            styles.rightCell,
                          ]}
                        >
                          {stringToDecimal(lot.dcBidPrice)}
                        </Text>
                        <Text
                          style={[
                            styles.tableCellCenter,
                            styles.fontBold,
                            styles.rightCell,
                          ]}
                        >
                          {stringToDecimal(lot.dcTotalAmount)}
                        </Text>
                      </View>
                      <View style={[styles.tableCol, styles.roughColResult]}>
                        <Text
                          style={[
                            styles.tableCellCenter,
                            styles.cellBorderBottom,
                            styles.fontBold,
                            styles.rightCell,
                          ]}
                        >
                          {stringToDecimal(lot.dcResultTotal)}
                        </Text>
                        <Text
                          style={[
                            styles.tableCellCenter,
                            styles.fontBold,
                            styles.rightCell,
                          ]}
                        >
                          {stringToDecimal(lot.dcResultPerCt)}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.tableCol,
                          styles.roughColWinLoss,
                          { borderRightWidth: 0 },
                        ]}
                      >
                        <Text
                          style={[
                            styles.tableCellCenter,
                            styles.cellBorderBottom,
                            styles.fontBold,
                            styles.centerCell,
                          ]}
                        >
                          {lot.isWon ? "Won" : "Lost"}
                        </Text>
                        <Text
                          style={[
                            styles.tableCellCenter,
                            styles.fontBold,
                            styles.centerCell,
                          ]}
                        >
                          ({lot.margin} %)
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {/* Mix Lot Tender */}
        {mixLotTenders?.length > 0 && (
          <View break>
            {mixLotTenders?.map((lot, idx) => {
              const mixTotalValues = lot.otherTenderDetails.reduce(
                (acc, curr) => {
                  return {
                    polCts:
                      acc.polCts +
                      (curr.dcPolCts ? parseFloat(curr.dcPolCts) : 0),
                  };
                },
                {
                  polCts: 0,
                }
              );
              return (
                <View key={idx}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 4,
                      borderWidth: 0.5,
                      backgroundColor: "#fafafa",
                      padding: 4,
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: "bold" }}>
                      Mix Lot Tender {idx + 1}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: "600" }}>
                        {lot.stLotNo}
                      </Text>
                      <Text style={{ fontSize: 11, fontWeight: "600" }}>
                        {lot.stRemark}
                      </Text>
                      <Text style={{ fontSize: 11, fontWeight: "600" }}>
                        {lot.dcRoughCts} cts
                      </Text>
                      <Text style={{ fontSize: 11, fontWeight: "600" }}>
                        {lot.inRoughPcs} pcs
                      </Text>
                    </View>
                  </View>
                  <View style={styles.table}>
                    <View style={styles.tableHeader}>
                      <View style={[styles.tableColHeader, styles.mixColRough]}>
                        <Text style={styles.tableCellHeader}>Rough</Text>
                      </View>
                      <View
                        style={[styles.tableColHeader, styles.mixColParticular]}
                      >
                        <Text style={styles.tableCellHeader}>Particular</Text>
                      </View>
                      <View
                        style={[styles.tableColHeader, styles.mixColPolish]}
                      >
                        <Text style={styles.tableCellHeader}>Polish</Text>
                      </View>
                      <View style={[styles.tableColHeader, styles.mixColSale]}>
                        <Text style={styles.tableCellHeader}>Sale</Text>
                      </View>
                      <View style={[styles.tableColHeader, styles.mixColCost]}>
                        <Text style={styles.tableCellHeader}>Cost</Text>
                      </View>
                      <View style={[styles.tableColHeader, styles.mixColBid]}>
                        <Text style={styles.tableCellHeader}>Bid</Text>
                      </View>
                      <View
                        style={[styles.tableColHeader, styles.mixColResult]}
                      >
                        <Text style={styles.tableCellHeader}>Result</Text>
                      </View>
                      <View
                        style={[
                          styles.tableColHeader,
                          styles.mixColWinLoss,
                          { borderRightWidth: 0 },
                        ]}
                      >
                        <Text style={styles.tableCellHeader}>W | L</Text>
                      </View>
                    </View>
                    {lot.otherTenderDetails?.map((detail, index) => (
                      <View key={index} style={styles.tableRow}>
                        <View
                          style={[
                            styles.tableCol,
                            styles.mixColRough,
                            styles.centerCell,
                          ]}
                        >
                          <Text
                            style={[styles.tableCellCenter, styles.fontBold]}
                          >
                            {detail.inRoughPcs} | {detail.dcRoughCts}
                          </Text>
                        </View>
                        <View
                          style={[styles.tableCol, styles.mixColParticular]}
                        >
                          <Text
                            style={[
                              styles.tableCellCenter,
                              styles.leftCell,
                              styles.cellBorderBottom,
                              styles.fontBold,
                            ]}
                          >
                            {detail.color.stShortName} |{" "}
                            {detail.clarity.stShortName} |{" "}
                            {detail.fluorescence.stShortName} |{" "}
                            {detail.shape.stShortName}
                          </Text>
                          <Text
                            style={[styles.tableCellCenter, styles.leftCell]}
                          >
                            {detail.stRemark || "---"}
                          </Text>
                        </View>
                        <View style={[styles.tableCol, styles.mixColPolish]}>
                          <Text
                            style={[
                              styles.tableCellCenter,
                              styles.rightCell,
                              styles.cellBorderBottom,
                              styles.fontBold,
                            ]}
                          >
                            {stringToDecimal(detail.dcPolCts)} cts
                          </Text>
                          <Text
                            style={[styles.tableCellCenter, styles.rightCell]}
                          >
                            {stringToDecimal(detail?.dcPolPer)} %
                          </Text>
                        </View>
                        <View style={[styles.tableCol, styles.mixColSale]}>
                          <Text
                            style={[
                              styles.tableCellCenter,
                              styles.rightCell,
                              styles.cellBorderBottom,
                              styles.fontBold,
                            ]}
                          >
                            {stringToDecimal(detail.dcSalePrice)}
                          </Text>
                          <Text
                            style={[styles.tableCellCenter, styles.rightCell]}
                          >
                            {stringToDecimal(detail.dcSaleAmount)}
                          </Text>
                        </View>
                        <View style={[styles.tableCol, styles.mixColCost]}>
                          {/* <Text
                            style={[
                              styles.tableCellCenter,
                              styles.rightCell,
                              styles.cellBorderBottom,
                              styles.fontBold,
                            ]}
                          >
                            {stringToDecimal(detail.dcCostPrice)}
                          </Text>
                          <Text style={[styles.tableCellCenter, styles.rightCell]}>
                            {stringToDecimal(detail.dcCostAmount)}
                          </Text> */}
                        </View>
                        <View
                          style={[styles.tableCol, styles.mixColBid]}
                        ></View>
                        <View
                          style={[styles.tableCol, styles.mixColResult]}
                        ></View>
                        <View
                          style={[
                            styles.tableCol,
                            styles.mixColWinLoss,
                            { borderRightWidth: 0 },
                          ]}
                        ></View>
                      </View>
                    ))}
                    <View
                      style={[styles.tableRow, { backgroundColor: "#f0f0f0" }]}
                    >
                      <View
                        style={[
                          styles.tableCol,
                          styles.mixColRough,
                          styles.centerCell,
                        ]}
                      >
                        <Text
                          style={[
                            styles.tableCellCenter,
                            styles.fontBold,
                            styles.rightCell,
                          ]}
                        >
                          {lot.inRoughPcs} | {lot.dcRoughCts}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.tableCol,
                          styles.mixColParticular,
                          styles.centerCell,
                        ]}
                      ></View>
                      <View
                        style={[
                          styles.tableCol,
                          styles.mixColPolish,
                          styles.rightCell,
                        ]}
                      >
                        <Text style={[styles.tableCellCenter, styles.fontBold]}>
                          {mixTotalValues.polCts?.toFixed(2)} cts
                        </Text>
                      </View>
                      <View style={[styles.tableCol, styles.mixColSale]}></View>
                      <View style={[styles.tableCol, styles.mixColCost]}></View>
                      <View style={[styles.tableCol, styles.mixColBid]}>
                        <Text
                          style={[
                            styles.tableCellCenter,
                            styles.cellBorderBottom,
                            styles.fontBold,
                            styles.rightCell,
                          ]}
                        >
                          {stringToDecimal(lot.dcBidPrice)}
                        </Text>
                        <Text
                          style={[
                            styles.tableCellCenter,
                            styles.fontBold,
                            styles.rightCell,
                          ]}
                        >
                          {stringToDecimal(lot.dcTotalAmount)}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.tableCol,
                          styles.mixColResult,
                          {
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          },
                        ]}
                      >
                        <View
                          style={{
                            borderRight: 0.5,
                            borderRightColor: "#444",
                            borderRightStyle: "solid",
                            width: "50%",
                          }}
                        >
                          <Text
                            style={[
                              styles.tableCellCenter,
                              styles.cellBorderBottom,
                              styles.rightCell,
                              { paddingTop: 2 },
                            ]}
                          >
                            {lot.dcResultCost}
                          </Text>
                          <Text
                            style={[
                              styles.tableCellCenter,
                              { paddingBottom: 2 },
                              styles.rightCell,
                            ]}
                          >
                            {lot.dcResultPerCt}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.fontBold,
                            styles.rightCell,
                            { width: "50%", paddingRight: 2 },
                          ]}
                        >
                          {lot.dcResultTotal}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.tableCol,
                          styles.mixColWinLoss,
                          { borderRightWidth: 0 },
                        ]}
                      >
                        <Text
                          style={[
                            styles.tableCellCenter,
                            styles.cellBorderBottom,
                            styles.fontBold,
                            styles.centerCell,
                          ]}
                        >
                          {lot.isWon ? "Won" : "Lost"}
                        </Text>
                        <Text
                          style={[
                            styles.tableCellCenter,
                            styles.fontBold,
                            styles.centerCell,
                          ]}
                        >
                          ({lot.margin}%)
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </Page>
    </Document>
  );
}
