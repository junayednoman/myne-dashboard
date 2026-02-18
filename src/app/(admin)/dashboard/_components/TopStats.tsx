import {
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  ShoppingBag,
  Users,
} from "lucide-react";
import { StatCard } from "./StatCard";

const TopStats = () => {
  const stats = [
    {
      label: "Total User",
      value: "12,847",
      icon: Users,
      iconBgColor: "bg-[#1da1f2]",
    },
    {
      label: "Total Bags",
      value: "1,225",
      icon: ShoppingBag,
      iconBgColor: "bg-[#8b3ff2]",
    },
    {
      label: "Total Cost",
      value: "€68,420,00",
      icon: CircleDollarSign,
      iconBgColor: "bg-[#00d26a]",
    },
    {
      label: "Current value",
      value: "€68,420,00",
      icon: ChartNoAxesColumnIncreasing,
      iconBgColor: "bg-[#ff6a1a]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
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
