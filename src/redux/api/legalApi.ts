import { baseApi } from "./baseApi";

export type LegalContentResponse = {
  success: boolean;
  status: number;
  message: string;
  data: {
    _id: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
  };
};

export type UpdateLegalPayload = {
  description: string;
};

const legalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacyPolicy: builder.query<LegalContentResponse, void>({
      query: () => ({
        url: "/privacy-and-policy",
        method: "GET",
      }),
      providesTags: ["legal"],
    }),
    getTermsAndConditions: builder.query<LegalContentResponse, void>({
      query: () => ({
        url: "/term-and-condition",
        method: "GET",
      }),
      providesTags: ["legal"],
    }),
    updatePrivacyPolicy: builder.mutation<LegalContentResponse, UpdateLegalPayload>({
      query: (body) => ({
        url: "/admin/privacy-and-policy",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["legal"],
    }),
    updateTermsAndConditions: builder.mutation<
      LegalContentResponse,
      UpdateLegalPayload
    >({
      query: (body) => ({
        url: "/admin/term-and-condition",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["legal"],
    }),
  }),
});

export const {
  useGetPrivacyPolicyQuery,
  useGetTermsAndConditionsQuery,
  useUpdatePrivacyPolicyMutation,
  useUpdateTermsAndConditionsMutation,
} = legalApi;
