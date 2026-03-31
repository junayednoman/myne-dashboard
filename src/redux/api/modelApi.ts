import { baseApi } from "./baseApi";

export type ModelItemResponse = {
  _id: string;
  modelName: string;
  brandId: string;
  modelImage: string;
  createdAt: string;
  updatedAt: string;
};

export type ModelListResponse = {
  success: boolean;
  status: number;
  message: string;
  data: ModelItemResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ModelListQuery = {
  page: number;
  limit: number;
};

export type CreateModelPayload = {
  modelName: string;
  brandId: string;
  modelImage: File;
};

export type DeleteModelPayload = {
  id: string;
};

export type UpdateModelPayload = {
  id: string;
  modelName?: string;
  brandId?: string;
  modelImage?: File;
};

const modelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getModels: builder.query<ModelListResponse, ModelListQuery>({
      query: ({ page, limit }) => ({
        url: "/admin/model",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["model"],
    }),
    createModel: builder.mutation<unknown, CreateModelPayload>({
      query: ({ modelName, brandId, modelImage }) => {
        const formData = new FormData();
        formData.append("modelName", modelName);
        formData.append("brandId", brandId);
        formData.append("modelImage", modelImage);
        return {
          url: "/admin/model",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["model"],
    }),
    deleteModel: builder.mutation<unknown, DeleteModelPayload>({
      query: ({ id }) => ({
        url: `/admin/model/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["model"],
    }),
    updateModel: builder.mutation<unknown, UpdateModelPayload>({
      query: ({ id, modelName, brandId, modelImage }) => {
        const formData = new FormData();
        if (modelName) formData.append("modelName", modelName);
        if (brandId) formData.append("brandId", brandId);
        if (modelImage) formData.append("modelImage", modelImage);
        return {
          url: `/admin/model/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["model"],
    }),
  }),
});

export const {
  useGetModelsQuery,
  useCreateModelMutation,
  useDeleteModelMutation,
  useUpdateModelMutation,
} = modelApi;
