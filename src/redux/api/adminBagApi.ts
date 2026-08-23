import { baseApi } from "./baseApi";

export type AdminBagItemResponse = {
  _id: string;
  brand?: {
    _id?: string;
    brandName?: string;
  };
  model?: {
    _id?: string;
    modelName?: string;
  };
  bagColor?: string | string[];
  material?: string;
  leatherType?: string;
  hardwareColor?: string | null;
  size?: string;
  condition?: string | null;
  variant?: string | null;
  specialVariant?: string | null;
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
  brandId: string;
  modelId: string;
  bagColor: string[];
  hardwareColor: string;
  wearChecklist?: string[];
  size: string;
  yearsOfBag: string;
  material: string;
  condition: string;
  variant: string;
  specialVariant: string;
  bagImage: File;
};

export type UpdateAdminBagPayload = {
  id: string;
  bagColor: string[];
  material: string;
  hardwareColor: string;
  size: string;
  condition: string;
  variant: string;
  specialVariant: string;
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
        brandId,
        modelId,
        bagColor,
        material,
        hardwareColor,
        wearChecklist,
        size,
        yearsOfBag,
        condition,
        variant,
        bagImage,
        specialVariant,
      }) => {
        const formData = new FormData();
        formData.append("brandId", brandId);
        formData.append("modelId", modelId);
        formData.append("material", material);
        formData.append("specialVariant", specialVariant);
        formData.append("size", size);
        formData.append("yearsOfBag", yearsOfBag);
        formData.append("hardwareColor", hardwareColor);
        formData.append("condition", condition);
        formData.append("variant", variant);
        formData.append("bagImage", bagImage);
        bagColor.forEach((color) => formData.append("bagColor", color));
        wearChecklist?.forEach((item) =>
          formData.append("wearChecklist", item),
        );
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
        bagColor,
        material,
        hardwareColor,
        size,
        condition,
        variant,
        specialVariant,
        bagImage,
      }) => {
        const formData = new FormData();
        bagColor.forEach((color) => formData.append("bagColor", color));
        formData.append("material", material);
        formData.append("specialVariant", specialVariant);
        formData.append("size", size);
        formData.append("hardwareColor", hardwareColor);
        formData.append("condition", condition);
        formData.append("variant", variant);
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
