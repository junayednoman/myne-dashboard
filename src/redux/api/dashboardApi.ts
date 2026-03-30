import { baseApi } from "./baseApi";

export type DashboardStatsResponse = {
  success: boolean;
  status: number;
  message: string;
  data: {
    success: boolean;
    data: {
      totalUsers: number;
      totalBags: number;
      totalCost: number;
      currentValue: number;
      userActivity: Array<{
        count: number;
        month: number;
        year: number;
      }>;
      topBrands: Array<{
        _id: string;
        brandName: string;
        brandLogo: string;
        totalBags: number;
        bagCost: number;
        currentValue: number;
        percentageChange: number;
      }>;
    };
  };
};

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: "/admin/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
