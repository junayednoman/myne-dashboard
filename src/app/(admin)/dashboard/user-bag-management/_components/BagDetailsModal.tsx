"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";
import { useGetCollectionByIdQuery } from "@/redux/api/collectionApi";
import { UserBagItem } from "../types";
import {
  buildHistoricalValues,
  formatCurrency,
  HISTORY_YEAR_OPTIONS,
} from "../utils";

type BagDetailsModalProps = {
  open: boolean;
  bag: UserBagItem | null;
  bagId: string | null;
  historyYear: string;
  onHistoryYearChange: (year: string) => void;
  onOpenChange: (open: boolean) => void;
};

export default function BagDetailsModal({
  open,
  bag,
  bagId,
  historyYear,
  onHistoryYearChange,
  onOpenChange,
}: BagDetailsModalProps) {
  const { data } = useGetCollectionByIdQuery(bagId ?? "", {
    skip: !bagId || !open,
  });

  const details = data?.data;
  const placeholderImage =
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
  const bagImage =
    details?.primaryImage ||
    details?.images?.[0] ||
    details?.model?.modelImage ||
    bag?.bagImage ||
    placeholderImage;
  const bagName = details?.model?.modelName || bag?.bagName || "Bag";
  const brandName = details?.brand?.brandName || bag?.brand || "N/A";
  const purchaseYear =
    details?.productionYear ??
    (details?.purchaseDate
      ? new Date(details.purchaseDate).getFullYear()
      : bag?.purchaseYear);
  const purchasePrice = details?.purchasePrice ?? bag?.cost ?? 0;
  const currentValue = details?.priceStatus?.currentValue ?? bag?.currentValue ?? 0;
  const changePct = details?.priceStatus?.changePercentage;
  const isUp =
    changePct !== undefined
      ? changePct >= 0
      : currentValue >= purchasePrice;
  const pctValue =
    changePct !== undefined
      ? Math.abs(changePct)
      : purchasePrice
        ? (Math.abs(currentValue - purchasePrice) / purchasePrice) * 100
        : 0;

  const storyItems = useMemo(
    () => [
      {
        label: "Purchase Location:",
        value: details?.purchaseLocation ?? "N/A",
      },
      {
        label: "Purchase Date:",
        value: details?.purchaseDate
          ? new Date(details.purchaseDate).toLocaleDateString()
          : "N/A",
      },
      {
        label: "Waiting Time:",
        value:
          details?.waitingTimeInDays !== undefined
            ? `${details.waitingTimeInDays} days`
            : "N/A",
      },
    ],
    [details],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        key={bag?.id ?? "bag-details"}
        showCloseButton={false}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card/95 p-0 backdrop-blur-md [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {bag && (
          <div className="space-y-3 p-4">
            <div className="relative rounded-xl border border-border bg-black px-10 py-6">
              <button className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-1.5 text-white/70">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-1.5 text-white/70">
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white/70"
                aria-label="Close bag details modal"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex justify-center">
                <div className="relative h-56 w-56">
                  <Image
                    src={bagImage}
                    alt={bagName}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="mt-2 flex justify-center gap-1">
                <span className="h-1.5 w-4 rounded-full bg-white" />
                <span className="h-1.5 w-2 rounded-full bg-white/40" />
                <span className="h-1.5 w-2 rounded-full bg-white/40" />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/80">
              <div className="border-b border-border px-4 py-3">
                <DialogTitle className="text-lg font-bold text-card-foreground">
                  Bag Details
                </DialogTitle>
              </div>
              <div className="space-y-0 px-4 py-2 text-sm">
                <div className="flex items-center justify-between border-b border-border py-2.5">
                  <span className="text-muted-foreground">Brand:</span>
                  <span className="text-card-foreground">{brandName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border py-2.5">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="text-card-foreground">
                    {details?.model?.modelName ?? bag?.model ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border py-2.5">
                  <span className="text-muted-foreground">Color:</span>
                  <span className="text-card-foreground">
                    {details?.bagColor ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border py-2.5">
                  <span className="text-muted-foreground">Leather Type:</span>
                  <span className="text-card-foreground">
                    {details?.latherType ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border py-2.5">
                  <span className="text-muted-foreground">Condition:</span>
                  <span className="text-card-foreground">
                    {details?.condition ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-muted-foreground">Year:</span>
                  <span className="text-card-foreground">
                    {purchaseYear ?? "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card/80 p-4">
                <p className="text-xs text-muted-foreground">Purchase Price</p>
                <p className="mt-1 text-2xl font-bold text-card-foreground">
                  {formatCurrency(purchasePrice)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card/80 p-4">
                <p className="text-xs text-green-500">Current Value</p>
                <div className="mt-1 flex items-end justify-between gap-2">
                  <p className="text-2xl font-bold text-card-foreground">
                    {formatCurrency(currentValue)}
                  </p>
                  <p
                    className={`inline-flex items-center gap-1 text-sm font-semibold ${
                      isUp
                        ? "text-green-500"
                        : "text-destructive"
                    }`}
                  >
                    {isUp ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {isUp ? "+" : "-"}
                    {pctValue.toFixed(1)}
                    %
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/80 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-card-foreground">
                  Historical Value
                </h3>
                <Select value={historyYear} onValueChange={onHistoryYearChange}>
                  <SelectTrigger className="h-8 w-[110px] border-border bg-card text-xs text-muted-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HISTORY_YEAR_OPTIONS.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={buildHistoricalValues(
                      purchasePrice,
                      currentValue,
                      Number(historyYear),
                    )}
                  >
                    <defs>
                      <linearGradient
                        id="bagValueFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#21c97a"
                          stopOpacity={0.45}
                        />
                        <stop
                          offset="95%"
                          stopColor="#21c97a"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="2 2"
                      stroke="rgba(255,255,255,0.08)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#9ca3af", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#9ca3af", fontSize: 11 }}
                      tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                      tickLine={false}
                      axisLine={false}
                      width={36}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelStyle={{ color: "#fff" }}
                      contentStyle={{
                        background: "#11141a",
                        border: "1px solid #2c323b",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#21c97a"
                      fill="url(#bagValueFill)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/80 p-4">
              <h3 className="mb-3 text-xl font-semibold text-card-foreground">
                Ownership Story
              </h3>
              <div className="space-y-2 text-sm">
                {storyItems.map((item) => (
                  <p
                    key={item.label}
                    className="flex items-center justify-between border-b border-border py-1.5"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-card-foreground">{item.value}</span>
                  </p>
                ))}
                <div className="pt-1">
                  <p className="mb-1 text-muted-foreground">My Story:</p>
                  <p className="text-muted-foreground">
                    {details?.notes ?? "No notes provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
