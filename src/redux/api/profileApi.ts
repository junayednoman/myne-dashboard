import { baseApi } from "./baseApi";

export type AdminProfileResponse = {
  success: boolean;
  message: string;
  data: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    location: string;
  };
};

export type UpdateAdminProfilePayload = {
  name: string;
  phone: string;
  location: string;
};

export type UpdateAdminPasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProfile: builder.query<AdminProfileResponse, void>({
      query: () => ({
        url: "/admin/profile",
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    updateAdminProfile: builder.mutation<
      AdminProfileResponse,
      UpdateAdminProfilePayload
    >({
      query: (body) => ({
        url: "/admin/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["profile"],
    }),
    updateAdminAvatar: builder.mutation<AdminProfileResponse, FormData>({
      query: (body) => ({
        url: "/admin/profile/avatar",
        method: "POST",
        body,
      }),
      invalidatesTags: ["profile"],
    }),
    updateAdminPassword: builder.mutation<AdminProfileResponse, UpdateAdminPasswordPayload>({
      query: (body) => ({
        url: "/admin/profile/password",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useUpdateAdminAvatarMutation,
  useUpdateAdminPasswordMutation,
} = profileApi;
