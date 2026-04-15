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
  month: string;
};

const monthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthShortLabels: Record<string, string> = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};

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
  const fallbackYears = Array.from(
    { length: Math.max(2030 - currentYear + 1, 1) },
    (_, index) => currentYear + index,
  );

  const yearFilterOptions = fallbackYears.map((year) => ({
    value: `${year}`,
    label: `${year}`,
  }));

  const [selectedYear, setSelectedYear] = useState<string>(`${currentYear}`);

  useEffect(() => {
    const hasSelected = yearFilterOptions.some(
      (option) => option.value === selectedYear,
    );
    if (!hasSelected && yearFilterOptions.length > 0) {
      setSelectedYear(`${currentYear}`);
    }
  }, [currentYear, selectedYear, yearFilterOptions]);

  const filteredData = useMemo(() => {
    if (Number(selectedYear) !== currentYear) {
      return Object.entries(monthShortLabels).map(([, shortLabel]) => ({
        month: shortLabel,
        users: 0,
      }));
    }

    const monthMap = new Map<string, number>();
    userActivity.forEach((item) => {
      monthMap.set(item.month, item.count);
    });

    return monthLabels.map((label) => ({
      month: monthShortLabels[label],
      users: monthMap.get(label) ?? 0,
    }));
  }, [currentYear, selectedYear, userActivity]);

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
