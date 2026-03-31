"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholder-image";

export interface BrandStatusItem {
  id: string;
  brandName: string;
  totalBags: number;
  brandLogo: string;
  bagCost: number;
  currentValue: number;
  percentageChange: number;
}

export function TopBrandStatus({
  topBrands,
}: {
  topBrands: BrandStatusItem[];
}) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-2xl font-bold text-card-foreground">
        Top Brand Status
      </h2>

      <div className="mb-2 grid grid-cols-[minmax(0,1.2fr)_minmax(130px,0.7fr)_minmax(210px,1fr)] items-center gap-6">
        <div />
        <p className="text-right text-xs font-medium text-muted-foreground">
          Bag cost
        </p>
        <p className="text-right text-xs font-medium text-muted-foreground">
          Current value
        </p>
      </div>

      <div className="space-y-2">
        {topBrands.map((item, index) => (
          <div
            key={item.id}
            className={`grid grid-cols-[minmax(0,1.2fr)_minmax(130px,0.7fr)_minmax(210px,1fr)] items-center gap-6 py-2 ${
              index !== topBrands.length - 1
                ? "border-b border-border"
                : ""
            }`}
          >
            {/* Brand Info */}
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={item.brandLogo || PLACEHOLDER_IMAGE}
                  alt={item.brandName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-card-foreground">
                  {item.brandName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Total Bags: {item.totalBags.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Bag Cost */}
            <div className="flex-shrink-0 text-right">
              <p className="text-base font-semibold text-card-foreground">
                {formatCurrency(item.bagCost)}
              </p>
            </div>

            {/* Current Value */}
            <div className="flex-shrink-0 text-right">
              <div className="flex items-center justify-end gap-2">
                <p className="text-base font-semibold text-card-foreground">
                  {formatCurrency(item.currentValue)}
                </p>
                <div className="flex items-center gap-1">
                  {item.percentageChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      item.percentageChange >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {formatPercentage(item.percentageChange)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
