"use client";

import { useMemo, useState } from "react";
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

const baseMonthlyData = [
  { month: "Jan", users: 4200 },
  { month: "Feb", users: 4600 },
  { month: "Mar", users: 4900 },
  { month: "Apr", users: 5300 },
  { month: "May", users: 6100 },
  { month: "Jun", users: 6600 },
  { month: "Jul", users: 7100 },
  { month: "Aug", users: 7400 },
  { month: "Sep", users: 7900 },
  { month: "Oct", users: 8400 },
  { month: "Nov", users: 9000 },
  { month: "Dec", users: 9600 },
];

const currentYear = new Date().getFullYear();
const yearFilterOptions = Array.from({ length: 11 }, (_, index) => {
  const year = currentYear - 5 + index;
  return { value: `${year}`, label: `${year}` };
});

const chartData = yearFilterOptions.flatMap((option) => {
  const year = Number(option.value);
  const yearOffset = year - currentYear;
  const factor = 1 + yearOffset * 0.06;

  return baseMonthlyData.map((item) => ({
    year: option.value,
    month: item.month,
    users: Math.round(item.users * factor),
  }));
});

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const UserOverview = () => {
  const [selectedYear, setSelectedYear] = useState<string>(`${currentYear}`);

  const filteredData = useMemo(() => {
    return chartData.filter((item) => item.year === selectedYear);
  }, [selectedYear]);

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
