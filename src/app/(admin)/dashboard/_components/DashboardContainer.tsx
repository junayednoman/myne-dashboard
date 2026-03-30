"use client";

import { TopBrandStatus } from "./TopBrandStatus";
import TopStats from "./TopStats";
import UserOverview from "./UserOverview";
import { UserTable } from "./UserTable";
import { useGetDashboardStatsQuery } from "@/redux/api/dashboardApi";

const DashboardContainer = () => {
  const { data } = useGetDashboardStatsQuery();
  const stats = data?.data?.data;
  const topBrands =
    stats?.topBrands?.map((brand) => ({
      id: brand._id,
      brandName: brand.brandName,
      brandLogo: brand.brandLogo,
      totalBags: brand.totalBags,
      bagCost: brand.bagCost,
      currentValue: brand.currentValue,
      percentageChange: brand.percentageChange,
    })) ?? [];

  return (
    <section className="space-y-6">
      <TopStats stats={stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <UserOverview userActivity={stats?.userActivity ?? []} />
        <TopBrandStatus topBrands={topBrands} />
      </div>

      <UserTable />
    </section>
  );
};

export default DashboardContainer;
