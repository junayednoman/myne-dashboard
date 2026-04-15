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

export type CreateAdminBagPayload = {
  bagBrand: string;
  bagModel: string;
  bagImage: File;
};

export type UpdateAdminBagPayload = {
  id: string;
  bagImage: File;
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
    createAdminBag: builder.mutation<unknown, CreateAdminBagPayload>({
      query: ({ bagBrand, bagModel, bagImage }) => {
        const formData = new FormData();
        formData.append("bagBrand", bagBrand);
        formData.append("bagModel", bagModel);
        formData.append("bagImage", bagImage);
        return {
          url: "/admin/bags",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["adminBag"],
    }),
    updateAdminBag: builder.mutation<unknown, UpdateAdminBagPayload>({
      query: ({ id, bagImage }) => {
        const formData = new FormData();
        formData.append("bagImage", bagImage);
        return {
          url: `/admin/bags/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["adminBag"],
    }),
  }),
});

export const {
  useGetAdminBagsQuery,
  useDeleteAdminBagMutation,
  useCreateAdminBagMutation,
  useUpdateAdminBagMutation,
} = adminBagApi;
