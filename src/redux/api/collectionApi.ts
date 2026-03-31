import { baseApi } from "./baseApi";

export type CollectionItem = {
  _id: string;
  primaryImage: string | null;
  images: string[];
  priceStatus: {
    trend: "up" | "down" | "stable";
    changePercentage: number;
    currentValue: number;
    currency: string;
  };
  purchasePrice: number | null;
  purchaseDate: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  brand: {
    _id: string;
    brandLogo: string;
    brandName: string;
  };
  model: {
    _id: string;
    modelName: string;
    brandId: string;
    modelImage: string;
  };
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
};

export type CollectionResponse = {
  success: boolean;
  status: number;
  message: string;
  data: CollectionItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type CollectionQuery = {
  page: number;
  limit: number;
};

const collectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCollections: builder.query<CollectionResponse, CollectionQuery>({
      query: ({ page, limit }) => ({
        url: "/admin/collections",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["collection"],
    }),
    getCollectionById: builder.query<{ data: CollectionItem }, string>({
      query: (id) => ({
        url: `/admin/collections/${id}`,
        method: "GET",
      }),
      providesTags: ["collection"],
    }),
  }),
});

export const { useGetCollectionsQuery, useGetCollectionByIdQuery } =
  collectionApi;
