"use client";

import { TopBrandStatus } from "./TopBrandStatus";
import TopStats from "./TopStats";
import UserOverview from "./UserOverview";
import { UserTable } from "./UserTable";
import { useGetDashboardStatsQuery } from "@/redux/api/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardContainer = () => {
  const { data, isLoading, isError, error } = useGetDashboardStatsQuery();
  const stats = data?.data?.data;
  const userActivity = Array.isArray(stats?.userActivity)
    ? stats.userActivity
    : [];
  const topBrands = Array.isArray(stats?.topBrands)
    ? stats.topBrands.map((brand) => ({
        id: brand._id,
        brandName: brand.brandName,
        brandLogo: brand.brandLogo,
        totalBags: brand.totalBags,
        bagCost: brand.bagCost,
        currentValue: brand.currentValue,
        percentageChange: brand.percentageChange,
      }))
    : [];

  const errorMessage = (() => {
    if (!isError) return "";
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "data" in error) {
      const dataError = (error as { data?: { message?: string } }).data;
      if (dataError?.message) return dataError.message;
    }
    return "Failed to load dashboard data. Please try again.";
  })();

  return (
    <section className="space-y-6">
      {isError ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full" />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Skeleton className="h-[360px] w-full" />
            <Skeleton className="h-[360px] w-full" />
          </div>

          <Skeleton className="h-[420px] w-full" />
        </>
      ) : !stats ? (
        <div className="rounded-lg border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          No dashboard data available.
        </div>
      ) : (
        <>
          <TopStats stats={stats} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <UserOverview userActivity={userActivity} />
            <TopBrandStatus topBrands={topBrands} />
          </div>

          <UserTable />
        </>
      )}
    </section>
  );
};

export default DashboardContainer;
