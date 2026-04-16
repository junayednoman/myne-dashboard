import { baseApi } from "./baseApi";

export type AdminBagItemResponse = {
  _id: string;
  bagBrand?: {
    _id?: string;
    brandName?: string;
  };
  bagModel?: {
    _id?: string;
    modelName?: string;
  };
  bagColor?: string;
  leatherType?: string;
  hardwareColor?: string | null;
  size?: string;
  condition?: string | null;
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
  bagColor: string;
  leatherType: string;
  hardwareColor?: string;
  size: string;
  condition?: string;
  bagImage: File;
};

export type UpdateAdminBagPayload = {
  id: string;
  bagBrand: string;
  bagModel: string;
  bagColor: string;
  leatherType: string;
  hardwareColor?: string;
  size: string;
  condition?: string;
  bagImage?: File;
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
      query: ({
        bagBrand,
        bagModel,
        bagColor,
        leatherType,
        hardwareColor,
        size,
        condition,
        bagImage,
      }) => {
        const formData = new FormData();
        formData.append("bagBrand", bagBrand);
        formData.append("bagModel", bagModel);
        formData.append("bagColor", bagColor);
        formData.append("leatherType", leatherType);
        formData.append("size", size);
        if (hardwareColor) formData.append("hardwareColor", hardwareColor);
        if (condition) formData.append("condition", condition);
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
      query: ({
        id,
        bagBrand,
        bagModel,
        bagColor,
        leatherType,
        hardwareColor,
        size,
        condition,
        bagImage,
      }) => {
        const formData = new FormData();
        formData.append("bagBrand", bagBrand);
        formData.append("bagModel", bagModel);
        formData.append("bagColor", bagColor);
        formData.append("leatherType", leatherType);
        formData.append("size", size);
        if (hardwareColor) formData.append("hardwareColor", hardwareColor);
        if (condition) formData.append("condition", condition);
        if (bagImage) formData.append("bagImage", bagImage);
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
