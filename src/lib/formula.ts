export const calculateBidPrice = (
  costPrice: number,
  topsAmount: number,
  polCts: number,
  roughCts: number,
  labourValue: number,
  netPercentValue: number
): number => {
  const netPercentage = netPercentValue / 100;

  const calculatedBidPrice = parseFloat(
    (
      ((((costPrice + topsAmount) * 0.97 - 180) * polCts) / roughCts -
        labourValue) /
      netPercentage
    ).toFixed(2)
  );

  if (!isNaN(calculatedBidPrice)) {
    return calculatedBidPrice;
  } else {
    return 0;
  }
};

export const calculateBidPriceOnAmount = (
  totalAmount: number,
  roughCts: number
) => {
  if (totalAmount && roughCts && !isNaN(totalAmount) && !isNaN(roughCts)) {
    return parseFloat((totalAmount / roughCts).toFixed(2));
  } else {
    return 0;
  }
};

export const calculateCostPrice = (
  bidPrice: number,
  labourValue: number,
  roughCts: number,
  polCts: number,
  topsAmount: number
) => {
  const costPrice = parseFloat(
    (
      (((((((bidPrice * 0.06) + bidPrice) + labourValue) * roughCts) / polCts) + 180) / 0.97) - topsAmount
    ).toFixed(2)
  );

  if (!isNaN(costPrice)) {
    return costPrice;
  } else {
    return 0;
  }
};

// Total Amount / Bid Amount
export const calculateTotalAmount = (bidPrice: number, roughCts: number) => {
  if (bidPrice && roughCts && !isNaN(bidPrice) && !isNaN(roughCts)) {
    return parseFloat((roughCts * bidPrice).toFixed(2));
  } else {
    return 0;
  }
};

export const calculateResultPerCarat = (
  resultTotal: number,
  roughCts: number
) => {
  if (resultTotal && roughCts && !isNaN(resultTotal) && !isNaN(roughCts)) {
    return parseFloat((resultTotal / roughCts).toFixed(2));
  } else {
    return 0;
  }
};

export const calculateResultCost = (
  resultPerCarat: number,
  labourValue: number,
  polCts: number,
  roughCts: number,
  topsAmount: number
) => {
  if (resultPerCarat) {
    const resultCost = parseFloat(
      (
        (((((((resultPerCarat * 0.06) + resultPerCarat) + labourValue) * roughCts) / polCts) + 180) / 0.97) - topsAmount
      ).toFixed(2)
    );

    if (!isNaN(resultCost)) {
      return resultCost;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};
