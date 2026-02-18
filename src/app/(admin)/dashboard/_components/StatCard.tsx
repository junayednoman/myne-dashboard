import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  iconBgColor = "bg-blue-500",
  iconColor = "text-white",
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`flex min-h-[110px] items-center gap-6 rounded-[8px] border border-[#3a404a] bg-[#151a22]/80 p-4 px-8 backdrop-blur-sm ${className}`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] ${iconBgColor}`}
      >
        <Icon className={`size-[20px] ${iconColor}`} />
      </div>

      <div className="flex flex-1 flex-col gap-1 space-y-4">
        <p className="text-[15px] leading-none font-medium text-[#b8bec8]">
          {label}
        </p>
        <p className="text-[30px] leading-none font-semibold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
