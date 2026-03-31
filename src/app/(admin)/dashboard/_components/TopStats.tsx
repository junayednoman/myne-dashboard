import {
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  ShoppingBag,
  Users,
} from "lucide-react";
import { StatCard } from "./StatCard";

type TopStatsProps = {
  stats?: {
    totalUsers: number;
    totalBags: number;
    totalCost: number;
    currentValue: number;
  };
};

const TopStats = ({ stats }: TopStatsProps) => {
  // const formatNumber = (value: number) =>
  //   new Intl.NumberFormat("en-US").format(value);
  // const formatCurrency = (value: number) =>
  //   new Intl.NumberFormat("de-DE", {
  //     style: "currency",
  //     currency: "EUR",
  //     minimumFractionDigits: 2,
  //   }).format(value);

  const totalUsers = stats?.totalUsers ?? 0;
  const totalBags = stats?.totalBags ?? 0;
  const totalCost = stats?.totalCost ?? 0;
  const currentValue = stats?.currentValue ?? 0;
  console.log("currentValue", currentValue);
  const statCards = [
    {
      label: "Total User",
      value: totalUsers,
      icon: Users,
      iconBgColor: "bg-[#1da1f2]",
    },
    {
      label: "Total Bags",
      value: totalBags,
      icon: ShoppingBag,
      iconBgColor: "bg-[#8b3ff2]",
    },
    {
      label: "Total Cost",
      value: totalCost,
      icon: CircleDollarSign,
      iconBgColor: "bg-[#00d26a]",
    },
    {
      label: "Current value",
      value: currentValue,
      icon: ChartNoAxesColumnIncreasing,
      iconBgColor: "bg-[#ff6a1a]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statCards.map((stat) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          iconBgColor={stat.iconBgColor}
        />
      ))}
    </div>
  );
};

export default TopStats;
