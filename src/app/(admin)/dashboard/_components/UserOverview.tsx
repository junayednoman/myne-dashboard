"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserActivityItem = {
  count: number;
  month: number;
  year: number;
};

const monthLabels = [
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
  "Nov",
  "Dec",
];

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const UserOverview = ({
  userActivity,
}: {
  userActivity: UserActivityItem[];
}) => {
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    new Set(userActivity.map((item) => item.year)),
  ).sort((a, b) => a - b);
  const fallbackYears =
    availableYears.length > 0
      ? availableYears
      : Array.from({ length: 3 }, (_, index) => currentYear - 1 + index);

  const yearFilterOptions = fallbackYears.map((year) => ({
    value: `${year}`,
    label: `${year}`,
  }));

  const [selectedYear, setSelectedYear] = useState<string>(
    yearFilterOptions[yearFilterOptions.length - 1]?.value ??
      `${currentYear}`,
  );

  useEffect(() => {
    const hasSelected = yearFilterOptions.some(
      (option) => option.value === selectedYear,
    );
    if (!hasSelected && yearFilterOptions.length > 0) {
      setSelectedYear(yearFilterOptions[yearFilterOptions.length - 1].value);
    }
  }, [selectedYear, yearFilterOptions]);

  const filteredData = useMemo(() => {
    const year = Number(selectedYear);
    const byYear = userActivity.filter((item) => item.year === year);

    const monthMap = new Map<number, number>();
    byYear.forEach((item) => {
      monthMap.set(item.month, item.count);
    });

    return monthLabels.map((label, index) => ({
      month: label,
      users: monthMap.get(index + 1) ?? 0,
    }));
  }, [selectedYear, userActivity]);

  return (
    <section className="rounded-[8px] border border-[#3a404a] bg-[#151a22]/80 p-6 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-white">User Overview</h2>

        <div className="flex items-center gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-9 w-[110px] border-border bg-card text-foreground">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="border-border bg-card">
              {yearFilterOptions.map((yearOption) => (
                <SelectItem key={yearOption.value} value={yearOption.value}>
                  {yearOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="mt-6 h-[280px] w-full">
        <AreaChart
          accessibilityLayer
          data={filteredData}
          margin={{ left: 8, right: 8 }}
        >
          <defs>
            <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-users)"
                stopOpacity={0.35}
              />
              <stop
                offset="95%"
                stopColor="var(--color-users)"
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="users"
            type="monotone"
            fill="url(#fillUsers)"
            fillOpacity={1}
            stroke="var(--color-users)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ChartContainer>
    </section>
  );
};

export default UserOverview;
