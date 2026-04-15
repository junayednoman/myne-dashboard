import { baseApi } from "./baseApi";

export type BrandItemResponse = {
  _id: string;
  brandName: string;
  brandLogo: string;
};

export type BrandListResponse = {
  success: boolean;
  status: number;
  message: string;
  data: BrandItemResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type BrandListQuery = {
  page: number;
  limit: number;
};

export type CreateBrandPayload = {
  brandName: string;
  brandLogo: File;
};

export type DeleteBrandPayload = {
  id: string;
};

export type UpdateBrandPayload = {
  id: string;
  brandName: string;
  brandLogo?: File;
};

const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<BrandListResponse, BrandListQuery>({
      query: ({ page, limit }) => ({
        url: "/admin/brands",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["brand"],
    }),
    createBrand: builder.mutation<unknown, CreateBrandPayload>({
      query: ({ brandName, brandLogo }) => {
        const formData = new FormData();
        formData.append("brandName", brandName);
        formData.append("brandLogo", brandLogo);
        return {
          url: "/admin/brands",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["brand"],
    }),
    deleteBrand: builder.mutation<unknown, DeleteBrandPayload>({
      query: ({ id }) => ({
        url: `/admin/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["brand"],
    }),
    updateBrand: builder.mutation<unknown, UpdateBrandPayload>({
      query: ({ id, brandName, brandLogo }) => {
        const formData = new FormData();
        if(brandName){
          formData.append("brandName", brandName);
        }
        if (brandLogo) {
          formData.append("brandLogo", brandLogo);
        }
        return {
          url: `/admin/brands/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["brand"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
} = brandApi;
