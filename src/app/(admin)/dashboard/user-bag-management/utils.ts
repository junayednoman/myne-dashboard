const CURRENT_YEAR = new Date().getFullYear();

export const HISTORY_YEAR_OPTIONS = Array.from({ length: 11 }, (_, index) =>
  String(CURRENT_YEAR - 5 + index)
);

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export const buildHistoricalValues = (
  cost: number,
  currentValue: number,
  selectedYear: number
) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
  ];
  const yearOffset = selectedYear - CURRENT_YEAR;
  const adjustedCurrent = Math.round(currentValue * (1 + yearOffset * 0.04));

  return months.map((month, index) => {
    const progress = index / (months.length - 1);
    const wave = Math.sin(index * 0.9) * 0.08;
    const value = Math.max(
      1000,
      Math.round(cost + (adjustedCurrent - cost) * progress + cost * wave)
    );
    return { month, value };
  });
};

