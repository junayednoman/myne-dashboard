import { baseApi } from "./baseApi";

export type AdminBagItemResponse = {
  _id: string;
  bagBrand?: {
    brandName?: string;
  };
  bagModel?: {
    modelName?: string;
  };
  image: string;
  productionYear: string;
  priceStatus?: {
    currentValue?: number;
  };
};

export type AdminBagListResponse = {
  success: boolean;
  status: number;
  message: string;
  data: AdminBagItemResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type AdminBagListQuery = {
  page: number;
  limit: number;
};

export type DeleteAdminBagPayload = {
  id: string;
};

const adminBagApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminBags: builder.query<AdminBagListResponse, AdminBagListQuery>({
      query: ({ page, limit }) => ({
        url: "/admin/bags",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["adminBag"],
    }),
    deleteAdminBag: builder.mutation<unknown, DeleteAdminBagPayload>({
      query: ({ id }) => ({
        url: `/admin/bags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["adminBag"],
    }),
  }),
});

export const { useGetAdminBagsQuery, useDeleteAdminBagMutation } = adminBagApi;
